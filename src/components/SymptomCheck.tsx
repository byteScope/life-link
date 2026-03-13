import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Send, Star, ChevronRight, Bot, User } from 'lucide-react';
import { createChatSession, sendChatMessage, listDoctors, type Doctor } from '../api';

type Message = {
  id: string;
  role: 'user' | 'bot';
  text: string;
  suggestedSpecialty?: string;
};

const KEYWORD_TO_SPECIALTY: Record<string, string> = {
  heart: 'Cardiology',
  chest: 'Cardiology',
  blood: 'General Practice',
  fever: 'General Practice',
  cold: 'General Practice',
  cough: 'General Practice',
  child: 'Pediatrics',
  kid: 'Pediatrics',
  baby: 'Pediatrics',
  skin: 'Dermatology',
  rash: 'Dermatology',
  anxiety: 'Mental Health',
  stress: 'Mental Health',
  depression: 'Mental Health',
  stomach: 'Internal Medicine',
  stomachache: 'Internal Medicine',
  headache: 'General Practice',
  pain: 'General Practice',
};

function getSuggestedSpecialty(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const [keyword, spec] of Object.entries(KEYWORD_TO_SPECIALTY)) {
    if (lower.includes(keyword)) return spec;
  }
  return undefined;
}

function toDisplayDoctor(d: Doctor): { name: string; spec: string; rating: number; reviews: number; initial: string } {
  const name = d.name ?? 'Doctor';
  const spec = d.specialty ?? 'General Practice';
  return {
    name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
    spec,
    rating: typeof d.rating === 'number' ? d.rating : 4.5,
    reviews: typeof d.reviews === 'number' ? d.reviews : 0,
    initial: name.replace(/^Dr\.\s*/, '').charAt(0).toUpperCase() || 'D',
  };
}

const INITIAL_BOT = "Hi! I'm here to help. What symptoms or health concerns are you experiencing today? You can describe them in a few words.";

export default function SymptomCheck() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'bot', text: INITIAL_BOT },
  ]);
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedSpecialty, setSuggestedSpecialty] = useState<string | null>(null);
  const [suggestedDoctors, setSuggestedDoctors] = useState<{ name: string; spec: string; rating: number; reviews: number; initial: string }[]>([]);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    createChatSession()
      .then((s) => setChatSessionId(s.id))
      .catch(() => setChatSessionId(null));
  }, []);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);
    setChatError(null);

    const specialty = getSuggestedSpecialty(trimmed);

    try {
      let botText: string;
      if (chatSessionId) {
        const res = await sendChatMessage(chatSessionId, trimmed);
        botText = (res.reply ?? res.message ?? '').trim() || "Thanks for sharing. I'll help you find the right doctor.";
      } else {
        botText = "Thanks for sharing. Can you tell me a bit more about your symptoms (e.g. how long you've had them, severity)?";
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: botText,
        ...(specialty && { suggestedSpecialty: specialty }),
      };
      setMessages((prev) => [...prev, botMsg]);

      if (specialty) {
        setSuggestedSpecialty(specialty);
        setShowSuggestions(true);
        listDoctors({ specialty })
          .then((list) => setSuggestedDoctors(list.map(toDisplayDoctor)))
          .catch(() => setSuggestedDoctors([]));
      }
    } catch (e) {
      setChatError(e instanceof Error ? e.message : 'Message failed');
      const fallback: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: specialty
          ? `Based on what you've described, it may help to see a **${specialty}** specialist. Here are some doctors we recommend:`
          : "Thanks for sharing. Can you tell me a bit more about your symptoms?",
        ...(specialty && { suggestedSpecialty: specialty }),
      };
      setMessages((prev) => [...prev, fallback]);
      if (specialty) {
        setSuggestedSpecialty(specialty);
        setShowSuggestions(true);
        listDoctors({ specialty })
          .then((list) => setSuggestedDoctors(list.map(toDisplayDoctor)))
          .catch(() => setSuggestedDoctors([]));
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF9F6' }}>
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Symptom Check</h1>
          <p className="text-gray-600">Chat about your symptoms and we’ll suggest the right doctors for you.</p>
        </div>

        <Card className="flex flex-col rounded-2xl border bg-white overflow-hidden" style={{ minHeight: '480px' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-[#1F6FB2]/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-[#1F6FB2]" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#1F6FB2] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {msg.text.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {showSuggestions && (
              <div className="pt-2">
                <p className="text-sm font-semibold text-gray-700 mb-3">Suggested doctors for you</p>
                <div className="space-y-3">
                  {suggestedDoctors.map((doc) => (
                    <Card
                      key={doc.name}
                      className="p-4 rounded-xl border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#1F6FB2]/20 flex items-center justify-center text-[#1F6FB2] font-semibold">
                            {doc.initial}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-500">{doc.spec}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-0.5">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              {doc.rating} ({doc.reviews} reviews)
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="rounded-xl shrink-0"
                          style={{ backgroundColor: '#1BC47D' }}
                          onClick={() => navigate('/doctors')}
                        >
                          Book
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  You can also browse all doctors and choose in-person or video consultation.
                </p>
                <Link to="/doctors">
                  <Button variant="outline" className="mt-2 rounded-xl w-full">
                    See all doctors
                  </Button>
                </Link>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-gray-50">
            {chatError && (
              <p className="text-sm text-red-600 mb-2">{chatError}</p>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Describe your symptoms..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                className="rounded-xl flex-1"
              />
              <Button
                className="rounded-xl shrink-0"
                style={{ backgroundColor: '#1F6FB2' }}
                onClick={sendMessage}
                disabled={!input.trim() || sending}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
