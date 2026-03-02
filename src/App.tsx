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
  Monitor,
  Smartphone,
  Globe,
  LogIn
} from 'lucide-react';
import { AppData, Project, Service, Setting } from './types';
import { supabase } from './services/supabaseClient';

// --- Components ---

const Navbar = ({ onAdminClick, isAdmin, user, onLogout, onStartChat }: { onAdminClick: () => void, isAdmin: boolean, user: any, onLogout: () => void, onStartChat: () => void }) => (
  <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-6 py-4 flex justify-between items-center">
    <div className="text-2xl font-display font-bold text-accent">WEBORA</div>
    <div className="hidden md:flex gap-8 text-sm font-medium">
      <a href="#home" className="hover:text-accent transition-colors">Home</a>
      <a href="#services" className="hover:text-accent transition-colors">Plans</a>
      <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
      <a href="#about" className="hover:text-accent transition-colors">About</a>
    </div>
    <div className="flex gap-4 items-center">
      {user ? (
        <div className="flex items-center gap-2">
          <button 
            onClick={onAdminClick}
            className={`p-2 rounded-full transition-colors ${isAdmin ? 'text-accent hover:bg-accent/10' : 'text-gray-400 hover:bg-white/10'}`}
            title={isAdmin ? "Account Menu" : "User Profile"}
          >
            <User size={20} />
          </button>
        </div>
      ) : (
        <button 
          onClick={onAdminClick}
          className="p-2 text-gray-400 hover:text-accent transition-colors"
          title="Login"
        >
          <LogIn size={20} />
        </button>
      )}
      <button 
        onClick={onStartChat}
        className="bg-accent text-black px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform"
      >
        Get Started
      </button>
    </div>
  </nav>
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
    <section id="home" className="pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight max-w-5xl mx-auto text-accent">
          {renderTitle(title)}
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onStartChat}
            className="bg-accent text-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] transition-all"
          >
            Get Started
          </button>
          <button 
            onClick={onStartChat}
            className="glass px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all"
          >
            Contact Us
          </button>
        </div>
      </motion.div>
    </section>
  );
};

const ServiceCard = ({ service, onChoosePlan }: { service: Service, onChoosePlan: () => void, key?: React.Key }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass p-8 rounded-3xl flex flex-col h-full border-white/10 hover:border-accent/50 transition-all"
  >
    <div className="text-accent mb-4">
      {service.tier === 'elite' && <Globe size={32} />}
      {service.tier === 'pro' && <Code size={32} />}
      {service.tier === 'premium' && <Zap size={32} />}
    </div>
    <h3 className="text-2xl mb-2">{service.name}</h3>
    <div className="text-4xl font-bold mb-6">₹{service.price}</div>
    <ul className="space-y-3 mb-8 flex-grow">
      {service.features.split(',').map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
          <ChevronRight size={14} className="text-accent" />
          {f.trim()}
        </li>
      ))}
    </ul>
    <button 
      onClick={onChoosePlan}
      className="w-full py-3 rounded-xl bg-white/5 hover:bg-accent hover:text-black font-bold transition-all"
    >
      Choose Plan
    </button>
  </motion.div>
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      // Convert history to Gemini format
      const contents = newMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: `You are Webora AI, an advanced assistant built by Sanskar for Webora. 
          
          Context about Webora: ${context}
          
          Key Information:
          - Creator: You were created by Sanskar specifically for Webora. If anyone asks "Who made you?" or "Who is your creator?", you MUST answer: "I was created by Sanskar for Webora."
          - Webora's Mission: To provide industry-standard digital solutions.
          - Plans & Pricing:
            1. Elite (₹499): 1 Week Delivery, AI Integration, Database, Vercel Hosting.
            2. Pro (₹599): 6 Days Delivery, Source Code, Elite Features, Custom Domain.
            3. Premium (₹999): 5 Days Delivery, All Pro Features, 1 Year Maintenance, 10% Off.
          
          Guidelines:
          - If asked about plans or pricing, explain the details of Elite, Pro, and Premium plans clearly and encourage them to choose one.
          - Be helpful, professional, and concise.
          - Remember the previous conversation turns to provide contextually relevant answers.
          - Suggest using 'Get Started' or 'Contact Us' buttons for direct owner contact.`
        }
      });
      const aiText = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
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

const OwnerChatPage = ({ user, onClose }: { user: any, onClose: () => void }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'admin', text: string, created_at?: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-4xl h-full md:h-[85vh] rounded-none md:rounded-3xl flex flex-col overflow-hidden shadow-2xl border-white/10"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center border border-accent/50">
              <User size={24} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Message with Owner</h2>
              <div className="text-xs text-gray-400">
                {user ? (
                  <>Identified as: <span className="text-accent">{user.email}</span></>
                ) : (
                  <span className="text-gray-500 italic">Login to see your messages</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
        </div>
        
        <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 scrollbar-hide bg-black/20">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm md:text-base shadow-lg transition-all hover:scale-[1.01] ${
                m.role === 'user' ? 'bg-accent text-black font-medium' : 'bg-white/10 text-white border border-white/5'
              }`}>
                {m.text}
                {m.created_at && (
                  <div className={`text-[10px] mt-1 opacity-50 ${m.role === 'user' ? 'text-black' : 'text-gray-400'}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="bg-accent/20 p-3 rounded-2xl flex gap-1">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          {!user && (
            <div className="text-center py-10 opacity-50">
              <p className="text-sm">You are viewing the chat as a guest.</p>
              <p className="text-xs">Sign in to view your previous conversations and send new messages.</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-white/10 bg-white/5">
          {user ? (
            <div className="flex gap-4">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message to the owner..."
                className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
              <button onClick={handleSend} className="px-6 bg-accent text-black rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2">
                <Send size={20} /> <span className="hidden md:inline">Send</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { document.dispatchEvent(new CustomEvent('open-login')); }}
              className="w-full py-4 bg-accent text-black font-bold rounded-2xl hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
            >
              <LogIn size={20} /> Sign In to Message Owner
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
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', category: '', link: '' });
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
    await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject)
    });
    setNewProject({ title: '', description: '', image: '', category: '', link: '' });
    setShowAddProject(false);
    onUpdate();
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
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-0 md:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-5xl h-full md:h-[80vh] rounded-none md:rounded-3xl flex flex-col overflow-hidden"
      >
        <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <h2 className="text-xl md:text-2xl font-display">Admin Dashboard</h2>
            <div className="flex bg-white/5 p-1 rounded-full w-fit">
              <button 
                onClick={() => setViewMode('web')}
                className={`px-3 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-bold transition-all ${viewMode === 'web' ? 'bg-accent text-black' : 'text-gray-400'}`}
              >
                Web
              </button>
              <button 
                onClick={() => setViewMode('control')}
                className={`px-3 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-bold transition-all ${viewMode === 'control' ? 'bg-accent text-black' : 'text-gray-400'}`}
              >
                Control
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
        </div>
        
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-2 md:p-4 gap-2 scrollbar-hide">
            <button 
              onClick={() => setActiveTab('projects')}
              className={`whitespace-nowrap md:w-full text-left px-4 py-2 md:py-3 rounded-xl transition-all text-sm md:text-base ${activeTab === 'projects' ? 'bg-accent text-black' : 'hover:bg-white/5'}`}
            >
              Projects
            </button>
            <button 
              onClick={() => setActiveTab('services')}
              className={`whitespace-nowrap md:w-full text-left px-4 py-2 md:py-3 rounded-xl transition-all text-sm md:text-base ${activeTab === 'services' ? 'bg-accent text-black' : 'hover:bg-white/5'}`}
            >
              Services
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`whitespace-nowrap md:w-full text-left px-4 py-2 md:py-3 rounded-xl transition-all text-sm md:text-base ${activeTab === 'messages' ? 'bg-accent text-black' : 'hover:bg-white/5'}`}
            >
              Messages
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`whitespace-nowrap md:w-full text-left px-4 py-2 md:py-3 rounded-xl transition-all text-sm md:text-base ${activeTab === 'settings' ? 'bg-accent text-black' : 'hover:bg-white/5'}`}
            >
              Settings
            </button>
            {user.is_super && (
              <button 
                onClick={() => setActiveTab('admins')}
                className={`whitespace-nowrap md:w-full text-left px-4 py-2 md:py-3 rounded-xl transition-all text-sm md:text-base ${activeTab === 'admins' ? 'bg-accent text-black' : 'hover:bg-white/5'}`}
              >
                Admins
              </button>
            )}
          </div>
          
          <div className="flex-grow p-4 md:p-8 overflow-y-auto">
            {activeTab === 'messages' && (
              <div className="flex flex-col md:flex-row h-full gap-6">
                <div className={`w-full md:w-1/3 md:border-r border-white/10 md:pr-6 space-y-4 ${selectedChat ? 'hidden md:block' : 'block'}`}>
                  <h3 className="text-lg md:text-xl mb-4">User Chats</h3>
                  <div className="space-y-3">
                    {chats.map(chat => (
                      <button 
                        key={chat.id}
                        onClick={() => {
                          setSelectedChat(chat);
                          fetchChatMessages(chat.email);
                        }}
                        className={`w-full text-left p-4 rounded-2xl transition-all ${selectedChat?.email === chat.email ? 'bg-accent/20 border border-accent/50' : 'glass hover:bg-white/5'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-sm font-bold truncate max-w-[150px]">{chat.email}</div>
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
                    ))}
                  </div>
                </div>
                <div className={`flex-grow flex flex-col h-full ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                  {selectedChat ? (
                    <>
                      <div className="flex items-center gap-2 mb-4 md:hidden">
                        <button onClick={() => setSelectedChat(null)} className="p-2 glass rounded-lg"><ChevronRight className="rotate-180" size={18} /></button>
                        <div className="text-sm font-bold truncate">{selectedChat.email}</div>
                      </div>
                      <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-hide">
                        {chatMessages.map((m, i) => (
                          <div key={m.id || i} className={`flex flex-col ${m.sender_id === user.id ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[80%] p-3 rounded-2xl text-sm ${m.sender_id === user.id ? 'bg-accent text-black' : 'bg-white/10 text-white'}`}>
                              {m.message_text}
                            </div>
                            <div className="text-[9px] text-gray-500 mt-1 px-1">
                              {m.sender_id === user.id ? 'Owner' : 'User'}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input 
                          value={adminReply}
                          onChange={e => setAdminReply(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && sendReply()}
                          placeholder="Type your reply..."
                          className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                        />
                        <button onClick={sendReply} className="p-2 bg-accent text-black rounded-xl"><Send size={18} /></button>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">Select a chat to start messaging</div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl">Manage Projects</h3>
                  <button 
                    onClick={() => setShowAddProject(!showAddProject)}
                    className="flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    <Plus size={16} /> {showAddProject ? 'Cancel' : 'Add Project'}
                  </button>
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
                  {data.projects.map(p => (
                    <div key={p.id} className="glass p-4 rounded-2xl flex justify-between items-center">
                      <div>
                        <div className="font-bold">{p.title}</div>
                        <div className="text-xs text-gray-400">{p.category}</div>
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
                  <h3 className="text-xl">Admin Management</h3>
                  <button 
                    onClick={() => setShowAddAdmin(!showAddAdmin)}
                    className="flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    <Plus size={16} /> {showAddAdmin ? 'Cancel' : 'Add Admin'}
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
          </div>
        </div>
      </motion.div>
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
  const [showOwnerChat, setShowOwnerChat] = useState(false);
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
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      setData(json);
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

  if (!data) return <div className="h-screen flex items-center justify-center text-accent animate-pulse">Loading Webora...</div>;

  const context = `Services: ${data.services.map(s => `${s.name} (₹${s.price})`).join(', ')}. Projects: ${data.projects.map(p => p.title).join(', ')}.`;

  return (
    <div className="relative overflow-x-hidden">
      <Navbar 
        onAdminClick={handleAdminAccess} 
        isAdmin={userRole === 'admin'} 
        user={user}
        onLogout={handleLogout}
        onStartChat={() => setShowOwnerChat(true)}
      />

      {/* Profile Dropdown Menu */}
      <AnimatePresence>
        {showProfileMenu && user && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-6 z-[60] glass w-64 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/5">
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Signed in as</div>
              <div className="text-sm font-bold truncate">{user.email}</div>
              <div className="text-[10px] text-accent font-bold uppercase mt-1">{userRole}</div>
            </div>
            
            <div className="p-2 space-y-1">
              {userRole === 'admin' && (
                <>
                  <button 
                    onClick={() => { setViewMode('control'); setShowProfileMenu(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors text-left ${viewMode === 'control' ? 'bg-accent text-black' : 'hover:bg-white/5'}`}
                  >
                    <Settings size={18} className={viewMode === 'control' ? 'text-black' : 'text-accent'} /> Control Panel
                  </button>
                  <button 
                    onClick={() => { setViewMode('web'); setShowProfileMenu(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors text-left ${viewMode === 'web' ? 'bg-accent text-black' : 'hover:bg-white/5'}`}
                  >
                    <Globe size={18} className={viewMode === 'web' ? 'text-black' : 'text-accent'} /> Web View
                  </button>
                </>
              )}
              
              <button 
                onClick={() => { setShowUserProfile(true); setShowProfileMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded-xl transition-colors text-left"
              >
                <User size={18} /> My Profile
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-500/10 text-red-500 rounded-xl transition-colors text-left"
              >
                <LogOut size={18} /> Logout
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
          <Hero onStartChat={() => setShowOwnerChat(true)} settings={data.settings} />

          {/* Services Section */}
          <section id="services" className="py-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl mb-4">Our Services</h2>
              <p className="text-gray-400">Choose the perfect plan for your digital presence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.services.map((s: Service) => (
                <ServiceCard key={s.id} service={s} onChoosePlan={() => setShowOwnerChat(true)} />
              ))}
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
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {['All', ...new Set(data.projects.map(p => p.category))].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${filter === cat ? 'bg-accent text-black font-bold' : 'glass hover:bg-white/10'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.projects.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-white/10 rounded-3xl">
                    No projects added yet. Admin can add them via dashboard.
                  </div>
                ) : (
                  data.projects
                    .filter(p => filter === 'All' || p.category === filter)
                    .map((p: Project) => (
                    <motion.div 
                      key={p.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        if (p.link) {
                          window.open(p.link, '_blank');
                        } else {
                          setSelectedProject(p);
                        }
                      }}
                      className="group relative aspect-video rounded-3xl overflow-hidden glass cursor-pointer border border-white/5 hover:border-accent/50 transition-all"
                    >
                      <img 
                        src={p.image ? (p.image.startsWith('http') ? p.image : p.image) : "https://picsum.photos/seed/webora-project/1200/800?blur=2"} 
                        alt={p.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                        referrerPolicy="no-referrer" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://picsum.photos/seed/webora-fallback/1200/800?blur=2";
                        }}
                      />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-xs text-accent font-bold uppercase mb-1">{p.category}</div>
                            <h3 className="text-xl font-bold">{p.title}</h3>
                          </div>
                          {p.link && (
                            <div className="p-2 bg-accent text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink size={16} />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
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
        {showOwnerChat && <OwnerChatPage user={user} onClose={() => setShowOwnerChat(false)} />}
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
              <div className="text-accent font-bold uppercase text-sm mb-2">{selectedProject.category}</div>
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
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-6 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="glass p-8 md:p-10 rounded-[2rem] w-full max-w-md border border-white/10 shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-accent/20">
                <LogIn className="text-accent" size={32} />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">
                {isSignUp ? 'Join Webora' : 'Welcome Back'}
              </h2>
              <p className="text-gray-400 text-sm">
                {isSignUp ? 'Create an account to start your project' : 'Login to manage your services and chats'}
              </p>
            </div>

            <div className="space-y-5">
              {authError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium text-center"
                >
                  {authError}
                </motion.div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={authLoading}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent focus:bg-white/10 transition-all text-white"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                  {!isSignUp && (
                    <button className="text-[10px] text-accent hover:underline font-bold uppercase">Forgot?</button>
                  )}
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  disabled={authLoading}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent focus:bg-white/10 transition-all text-white"
                />
              </div>
              
              <button 
                onClick={handleAuthAction}
                disabled={authLoading}
                className="w-full py-4 bg-accent text-black font-black rounded-2xl hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-lg"
              >
                {authLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0a0a0a] px-2 text-gray-500">Or</span></div>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setAuthError(null);
                  }}
                  disabled={authLoading}
                  className="text-sm text-gray-400 hover:text-accent transition-colors font-medium"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
                </button>
              </div>
              
              <button 
                onClick={() => setShowLogin(false)}
                disabled={authLoading}
                className="w-full text-gray-600 text-xs hover:text-white transition-colors mt-4"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
