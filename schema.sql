CREATE TABLE messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  text TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  user_email TEXT NOT NULL
);

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura para usuarios autenticados" 
ON messages FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir insercao pelo proprio usuario" 
ON messages FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);
