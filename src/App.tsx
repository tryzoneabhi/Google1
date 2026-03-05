/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Layout, 
  Code, 
  Zap, 
  Shield, 
  MessageSquare, 
  Send, 
  X, 
  Menu, 
  Instagram, 
  Youtube, 
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Settings,
  LogOut,
  User,
  ChevronRight,
  ArrowLeft,
  ChevronDown,
  Monitor,
  Smartphone,
  Globe,
  LogIn
} from 'lucide-react';
import { AppData, Project, Service, Setting } from './types';
import { supabase } from './services/supabaseClient';

// --- Components ---

const Navbar = ({ onAdminClick, isAdmin, user, onLogout, onStartChat }: { onAdminClick: () => void, isAdmin: boolean, user: any, onLogout: () => void, onStartChat: () => void }) => (
  <motion.nav 
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
  >
    <div className="max-w-7xl mx-auto glass rounded-[2rem] px-8 py-4 flex justify-between items-center border border-white/10 shadow-2xl backdrop-blur-2xl">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="text-2xl font-display font-black tracking-tighter text-accent cursor-pointer flex items-center gap-2"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-black rounded-sm rotate-45" />
        </div>
        WEBORA
      </motion.div>
      
      <div className="hidden md:flex items-center gap-10">
        {['Home', 'Services', 'Projects', 'About'].map((item) => (
          <button 
            key={item}
            onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-accent transition-all relative group"
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onStartChat}
          className="p-3 glass rounded-2xl text-accent hover:bg-accent hover:text-black transition-all border border-white/5"
        >
          <MessageSquare size={20} />
        </motion.button>
        
        {user ? (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAdminClick}
            className="flex items-center gap-3 glass px-5 py-2.5 rounded-2xl border border-accent/20 hover:border-accent/50 transition-all"
          >
            <div className="w-8 h-8 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
              <User size={16} className="text-accent" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Account</span>
          </motion.button>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAdminClick}
            className="bg-accent text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all"
          >
            Sign In
          </motion.button>
        )}
      </div>
    </div>
  </motion.nav>
);

const Hero = ({ onStartChat, settings }: { onStartChat: () => void, settings: Setting[] }) => {
  const title = settings.find(s => s.key === 'hero_title')?.value || "Crafting **Industry-Level** Digital Experiences";
  const subtitle = settings.find(s => s.key === 'hero_subtitle')?.value || "We build dynamic, responsive, and high-performance websites tailored for your business growth.";
  
  // Function to parse title and highlight text between **
  const renderTitle = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={i} className="text-accent">{part.slice(2, -2)}</span>;
      }
      return part;
    });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full opacity-30" />
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-white/10 text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-xl"
          >
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            Innovating Digital Excellence
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black mb-10 leading-[0.85] tracking-tighter">
            {renderTitle(title)}
          </h1>
          
          <p className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
            {subtitle}
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-6 bg-accent text-black font-black rounded-2xl shadow-[0_20px_50px_rgba(0,255,136,0.3)] hover:shadow-[0_30px_60px_rgba(0,255,136,0.5)] transition-all text-xl uppercase tracking-widest relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartChat}
              className="px-12 py-6 glass border border-white/10 rounded-2xl font-black hover:bg-white/10 transition-all text-xl uppercase tracking-widest flex items-center gap-4 group"
            >
              <MessageSquare size={24} className="text-accent group-hover:scale-110 transition-transform" /> Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <div className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500">Explore</div>
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-16 bg-gradient-to-b from-accent via-accent/50 to-transparent"
        />
      </motion.div>
    </section>
  );
};

const ServiceCard = ({ service, onChoosePlan }: { service: Service, onChoosePlan: (planName: string) => void, key?: React.Key }) => (
  <div 
    className="glass p-8 rounded-[2.5rem] flex flex-col h-full border-white/10 hover:border-accent/50 transition-all group relative overflow-hidden hover:-translate-y-2"
  >
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
      {service.tier === 'elite' && <Globe size={120} />}
      {service.tier === 'pro' && <Code size={120} />}
      {service.tier === 'premium' && <Zap size={120} />}
      {service.tier === 'custom' && <Settings size={120} />}
    </div>

    <div className="text-accent mb-6 relative z-10">
      {service.tier === 'elite' && <Globe size={40} className="drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]" />}
      {service.tier === 'pro' && <Code size={40} className="drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]" />}
      {service.tier === 'premium' && <Zap size={40} className="drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]" />}
      {service.tier === 'custom' && <Settings size={40} className="drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]" />}
    </div>
    <h3 className="text-3xl font-display font-black mb-2 relative z-10">{service.name}</h3>
    <div className="text-5xl font-black mb-8 relative z-10 flex items-baseline gap-1">
      <span className="text-xl text-gray-500 font-medium">₹</span>
      {service.price}
    </div>
    <ul className="space-y-4 mb-10 flex-grow relative z-10">
      {(service.features || "").split(',').map((f, i) => (
        <li key={i} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
          <div className="mt-1 w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 border border-accent/20">
            <ChevronRight size={10} className="text-accent" />
          </div>
          {f.trim()}
        </li>
      ))}
    </ul>
    <button 
      onClick={() => onChoosePlan(service.name)}
      className="w-full py-5 rounded-2xl bg-white/5 hover:bg-accent hover:text-black font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:shadow-accent/20 relative z-10 group/btn overflow-hidden"
    >
      <span className="relative z-10">Choose {service.name}</span>
      <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
    </button>
  </div>
);

const AIChatBot = ({ context, isOpen, setIsOpen }: { context: string, isOpen: boolean, setIsOpen: (open: boolean) => void }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hi! I am Webora AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Using OpenRouter API as requested
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer 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`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Webora AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
          "messages": [
            {
              "role": "system",
              "content": `You are Webora AI, an advanced assistant built by Sanskar for Webora. 
              
              Context about Webora: ${context}
              
              Key Information:
              - Creator: You were created by Sanskar specifically for Webora. If anyone asks "Who made you?" or "Who is your creator?", you MUST answer: "I was created by Sanskar for Webora."
              - Webora's Mission: To provide industry-standard digital solutions.
              - Plans & Pricing:
                1. Elite (₹499): 1 Week Delivery, AI Integration, Database, Vercel Hosting.
                2. Pro (₹599): 6 Days Delivery, Source Code, Elite Features, Custom Domain.
                3. Premium (₹999): 5 Days Delivery, All Pro Features, 1 Year Maintenance, 10% Off.
                4. Custom: Tailored Solutions, Enterprise Grade, Dedicated Support.
              
              Guidelines:
              - If asked about plans or pricing, explain the details of Elite, Pro, Premium, and Custom plans clearly and encourage them to choose one.
              - Be helpful, professional, and concise.
              - Suggest using 'Get Started' or 'Contact Us' buttons for direct owner contact.`
            },
            ...messages.map(m => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.text
            }))
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "API Error");
      }

      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error: any) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: `Error: ${error.message || "I'm having trouble connecting right now."}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass w-80 md:w-96 h-[500px] rounded-3xl mb-4 flex flex-col overflow-hidden shadow-2xl border-white/20"
          >
            <div className="p-4 bg-accent text-black flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-bold">Webora AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${
                    m.role === 'user' ? 'bg-accent text-black font-medium' : 'bg-white/20 text-white border border-white/10'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-2xl flex gap-1">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-white/10 flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask AI anything..."
                className="flex-grow bg-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button onClick={handleSend} className="p-2 bg-accent text-black rounded-xl hover:scale-105 transition-transform">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-accent text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

const OwnerChatPage = ({ user, onClose, initialMessage }: { user: any, onClose: () => void, initialMessage?: string }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'admin', text: string, created_at?: string }[]>([]);
  const [input, setInput] = useState(initialMessage || '');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage);
    }
  }, [initialMessage]);

  const fetchMessages = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`/api/messages/${user.email}`);
      const data = await res.json();
      const formatted = data.flatMap((m: any) => {
        const msgs = [{ role: 'user', text: m.message, created_at: m.created_at }];
        if (m.reply) {
          msgs.push({ role: 'admin', text: m.reply, created_at: m.created_at });
        }
        return msgs;
      });
      setMessages(formatted.length > 0 ? formatted : [
        { role: 'admin', text: 'Hi! I am the owner of Webora. How can I help you with your project today?' }
      ]);
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const userMsg = input;
    setInput('');
    setLoading(true);
    
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.user_metadata?.full_name || user.email.split('@')[0],
          email: user.email,
          message: userMsg
        })
      });
      fetchMessages();
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/98 flex items-center justify-center p-0 md:p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative glass w-full max-w-5xl h-full md:h-[85vh] rounded-none md:rounded-[3rem] flex flex-col overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="p-5 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 text-gray-400 hover:text-white group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Back</span>
            </button>
            <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center border border-accent/30">
                <User size={24} className="text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold tracking-tight">Direct Support</h2>
                <div className="text-[9px] uppercase font-black tracking-widest text-gray-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  {user ? <span>{user.email}</span> : <span>Guest Mode</span>}
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X size={24} /></button>
        </div>
        
        <div ref={scrollRef} className="flex-grow p-4 md:p-8 overflow-y-auto space-y-6 scrollbar-hide bg-black/5">
          {messages.map((m, i) => (
            <div 
              key={i} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm md:text-base shadow-lg relative ${
                m.role === 'user' 
                  ? 'bg-accent text-black font-medium rounded-tr-none' 
                  : 'bg-white/10 text-white border border-white/5 rounded-tl-none'
              }`}>
                {m.text}
                {m.created_at && (
                  <div className={`text-[8px] mt-1.5 font-bold uppercase tracking-widest opacity-40 text-right ${m.role === 'user' ? 'text-black' : 'text-gray-400'}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-end">
              <div className="bg-accent/10 p-3 rounded-2xl flex gap-1 border border-accent/20">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          
          {!user && (
            <div className="text-center py-12 glass rounded-3xl border border-dashed border-white/10">
              <p className="text-gray-400 font-bold mb-2">Guest Session</p>
              <p className="text-xs text-gray-600 uppercase tracking-widest">Sign in to sync your conversation history</p>
            </div>
          )}
        </div>
        
        <div className="p-5 md:p-8 border-t border-white/10 bg-white/5">
          {user ? (
            <div className="flex gap-3">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                rows={1}
                className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent/50 transition-all resize-none scrollbar-hide"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-14 h-14 bg-accent text-black rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { document.dispatchEvent(new CustomEvent('open-login')); }}
              className="w-full py-4 bg-accent text-black font-black rounded-2xl uppercase tracking-widest text-xs"
            >
              Sign in to Chat
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- Admin Panel ---

const AdminPanel = ({ data, onUpdate, onClose, user }: { data: AppData, onUpdate: () => void, onClose: () => void, user: any }) => {
  const [viewMode, setViewMode] = useState<'web' | 'control'>('control');
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'settings' | 'messages' | 'admins'>('projects');
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', category: '', link: '', plan: '' });
  const [isUploading, setIsUploading] = useState(false);

  const [admins, setAdmins] = useState<any[]>([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '' });

  useEffect(() => {
    if (activeTab === 'admins' && user.is_super) {
      fetchAdmins();
    }
  }, [activeTab]);

  const fetchAdmins = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setAdmins(data);
  };

  const addAdmin = async () => {
    if (!newAdmin.email || !newAdmin.password) return;
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAdmin)
    });
    if (res.ok) {
      setNewAdmin({ email: '', password: '' });
      setShowAddAdmin(false);
      fetchAdmins();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to add admin");
    }
  };

  const deleteAdmin = async (id: number) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchAdmins();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to delete admin");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.imageUrl) {
        setNewProject({ ...newProject, image: data.imageUrl });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [adminReply, setAdminReply] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newSetting, setNewSetting] = useState({ key: '', value: '' });
  const [showAddSetting, setShowAddSetting] = useState(false);
  
  const [longPressTimeout, setLongPressTimeout] = useState<NodeJS.Timeout | null>(null);
  const [chatOptions, setChatOptions] = useState<{email: string, alias: string} | null>(null);
  const [chatToRename, setChatToRename] = useState<{email: string, alias: string} | null>(null);

  const startLongPress = (email: string, alias: string) => {
    const timeout = setTimeout(() => {
      setChatOptions({ email, alias });
    }, 2000);
    setLongPressTimeout(timeout);
  };

  const cancelLongPress = () => {
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
      setLongPressTimeout(null);
    }
  };

  const deleteThread = async (email: string) => {
    if (!confirm(`Are you sure you want to delete all messages from ${email}?`)) return;
    try {
      const res = await fetch(`/api/admin/threads/${email}`, { method: 'DELETE' });
      if (res.ok) {
        setChatOptions(null);
        fetchChats();
        if (selectedChat?.email === email) setSelectedChat(null);
      }
    } catch (err) {
      console.error("Delete thread error:", err);
      alert("Failed to delete thread");
    }
  };

  const updateAlias = async (email: string, alias: string) => {
    await fetch('/api/admin/threads/alias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, alias })
    });
    setChatToRename(null);
    fetchChats();
  };
  
  const [adminProjectFilter, setAdminProjectFilter] = useState('All');

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchChats();
    }
  }, [activeTab]);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/admin/threads');
      const data = await res.json();
      setChats(data);
    } catch (err) {
      console.error("Fetch threads error:", err);
    }
  };

  const fetchChatMessages = async (email: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${email}`);
      const data = await res.json();
      const formatted = data.flatMap((m: any) => {
        const msgs = [{ sender_id: 'user', message_text: m.message, id: m.id }];
        if (m.reply) {
          msgs.push({ sender_id: user.id, message_text: m.reply, id: `reply-${m.id}` });
        }
        return msgs;
      });
      setChatMessages(formatted);
    } catch (err) {
      console.error("Fetch chat messages error:", err);
    }
  };

  const sendReply = async () => {
    if (!adminReply.trim() || !selectedChat) return;
    // We reply to the latest message in the thread that doesn't have a reply yet, 
    // or just the latest one. For simplicity, we'll reply to the selectedChat.id
    // but really we should probably reply to the latest message from that user.
    try {
      await fetch('/api/admin/messages/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedChat.id, reply: adminReply })
      });
      setAdminReply('');
      fetchChats();
      if (selectedChat.email) {
        fetchChatMessages(selectedChat.email);
      }
    } catch (err) {
      console.error("Send reply error:", err);
    }
  };
  const updateService = async (tier: string, updates: { price?: string, features?: string }) => {
    await fetch('/api/admin/services/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, ...updates })
    });
    onUpdate();
  };

  const deleteProject = async (id: number) => {
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    onUpdate();
  };

  const addProject = async () => {
    if (!newProject.title || !newProject.category || !newProject.plan) {
      alert("Please fill in Title, Category, and Plan");
      return;
    }
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        setNewProject({ title: '', description: '', image: '', category: '', link: '', plan: '' });
        setShowAddProject(false);
        onUpdate();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add project");
      }
    } catch (err) {
      console.error("Add project error:", err);
      alert("An error occurred while adding the project");
    }
  };

  const updateProject = async () => {
    if (!editingProject) return;
    await fetch(`/api/admin/projects/${editingProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingProject)
    });
    setEditingProject(null);
    onUpdate();
  };

  if (viewMode === 'web') {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200]">
        <div className="glass px-6 py-3 rounded-full flex items-center gap-4 border border-accent/30 shadow-2xl">
          <div className="flex bg-white/5 p-1 rounded-full">
            <button 
              onClick={() => setViewMode('web')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'web' ? 'bg-accent text-black' : 'text-gray-400'}`}
            >
              Web
            </button>
            <button 
              onClick={() => setViewMode('control')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'control' ? 'bg-accent text-black' : 'text-gray-400'}`}
            >
              Control
            </button>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={18} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 md:p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass w-full max-w-6xl h-full md:h-[85vh] rounded-none md:rounded-[2.5rem] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10"
      >
              <div className="p-5 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 text-gray-400 hover:text-white group"
                  >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Back</span>
                  </button>
                  <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/30">
                        <Settings className="text-accent" size={20} />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Control Center</h2>
                    </div>
                    <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
                      <button 
                        onClick={() => setViewMode('web')}
                        className={`px-5 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'web' ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'text-gray-500 hover:text-white'}`}
                      >
                        Web View
                      </button>
                      <button 
                        onClick={() => setViewMode('control')}
                        className={`px-5 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'control' ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'text-gray-500 hover:text-white'}`}
                      >
                        Admin Panel
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all hover:rotate-90 duration-300"><X size={24} /></button>
              </div>
        
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible md:w-72 border-b md:border-b-0 md:border-r border-white/10 p-3 md:p-6 gap-3 scrollbar-hide bg-black/20">
            {[
              { id: 'projects', label: 'Projects', icon: <Layout size={18} /> },
              { id: 'services', label: 'Services', icon: <Zap size={18} /> },
              { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
              { id: 'admins', label: 'Admins', icon: <Shield size={18} />, superOnly: true }
            ].filter(tab => !tab.superOnly || user.is_super).map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-4 whitespace-nowrap md:w-full text-left px-5 py-4 rounded-2xl transition-all group relative overflow-hidden ${activeTab === tab.id ? 'text-black font-black shadow-xl shadow-accent/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeAdminTab"
                    className="absolute inset-0 bg-accent rounded-2xl"
                  />
                )}
                <span className={`relative z-10 ${activeTab === tab.id ? 'text-black' : 'text-accent group-hover:scale-110 transition-transform'}`}>{tab.icon}</span>
                <span className="relative z-10 text-sm uppercase tracking-widest font-bold">{tab.label}</span>
              </button>
            ))}
            
            <div className="mt-auto hidden md:block p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2">Active Session</div>
              <div className="text-xs font-bold truncate text-accent">{user.email}</div>
            </div>
          </div>
          
          <div className="flex-grow p-5 md:p-10 overflow-y-auto bg-black/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeTab === 'messages' && (
              <div className="flex flex-col md:flex-row h-full gap-6">
                <div className={`w-full md:w-1/3 md:border-r border-white/10 md:pr-6 space-y-4 ${selectedChat ? 'hidden md:block' : 'block'}`}>
                  <h3 className="text-lg md:text-xl mb-4">User Chats</h3>
                  <div className="space-y-3">
                    {chats.map(chat => (
                      <div key={chat.id} className="relative group/item">
                        <button 
                          onMouseDown={() => startLongPress(chat.email, chat.alias || 'User')}
                          onMouseUp={cancelLongPress}
                          onMouseLeave={cancelLongPress}
                          onTouchStart={() => startLongPress(chat.email, chat.alias || 'User')}
                          onTouchEnd={cancelLongPress}
                          onClick={() => {
                            setSelectedChat(chat);
                            fetchChatMessages(chat.email);
                          }}
                          className={`w-full text-left p-4 rounded-2xl transition-all ${selectedChat?.email === chat.email ? 'bg-accent/20 border border-accent/50' : 'glass hover:bg-white/5'}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex flex-col max-w-[150px]">
                              <div className="text-sm font-bold truncate text-accent">{chat.alias || 'User'}</div>
                              <div className="text-[10px] text-gray-500 truncate">{chat.email}</div>
                            </div>
                            <div className="text-[10px] text-gray-500">{new Date(chat.created_at).toLocaleDateString()}</div>
                          </div>
                          <div className="text-[11px] text-gray-400 line-clamp-1 mb-1">{chat.message}</div>
                          {chat.reply ? (
                            <div className="text-[9px] text-accent flex items-center gap-1">
                              <div className="w-1 h-1 bg-accent rounded-full"></div> Replied
                            </div>
                          ) : (
                            <div className="text-[9px] text-orange-400 flex items-center gap-1">
                              <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div> New Message
                            </div>
                          )}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatToRename({ email: chat.email, alias: chat.alias || '' });
                          }}
                          className="absolute top-2 right-2 p-1.5 glass rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity text-accent"
                          title="Rename User"
                        >
                          <Edit size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`flex-grow flex flex-col h-full ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                  {selectedChat ? (
                    <>
                      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 rounded-t-3xl">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setSelectedChat(null)} className="p-2 hover:bg-white/10 rounded-xl md:hidden"><ArrowLeft size={18} /></button>
                          <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/30">
                            <User size={20} className="text-accent" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{selectedChat.alias || 'User'}</div>
                            <div className="text-[10px] text-gray-500">{selectedChat.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide bg-black/5">
                        {chatMessages.map((m, i) => (
                          <div key={m.id || i} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm relative ${
                              m.sender_id === user.id 
                                ? 'bg-accent text-black font-medium rounded-tr-none' 
                                : 'bg-white/10 text-white border border-white/5 rounded-tl-none'
                            }`}>
                              {m.message_text}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 border-t border-white/10 bg-white/5 rounded-b-3xl">
                        <div className="flex gap-3">
                          <textarea 
                            value={adminReply}
                            onChange={e => setAdminReply(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendReply();
                              }
                            }}
                            placeholder="Type a reply..."
                            rows={1}
                            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-accent/50 transition-all resize-none scrollbar-hide"
                          />
                          <button 
                            onClick={sendReply}
                            disabled={!adminReply.trim()}
                            className="w-12 h-12 bg-accent text-black rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                          >
                            <Send size={18} />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        <MessageSquare size={32} className="opacity-20" />
                      </div>
                      <p className="text-sm font-medium">Select a conversation to start messaging</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="text-xl">Manage Projects</h3>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <select 
                      value={adminProjectFilter}
                      onChange={e => setAdminProjectFilter(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-accent outline-none transition-all"
                    >
                      <option value="All">All Projects</option>
                      <option value="Elite">Elite</option>
                      <option value="Pro">Pro</option>
                      <option value="Premium">Premium</option>
                      <option value="Custom">Custom</option>
                    </select>
                    <button 
                      onClick={() => setShowAddProject(!showAddProject)}
                      className="flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap"
                    >
                      <Plus size={16} /> {showAddProject ? 'Cancel' : 'Add Project'}
                    </button>
                  </div>
                </div>

                {showAddProject && (
                  <div className="glass p-4 md:p-6 rounded-2xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        placeholder="Title"
                        value={newProject.title}
                        onChange={e => setNewProject({...newProject, title: e.target.value})}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                      />
                      <input 
                        placeholder="Category"
                        value={newProject.category}
                        onChange={e => setNewProject({...newProject, category: e.target.value})}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase ml-1">Image URL</label>
                        <input 
                          placeholder="https://example.com/image.jpg"
                          value={newProject.image}
                          onChange={e => setNewProject({...newProject, image: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase ml-1">Or Upload from Gallery</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="project-image-upload"
                            disabled={isUploading}
                          />
                          <label 
                            htmlFor="project-image-upload"
                            className={`flex items-center justify-center gap-2 w-full bg-white/5 border border-dashed border-white/20 rounded-xl px-4 py-2 text-sm cursor-pointer hover:bg-white/10 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isUploading ? (
                              <div className="w-4 h-4 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                            ) : (
                              <Plus size={16} className="text-accent" />
                            )}
                            <span>{isUploading ? 'Uploading...' : 'Choose Image'}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase ml-1">Project Link (Optional)</label>
                        <input 
                          placeholder="https://github.com/..."
                          value={newProject.link}
                          onChange={e => setNewProject({...newProject, link: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase ml-1">Service Plan</label>
                        <select 
                          value={newProject.plan}
                          onChange={e => setNewProject({...newProject, plan: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                        >
                          <option value="">Select Plan</option>
                          <option value="Elite">Elite</option>
                          <option value="Pro">Pro</option>
                          <option value="Premium">Premium</option>
                          <option value="Custom">Custom</option>
                        </select>
                      </div>
                    </div>
                    <textarea 
                      placeholder="Description"
                      value={newProject.description}
                      onChange={e => setNewProject({...newProject, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 h-20 text-sm"
                    />
                    <button 
                      onClick={addProject}
                      className="w-full py-2 bg-accent text-black font-bold rounded-xl"
                    >
                      Save Project
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects
                    .filter(p => adminProjectFilter === 'All' || p.plan === adminProjectFilter)
                    .map(p => (
                    <div key={p.id} className="glass p-4 rounded-2xl flex justify-between items-center">
                      <div>
                        <div className="font-bold">{p.title}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 uppercase">{p.category}</span>
                          {p.plan && (
                            <span className="text-[10px] text-accent uppercase font-bold px-1.5 py-0.5 bg-accent/10 rounded border border-accent/20">{p.plan}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingProject(p)}
                          className="text-accent hover:bg-accent/10 p-2 rounded-lg"
                        >
                          <Edit size={18} />
                        </button>
                        <button onClick={() => deleteProject(p.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {editingProject && (
                  <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="glass w-full max-w-2xl p-6 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl">Edit Project</h3>
                        <button onClick={() => setEditingProject(null)}><X /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          placeholder="Title"
                          value={editingProject.title}
                          onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                        />
                        <input 
                          placeholder="Category"
                          value={editingProject.category}
                          onChange={e => setEditingProject({...editingProject, category: e.target.value})}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                        />
                      </div>
                      <input 
                        placeholder="Image URL"
                        value={editingProject.image}
                        onChange={e => setEditingProject({...editingProject, image: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                      />
                      <input 
                        placeholder="Project Link"
                        value={editingProject.link}
                        onChange={e => setEditingProject({...editingProject, link: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                      />
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase ml-1">Service Plan</label>
                        <select 
                          value={editingProject.plan || ''}
                          onChange={e => setEditingProject({...editingProject, plan: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                        >
                          <option value="">Select Plan</option>
                          <option value="Elite">Elite</option>
                          <option value="Pro">Pro</option>
                          <option value="Premium">Premium</option>
                          <option value="Custom">Custom</option>
                        </select>
                      </div>
                      <textarea 
                        placeholder="Description"
                        value={editingProject.description}
                        onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 h-24 text-sm"
                      />
                      <button 
                        onClick={updateProject}
                        className="w-full py-3 bg-accent text-black font-bold rounded-xl"
                      >
                        Update Project
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'admins' && user.is_super && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-display font-black tracking-tight">Admin Management</h3>
                  <button 
                    onClick={() => setShowAddAdmin(!showAddAdmin)}
                    className="flex items-center gap-2 bg-accent text-black px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-accent/20"
                  >
                    <Plus size={18} /> {showAddAdmin ? 'Cancel' : 'Add Admin'}
                  </button>
                </div>

                {showAddAdmin && (
                  <div className="glass p-6 rounded-2xl space-y-4 border border-accent/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        placeholder="Admin Email"
                        value={newAdmin.email}
                        onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                      />
                      <input 
                        type="password"
                        placeholder="Password"
                        value={newAdmin.password}
                        onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                    <button 
                      onClick={addAdmin}
                      className="w-full py-2 bg-accent text-black font-bold rounded-xl"
                    >
                      Create Admin Account
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {admins.map(admin => (
                    <div key={admin.id} className="glass p-4 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${admin.is_super ? 'bg-accent' : 'bg-gray-500'}`} />
                        <div>
                          <div className="font-bold">{admin.email}</div>
                          <div className="text-[10px] text-gray-500 uppercase">{admin.is_super ? 'Super Admin' : 'Admin'}</div>
                        </div>
                      </div>
                      {!admin.is_super && (
                        <button onClick={() => deleteAdmin(admin.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unified Chat Options Modal placeholder removed */}

            {activeTab === 'services' && (
              <div className="space-y-8">
                <h3 className="text-xl">Service Plans & Pricing</h3>
                <div className="grid grid-cols-1 gap-6">
                  {data.services.map(s => (
                    <div key={s.id} className="glass p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-accent text-sm font-bold mb-1 uppercase">{s.tier}</div>
                          <div className="text-xl font-bold">{s.name}</div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                          <span className="text-gray-400 text-sm">₹</span>
                          <input 
                            type="text" 
                            defaultValue={s.price}
                            onBlur={(e) => updateService(s.tier, { price: e.target.value })}
                            className="bg-transparent border-none outline-none w-20 text-center font-bold"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase font-bold">Features (comma separated)</label>
                        <textarea 
                          defaultValue={s.features}
                          onBlur={(e) => updateService(s.tier, { features: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors h-24 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-display">Hero & About Content</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 uppercase">Hero Title (Use **text** for highlight)</label>
                      <input 
                        type="text" 
                        defaultValue={data.settings.find(s => s.key === 'hero_title')?.value}
                        onBlur={async (e) => {
                          await fetch('/api/admin/update-settings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key: 'hero_title', value: e.target.value })
                          });
                          onUpdate();
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 uppercase">Hero Subtitle</label>
                      <textarea 
                        defaultValue={data.settings.find(s => s.key === 'hero_subtitle')?.value}
                        onBlur={async (e) => {
                          await fetch('/api/admin/update-settings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key: 'hero_subtitle', value: e.target.value })
                          });
                          onUpdate();
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors h-24"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 uppercase">About Section Text</label>
                      <textarea 
                        defaultValue={data.settings.find(s => s.key === 'about_text')?.value}
                        onBlur={async (e) => {
                          await fetch('/api/admin/update-settings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key: 'about_text', value: e.target.value })
                          });
                          onUpdate();
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors h-32"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl">General Settings</h3>
                    <button 
                      onClick={() => setShowAddSetting(!showAddSetting)}
                      className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {showAddSetting && (
                    <div className="glass p-4 rounded-2xl space-y-4 border border-accent/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          placeholder="Setting Key (e.g. twitter_link)"
                          value={newSetting.key}
                          onChange={e => setNewSetting({...newSetting, key: e.target.value.toLowerCase().replace(' ', '_')})}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                        />
                        <input 
                          placeholder="Value"
                          value={newSetting.value}
                          onChange={e => setNewSetting({...newSetting, value: e.target.value})}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                        />
                      </div>
                      <button 
                        onClick={async () => {
                          if (!newSetting.key || !newSetting.value) return;
                          await fetch('/api/admin/update-settings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newSetting)
                          });
                          setNewSetting({ key: '', value: '' });
                          setShowAddSetting(false);
                          onUpdate();
                        }}
                        className="w-full py-2 bg-accent text-black font-bold rounded-xl"
                      >
                        Add Setting
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {data.settings.filter(s => !['hero_title', 'hero_subtitle', 'about_text'].includes(s.key)).map(s => (
                      <div key={s.key} className="space-y-1">
                        <label className="text-xs text-gray-400 uppercase">{s.key.replace(/_/g, ' ')}</label>
                        <input 
                          type="text" 
                          defaultValue={s.value}
                          onBlur={async (e) => {
                            await fetch('/api/admin/update-settings', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ key: s.key, value: e.target.value })
                            });
                            onUpdate();
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>

    {/* Unified Chat Options Modal */}
    <AnimatePresence>
      {chatOptions && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-8 text-center border-b border-white/10 bg-white/5">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/20">
                <User size={32} className="text-accent" />
              </div>
              <div className="text-xl font-display font-black mb-1">{chatOptions.alias}</div>
              <div className="text-xs text-gray-500 font-medium">{chatOptions.email}</div>
            </div>
            <div className="p-4 space-y-2">
              <button 
                onClick={() => {
                  setChatToRename({ email: chatOptions.email, alias: chatOptions.alias });
                  setChatOptions(null);
                }}
                className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold hover:bg-white/5 rounded-2xl transition-all text-left text-accent group"
              >
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Edit size={16} />
                </div>
                Edit Display Name
              </button>
              <button 
                onClick={() => deleteThread(chatOptions.email)}
                className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold hover:bg-red-500/10 rounded-2xl transition-all text-left text-red-500 group"
              >
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trash2 size={16} />
                </div>
                Delete Conversation
              </button>
              <button 
                onClick={() => setChatOptions(null)}
                className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold hover:bg-white/5 rounded-2xl transition-all text-left text-gray-400 group"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <X size={16} />
                </div>
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Rename Chat Modal */}
    <AnimatePresence>
      {chatToRename && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass p-8 rounded-[2.5rem] max-w-sm w-full space-y-6 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
                <Edit size={24} className="text-accent" />
              </div>
              <h3 className="text-2xl font-display font-black">Rename User</h3>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Custom Alias (Admin Only)</label>
              <input 
                value={chatToRename.alias}
                onChange={e => setChatToRename({...chatToRename, alias: e.target.value})}
                placeholder="Enter name..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-accent outline-none transition-all"
                autoFocus
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setChatToRename(null)} className="flex-grow py-4 glass rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={() => updateAlias(chatToRename.email, chatToRename.alias)} className="flex-grow py-4 bg-accent text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-accent/20 transition-all">Save Changes</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </div>
  );
};

// --- Main App ---

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showOwnerChat, setShowOwnerChat] = useState<{ open: boolean, message?: string }>({ open: false });
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  const [viewMode, setViewMode] = useState<'web' | 'control'>('web');

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleOpenLogin = () => setShowLogin(true);
    document.addEventListener('open-login', handleOpenLogin);
    return () => document.removeEventListener('open-login', handleOpenLogin);
  }, []);

  const fetchData = async (retries = 3) => {
    try {
      // Try local API first
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        return;
      }
      
      // Fallback to Supabase directly if local API fails (e.g. on Vercel)
      console.log("Local API failed, falling back to Supabase...");
      const { data: settings } = await supabase.from('settings').select('*');
      const { data: projects } = await supabase.from('projects').select('*');
      const { data: services } = await supabase.from('services').select('*');
      
      if (settings && projects && services) {
        setData({ settings, projects, services });
      } else {
        throw new Error("Failed to fetch from Supabase");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (retries > 0) {
        setTimeout(() => fetchData(retries - 1), 2000);
      }
    }
  };

  useEffect(() => {
    fetchData();

    // Supabase Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        const role = session.user.email?.toLowerCase() === '1singhsanskar11@gmail.com' ? 'admin' : 'user';
        setUserRole(role);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setUserRole('user');
        setViewMode('web');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      const { data: session } = await supabase.auth.getSession();
      const email = session.session?.user?.email?.toLowerCase();
      const isAdmin = email === '1singhsanskar11@gmail.com';

      if (profile) {
        if (isAdmin) {
          setUserRole('admin');
          if (profile.role !== 'admin') {
            await supabase.from('profiles').update({ role: 'admin' }).eq('id', userId);
          }
        } else {
          setUserRole(profile.role);
        }
      } else if (error && error.code === 'PGRST116') {
        if (session.session?.user) {
          const role = isAdmin ? 'admin' : 'user';
          await supabase.from('profiles').insert({
            id: userId,
            email: session.session.user.email,
            role: role
          });
          setUserRole(role);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleAdminAccess = () => {
    if (user) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      setShowLogin(true);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete your account? This will remove your profile and sign you out.")) return;
    
    setAuthLoading(true);
    try {
      // Delete profile first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Delete user messages
      await fetch(`/api/user/messages/${user.email}`, { method: 'DELETE' });

      // Sign out
      await supabase.auth.signOut();
      setShowUserProfile(false);
      alert("Account data removed and signed out.");
    } catch (err: any) {
      alert(err.message || "Failed to delete account");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthAction = async () => {
    setAuthError(null);
    if (!loginEmail || !loginPass) {
      setAuthError("Please enter both email and password");
      return;
    }
    
    setAuthLoading(true);
    try {
      // First, check if it's an admin login via our local DB
      const adminRes = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });

      if (adminRes.ok) {
        const adminData = await adminRes.json();
        setUser({ id: 'admin-' + adminData.admin.email, email: adminData.admin.email, is_admin: true, is_super: adminData.admin.is_super });
        setUserRole('admin');
        setShowLogin(false);
        setViewMode('control');
        setAuthLoading(false);
        return;
      }

      // If not an admin, proceed with Supabase for regular users
      if (isSignUp) {
        const { data: authData, error } = await supabase.auth.signUp({
          email: loginEmail,
          password: loginPass,
        });
        
        if (error) throw error;
        
        if (authData.user) {
          const role = 'user'; // Regular users are always 'user'
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            email: authData.user.email,
            role: role
          });
          
          if (authData.session) {
            setShowLogin(false);
          } else {
            setAuthError("Signup successful! Please check your email for confirmation.");
            setIsSignUp(false);
          }
        }
      } else {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPass,
        });
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Wrong email or password. Please try again.");
          }
          throw error;
        }
        
        if (signInData.user) {
          setShowLogin(false);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "An error occurred");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowAdmin(false);
  };

  if (!data) return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full" />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-accent/20">
          <div className="w-10 h-10 bg-black rounded-lg rotate-45" />
        </div>
        <h2 className="text-2xl font-display font-black tracking-tighter text-white mb-2">WEBORA</h2>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div 
              key={i}
              className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-500 mt-6">Loading Experience</p>
        
        <button 
          onClick={() => fetchData()}
          className="mt-12 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );

  const context = `Services: ${data.services.map(s => `${s.name} (₹${s.price})`).join(', ')}. Projects: ${data.projects.map(p => p.title).join(', ')}.`;

  return (
    <div className="relative overflow-x-hidden">
      <Navbar 
        onAdminClick={handleAdminAccess} 
        isAdmin={userRole === 'admin'} 
        user={user}
        onLogout={handleLogout}
        onStartChat={() => setShowOwnerChat({ open: true })}
      />

      {/* Profile Dropdown Menu */}
      <AnimatePresence>
        {showProfileMenu && user && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-[60] glass w-72 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 bg-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent opacity-50" />
              <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Authenticated User</div>
              <div className="text-sm font-black truncate text-white">{user.email}</div>
              <div className="inline-block px-2 py-0.5 bg-accent/10 text-accent text-[9px] font-black uppercase rounded border border-accent/20 mt-2">{userRole}</div>
            </div>
            
            <div className="p-3 space-y-1">
              {userRole === 'admin' && (
                <>
                  <button 
                    onClick={() => { setViewMode('control'); setShowProfileMenu(false); }}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all text-left group ${viewMode === 'control' ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    <Settings size={16} className={viewMode === 'control' ? 'text-black' : 'text-accent'} /> 
                    <span>Control Panel</span>
                    {viewMode !== 'control' && <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>
                  <button 
                    onClick={() => { setViewMode('web'); setShowProfileMenu(false); }}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all text-left group ${viewMode === 'web' ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    <Globe size={16} className={viewMode === 'web' ? 'text-black' : 'text-accent'} /> 
                    <span>Live Website</span>
                    {viewMode !== 'web' && <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>
                  <div className="h-px bg-white/5 my-2 mx-2" />
                </>
              )}
              
              <button 
                onClick={() => { setShowUserProfile(true); setShowProfileMenu(false); }}
                className="w-full flex items-center gap-4 px-4 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-all text-left group"
              >
                <User size={16} className="text-accent" /> 
                <span>My Profile</span>
                <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all text-left group"
              >
                <LogOut size={16} className="text-red-500" /> 
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content or Admin Panel */}
      {userRole === 'admin' && viewMode === 'control' ? (
        <AdminPanel data={data} onUpdate={fetchData} onClose={() => setViewMode('web')} user={user} />
      ) : (
        <>
          <Hero onStartChat={() => setShowOwnerChat({ open: true })} settings={data.settings} />

          {/* Services Section */}
          <section id="services" className="py-32 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-24"
              >
                <h2 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tight">Our Expertise</h2>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">Choose the perfect plan for your digital presence.</p>
                <div className="w-24 h-1.5 bg-accent mx-auto rounded-full mt-8" />
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.services.map((s: Service, idx: number) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <ServiceCard 
                      service={s} 
                      onChoosePlan={(plan) => setShowOwnerChat({ open: true, message: `Hi! I am interested in the ${plan} plan. Can we discuss further?` })} 
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="py-20 px-6 bg-secondary/50">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h2 className="text-4xl md:text-5xl mb-4">Selected Work</h2>
                  <p className="text-gray-400">Industry-level projects crafted with precision.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="appearance-none bg-white/5 border border-white/10 rounded-2xl px-6 py-3 pr-12 text-sm font-black uppercase tracking-widest outline-none focus:border-accent/50 transition-all cursor-pointer hover:bg-white/10"
                    >
                      {['All', 'Elite', 'Pro', 'Premium', 'Custom'].map(plan => (
                        <option key={plan} value={plan} className="bg-black text-white">{plan}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.projects.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-white/10 rounded-3xl">
                    No projects added yet. Admin can add them via dashboard.
                  </div>
                ) : (
                  data.projects
                    .filter(p => filter === 'All' || p.plan === filter)
                    .map((p: Project) => (
                    <div 
                      key={p.id}
                      className="group relative aspect-video rounded-3xl overflow-hidden glass border border-white/5 hover:border-accent/50 transition-all shadow-2xl hover:-translate-y-2"
                    >
                      <img 
                        src={p.image ? (p.image.startsWith('http') ? p.image : p.image) : "https://picsum.photos/seed/webora-project/1200/800?blur=2"} 
                        alt={p.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" 
                        referrerPolicy="no-referrer" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://picsum.photos/seed/webora-fallback/1200/800?blur=2";
                        }}
                      />
                      
                      {/* Overlay with options */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        {p.link && (
                          <button 
                            onClick={() => window.open(p.link, '_blank')}
                            className="bg-accent text-black px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
                          >
                            <Globe size={16} /> Go to Web
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedProject(p)}
                          className="bg-white/10 backdrop-blur-md text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/20 transition-all"
                        >
                          Details
                        </button>
                      </div>

                      <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity">
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] text-accent font-bold uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">{p.category}</span>
                              {p.plan && (
                                <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-md border border-white/10">{p.plan}</span>
                              )}
                            </div>
                            <h3 className="text-xl font-bold">{p.title}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-20 px-6 max-w-4xl mx-auto text-center">
            <div className="w-32 h-32 bg-accent/20 rounded-full mx-auto mb-8 flex items-center justify-center border-2 border-accent/50">
              <User size={64} className="text-accent" />
            </div>
            <h2 className="text-4xl mb-6">About the Creator</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              {data.settings.find(s => s.key === 'about_text')?.value || "I am Sanskar, a dedicated developer focused on building high-performance web applications."}
            </p>
            <div className="flex justify-center gap-6">
              <a href={data.settings.find(s => s.key === 'instagram_link')?.value} className="p-3 glass rounded-full hover:text-accent transition-colors"><Instagram /></a>
              <a href={data.settings.find(s => s.key === 'youtube_link')?.value} className="p-3 glass rounded-full hover:text-accent transition-colors"><Youtube /></a>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 px-6 border-t border-white/10 text-center text-gray-500 text-sm">
            <div className="text-accent font-display font-bold text-xl mb-4">WEBORA</div>
            <p>{data.settings.find(s => s.key === 'footer_text')?.value}</p>
          </footer>
        </>
      )}

      <AnimatePresence>
        {showOwnerChat.open && (
          <OwnerChatPage 
            user={user} 
            onClose={() => setShowOwnerChat({ open: false })} 
            initialMessage={showOwnerChat.message}
          />
        )}
      </AnimatePresence>

      <AIChatBot context={context} isOpen={isChatOpen} setIsOpen={setIsChatOpen} />

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="relative aspect-video">
              <img 
                src={selectedProject.image ? (selectedProject.image.startsWith('http') ? selectedProject.image : selectedProject.image) : "https://picsum.photos/seed/webora-project/1200/800?blur=2"} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/webora-fallback/1200/800?blur=2";
                }}
              />
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-black/80 rounded-full transition-colors"
              >
                <X />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-accent font-bold uppercase text-xs bg-accent/10 px-3 py-1 rounded-full border border-accent/20">{selectedProject.category}</div>
                {selectedProject.plan && (
                  <div className="text-white/50 font-bold uppercase text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10">{selectedProject.plan} Plan</div>
                )}
              </div>
              <h2 className="text-3xl font-display mb-4">{selectedProject.title}</h2>
              <p className="text-gray-400 text-lg mb-8">{selectedProject.description}</p>
              <div className="flex gap-4">
                {selectedProject.link && (
                  <a 
                    href={selectedProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-accent text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    Visit Website <ExternalLink size={18} />
                  </a>
                )}
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="glass px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserProfile && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass w-full max-w-md p-8 rounded-3xl text-center border border-white/10 shadow-2xl"
          >
            <div className="w-20 h-20 bg-accent/20 rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-accent/50">
              <User size={40} className="text-accent" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">My Profile</h2>
            <p className="text-gray-400 mb-8 text-sm">{user?.email}</p>
            
            <div className="space-y-3">
              <div className="p-4 glass rounded-2xl text-left border border-white/5 mb-4">
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Account Role</div>
                <div className="text-sm font-bold text-accent capitalize">{userRole}</div>
              </div>

              {userRole === 'admin' && (
                <button 
                  onClick={() => { setShowUserProfile(false); setShowAdmin(true); }}
                  className="w-full py-3.5 bg-accent text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Settings size={18} /> Admin Dashboard
                </button>
              )}

              <button 
                onClick={handleLogout}
                className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <LogOut size={18} /> Logout
              </button>

              <button 
                onClick={handleDeleteAccount}
                disabled={authLoading}
                className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-red-500/20 disabled:opacity-50"
              >
                <Trash2 size={18} /> {authLoading ? 'Processing...' : 'Delete Account'}
              </button>

              <button 
                onClick={() => setShowUserProfile(false)}
                className="w-full py-3 text-gray-500 hover:text-white transition-colors text-sm mt-4"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Admin Panel (Conditionally rendered above) */}
      {/* showAdmin state is no longer used, replaced by viewMode */}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 md:p-6">
          <div 
            className="glass w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 relative"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
            
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                    <div className="w-5 h-5 bg-black rounded-sm rotate-45" />
                  </div>
                  <h2 className="text-2xl font-display font-black tracking-tight">WEBORA</h2>
                </div>
                <button onClick={() => setShowLogin(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
              </div>

              <div className="mb-10">
                <h3 className="text-4xl font-display font-black mb-3">{isSignUp ? 'Join Webora' : 'Welcome Back'}</h3>
                <p className="text-gray-500 text-sm font-medium">Industry-level digital solutions at your fingertips.</p>
              </div>

              {authError && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-bold mb-8 flex items-center gap-3"
                >
                  <Shield size={16} /> {authError}
                </motion.div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-2">Email Address</label>
                  <div className="relative group">
                    <input 
                      type="email" 
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={authLoading}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-accent/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-700"
                    />
                    <div className="absolute inset-0 rounded-2xl border border-accent/0 group-focus-within:border-accent/30 pointer-events-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-2">Password</label>
                  <div className="relative group">
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      disabled={authLoading}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-accent/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-700"
                    />
                    <div className="absolute inset-0 rounded-2xl border border-accent/0 group-focus-within:border-accent/30 pointer-events-none transition-all" />
                  </div>
                </div>
                
                <button 
                  onClick={handleAuthAction}
                  disabled={authLoading}
                  className="w-full py-6 bg-accent text-black font-black rounded-2xl shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-xs uppercase tracking-[0.2em] overflow-hidden relative group active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {authLoading ? (
                      <>
                        <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (isSignUp ? 'Create Account' : 'Sign In')}
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>

                <div className="relative py-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-[#0a0a0a] px-6 text-gray-600">Secure Authentication</span></div>
                </div>

                <div className="text-center space-y-6">
                  <button 
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setAuthError(null);
                    }}
                    disabled={authLoading}
                    className="text-xs text-gray-500 hover:text-accent transition-all font-bold group"
                  >
                    {isSignUp ? (
                      <>Already have an account? <span className="text-accent group-hover:underline ml-1">Sign In</span></>
                    ) : (
                      <>Don't have an account? <span className="text-accent group-hover:underline ml-1">Create one</span></>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setShowLogin(false)}
                    disabled={authLoading}
                    className="block w-full text-gray-700 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors pt-4 border-t border-white/5"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
