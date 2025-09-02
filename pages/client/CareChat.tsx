
import React, { useState, useEffect, useRef } from 'react';
import { generateChatResponse, getInitialGreeting } from '../../services/gemini';
import { Send, Bot, User as UserIcon } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function CareChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGreeting = async () => {
      setLoading(true);
      const greeting = await getInitialGreeting();
      setMessages([{ sender: 'bot', text: greeting }]);
      setLoading(false);
    };
    fetchGreeting();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || loading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const botResponse = await generateChatResponse(input);
      const botMessage: Message = { sender: 'bot', text: botResponse };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: 'bot', text: 'Desculpe, não consigo responder agora. Tente novamente mais tarde.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold font-display text-center">Assistente de Pós-Cuidado</h1>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center"><Bot className="h-5 w-5"/></div>}
            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-indigo-700' : 'bg-gray-700'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.sender === 'user' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center"><UserIcon className="h-5 w-5"/></div>}
          </div>
        ))}
        {loading && messages[messages.length - 1]?.sender === 'user' && (
           <div className="flex items-start gap-3">
             <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center"><Bot className="h-5 w-5"/></div>
             <div className="max-w-md p-3 rounded-lg bg-gray-700">
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-900 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua pergunta sobre cuidados..."
            className="flex-1 bg-transparent p-3 focus:outline-none"
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading} className="p-3 text-indigo-400 hover:text-indigo-300 disabled:text-gray-600">
            <Send className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
