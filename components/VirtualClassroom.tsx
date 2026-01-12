
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  MessageSquare, Users, Share, Settings, Send,
  ChevronRight, BrainCircuit, Monitor, Hand
} from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Message } from '../types';

interface VirtualClassroomProps {
  tutorName: string;
  onClose: () => void;
}

const VirtualClassroom: React.FC<VirtualClassroomProps> = ({ tutorName, onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiConnected, setIsAiConnected] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Audio handling refs for Gemini Live
  const nextStartTimeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Gemini Live Session Ref
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle local video stream
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        return () => {
          stream.getTracks().forEach(track => track.stop());
        };
      } catch (err) {
        console.error("Camera access error:", err);
      }
    }
    setupCamera();
  }, []);

  // Gemini Live Setup
  const setupGeminiLive = useCallback(async () => {
    if (!process.env.API_KEY) return;
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Setup Audio Contexts
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outCtx;
      const outNode = outCtx.createGain();
      outNode.connect(outCtx.destination);
      outputNodeRef.current = outNode;

      const session = await ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsAiConnected(true);
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              sender: 'ai',
              text: `Hello! I'm your AI teaching assistant today. How can I help you with your session with ${tutorName}?`,
              timestamp: new Date()
            }]);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outCtx) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outCtx,
                24000,
                1
              );
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outNode);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle Transcriptions
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              // In a real app we'd buffer this, but for demo we append
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last && last.sender === 'ai') {
                  const updated = [...prev];
                  updated[updated.length - 1] = { ...last, text: last.text + text };
                  return updated;
                }
                return [...prev, {
                  id: Date.now().toString(),
                  sender: 'ai',
                  text,
                  timestamp: new Date()
                }];
              });
            }
          },
          onerror: (e) => console.error("Gemini Error:", e),
          onclose: () => setIsAiConnected(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: `You are a helpful AI teaching assistant in a live virtual classroom with ${tutorName}. Help the student with notes, explanations, or research while they wait for their tutor or during the session.`
        }
      });

      sessionRef.current = session;
    } catch (error) {
      console.error("Failed to connect to Gemini Live:", error);
    }
  }, [tutorName]);

  useEffect(() => {
    setupGeminiLive();
    return () => {
      if (sessionRef.current) {
        sessionRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Send to Gemini
    if (sessionRef.current) {
      sessionRef.current.sendRealtimeInput({
        text: inputText
      });
    }

    setInputText('');
  };

  // Audio utility functions
  function decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Monitor className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">Virtual Classroom: {tutorName}</h1>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-slate-400 text-xs">Live • 00:42:15</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {[1, 2].map(i => (
              <img 
                key={i} 
                src={`https://picsum.photos/id/${i+100}/32/32`} 
                className="w-8 h-8 rounded-full border-2 border-slate-800" 
                alt="participant"
              />
            ))}
          </div>
          <button className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors">
            <Users className="h-5 w-5" />
          </button>
          <button className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-6 relative flex flex-col gap-4 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
            {/* Tutor Video (Simulated) */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-800 aspect-video flex items-center justify-center shadow-2xl border border-slate-700">
              <img 
                src="https://picsum.photos/id/64/1280/720" 
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Tutor"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-white text-sm flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                {tutorName} (Tutor)
              </div>
            </div>

            {/* User Video */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-800 aspect-video flex items-center justify-center shadow-2xl border border-slate-700">
              {isVideoOff ? (
                <div className="text-center">
                  <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-white">YU</span>
                  </div>
                  <p className="text-slate-400">Camera Off</p>
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" 
                />
              )}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-white text-sm">
                You (Student)
              </div>
              <div className="absolute top-4 right-4 bg-slate-900/40 p-1.5 rounded-full">
                {isMuted ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4 text-green-500" />}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Chat & AI Assistant */}
        {showChat && (
          <div className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BrainCircuit className={`h-5 w-5 ${isAiConnected ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="text-white font-medium">Session Assistant</span>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="text-slate-400 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                    {msg.sender === 'user' ? 'You' : 'Assistant'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-slate-800/50">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask AI or chat with tutor..." 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="text-[10px] text-slate-500 mt-3 text-center italic">
                AI can help with notes, summaries, and quick facts.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="h-24 bg-slate-900 border-t border-slate-800 flex items-center justify-center px-8 relative">
        <div className="absolute left-8 hidden lg:flex items-center space-x-6 text-slate-400">
          <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors">
            <Monitor className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium">Record</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors">
            <Hand className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium">Raise</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isVideoOff ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
          </button>
          
          <div className="w-[1px] h-8 bg-slate-700 mx-2"></div>
          
          <button className="w-12 h-12 rounded-full bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center transition-all shadow-lg">
            <Share className="h-6 w-6" />
          </button>
          
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
              showChat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="h-6 w-6" />
          </button>
          
          <button 
            onClick={onClose}
            className="px-6 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 transition-all shadow-lg hover:shadow-red-900/20 ml-4 font-semibold"
          >
            <PhoneOff className="h-5 w-5" />
            <span>End Session</span>
          </button>
        </div>

        <div className="absolute right-8 hidden lg:flex items-center space-x-2">
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">1080p HD</span>
          <span className="text-xs text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20">Secure</span>
        </div>
      </div>
    </div>
  );
};

export default VirtualClassroom;
