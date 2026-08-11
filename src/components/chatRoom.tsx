import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

interface Message {
  id: string;
  created_at: string;
  text: string;
  user_id: string;
  user_email: string;
}

interface ChatRoomProps {
  user: User;
}

export default function ChatRoom({ user }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => [...prev, msg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const textToSend = newMessage;
    setNewMessage('');

    await supabase.from('messages').insert([
      {
        text: textToSend,
        user_id: user.id,
        user_email: user.email,
      },
    ]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="app-container">
      <header style={{ background: 'white', padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#2563eb', fontSize: '1.5rem', fontWeight: 'bold' }}>Carlos</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>{user.email}</span>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Sair
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        {messages.map((msg) => {
          const isMine = msg.user_id === user.id;
          return (
            <div key={msg.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', textAlign: isMine ? 'right' : 'left' }}>
                {isMine ? 'Você' : msg.user_email?.split('@')[0]}
              </span>
              <div style={{
                background: isMine ? '#2563eb' : '#e5e7eb',
                color: isMine ? 'white' : '#1f2937',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                marginTop: '0.25rem'
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </main>

      <form onSubmit={handleSend} style={{ background: 'white', padding: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.5rem', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '24px', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}>
          Enviar
        </button>
      </form>

      <footer className="footer-credits">
        Desenvolvido por David Delgado
      </footer>
    </div>
  );
}
