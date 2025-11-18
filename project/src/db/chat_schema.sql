-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'bot')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS chat_messages_user_id ON chat_messages(user_id);

-- Enable Row Level Security
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chat_conversations
CREATE POLICY "Users can view their own conversations"
  ON chat_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON chat_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view their own messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);
