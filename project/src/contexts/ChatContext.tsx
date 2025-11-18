import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { getChatbotResponse } from '../services/chatbot';


interface ChatMessage {
  id: string;
  conversation_id: string;
  message: string;
  sender_type: 'user' | 'bot';
  created_at: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  conversationId: string | null;
  loading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearError: () => void;
  databaseReady: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [databaseReady, setDatabaseReady] = useState(false);

  // Initialize or fetch conversation
  useEffect(() => {
    if (!user) {
      setConversationId(null);
      setMessages([]);
      setDatabaseReady(false);
      return;
    }

    const initializeConversation = async () => {
      try {
        // Check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.warn('User session not found');
          setError('Please log in to use the chat');
          setDatabaseReady(false);
          return;
        }

        // Fetch latest conversation
        const { data: conversations, error: fetchError } = await supabase
          .from('chat_conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError) {
          console.error('Error fetching conversations:', fetchError);
          // Check if it's a "relation does not exist" error
          if (fetchError.message?.includes('relation') || fetchError.message?.includes('does not exist')) {
            setError('Chat database is not set up yet. Please contact support.');
            setDatabaseReady(false);
            return;
          }
          setError('Unable to load chat. Please refresh the page.');
          setDatabaseReady(false);
          return;
        }

        let activeConversationId: string;

        if (conversations && conversations.length > 0) {
          activeConversationId = conversations[0].id;
        } else {
          // Create new conversation
          const { data: newConversation, error: createError } = await supabase
            .from('chat_conversations')
            .insert([{ user_id: user.id }])
            .select()
            .single();

          if (createError) {
            console.error('Error creating conversation:', createError);
            setError('Unable to start a new chat. Please refresh the page.');
            setDatabaseReady(false);
            return;
          }
          activeConversationId = newConversation.id;
        }

        setConversationId(activeConversationId);

        // Fetch messages for this conversation
        const { data: messagesData, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', activeConversationId)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          // Don't fail the initialization if messages fetch fails
          setMessages([]);
        } else {
          setMessages(messagesData || []);
        }
        
        // Clear any previous errors once successful
        setError(null);
        setDatabaseReady(true);
      } catch (err) {
        console.error('Error initializing conversation:', err);
        setError('Failed to initialize chat. Please refresh the page.');
        setDatabaseReady(false);
      }
    };

    initializeConversation();
  }, [user]);

  const sendMessage = async (userMessage: string) => {
    if (!user || !conversationId || !userMessage.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Save user message
      const { data: userMsg, error: userMsgError } = await supabase
        .from('chat_messages')
        .insert([
          {
            conversation_id: conversationId,
            user_id: user.id,
            message: userMessage,
            sender_type: 'user',
          },
        ])
        .select()
        .single();

      if (userMsgError) throw userMsgError;

      // Get bot response
      const conversationHistory = messages
        .filter(m => m.conversation_id === conversationId)
        .map(m => ({
          role: m.sender_type === 'user' ? 'user' : 'assistant',
          message: m.message,
        }));

      const botResponse = await getChatbotResponse(userMessage, conversationHistory);

      // Save bot message
      const { data: botMsg, error: botMsgError } = await supabase
        .from('chat_messages')
        .insert([
          {
            conversation_id: conversationId,
            user_id: user.id,
            message: botResponse,
            sender_type: 'bot',
          },
        ])
        .select()
        .single();

      if (botMsgError) throw botMsgError;

      // Update messages state
      setMessages(prev => [...prev, userMsg, botMsg]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <ChatContext.Provider value={{ messages, conversationId, loading, error, sendMessage, clearError, databaseReady }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
