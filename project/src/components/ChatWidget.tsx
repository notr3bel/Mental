import { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, X, Send, AlertCircle } from 'lucide-react';


export function ChatWidget() {
  const { user } = useAuth();
  const { messages, loading, error, sendMessage, clearError, databaseReady } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };

  const conversationMessages = messages || [];
  const hasError = error !== null && error !== '';

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {isOpen ? (
        <div className="w-96 h-[600px] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-xl">🤝</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Mental Buddy</h3>
                <p className="text-xs text-blue-100">Your supportive companion</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {hasError ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <AlertCircle className="text-red-600 mx-auto mb-3" size={32} />
                  <p className="text-red-900 font-medium mb-2">Chat Setup Required</p>
                  <p className="text-sm text-red-700 mb-4">{error}</p>
                  <div className="bg-white p-3 rounded text-left text-xs text-gray-700 border border-red-100">
                    <p className="font-semibold mb-2">To fix this:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Check the SUPABASE_SETUP.md file in the project root</li>
                      <li>Follow the setup instructions to create database tables</li>
                      <li>Reload this page once setup is complete</li>
                    </ol>
                  </div>
                </div>
              </div>
            ) : conversationMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-2">👋</div>
                <p className="text-gray-600 font-medium">Hey there!</p>
                <p className="text-sm text-gray-500 mt-2">I&apos;m here to chat and support you. What&apos;s on your mind today?</p>
              </div>
            ) : (
              <>
                {conversationMessages.map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-lg ${
                        msg.sender_type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-lg rounded-bl-none">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-gray-200 p-4 bg-white rounded-b-xl flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={loading || hasError}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim() || hasError}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
