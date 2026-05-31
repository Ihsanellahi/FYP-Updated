'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Calendar, Hotel, FileText, AlertCircle, Star, Loader2, Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import type { ChatMessage } from '@/types';
import { LOGO_NO_BG_SRC } from '@/constants/logos';

export default function Chat() {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            sender: 'ai',
            message: "Hello! Welcome to Grand Hotel. I'm your AI assistant. How can I help you today?",
            timestamp: new Date().toISOString(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Voice Call Simulation State
    const [isCalling, setIsCalling] = useState(false);
    const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [callTranscript, setCallTranscript] = useState<string>('');
    const [isAITalking, setIsAITalking] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isCalling && callStatus === 'connected') {
            timer = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            setCallDuration(0);
        }
        return () => clearInterval(timer);
    }, [isCalling, callStatus]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startCall = () => {
        setIsCalling(true);
        setCallStatus('ringing');
        setCallTranscript('Ringing...');
        setIsAITalking(false);
        setIsMuted(false);
        setIsSpeakerOn(false);
        
        // Ring for 2 seconds, then connect
        setTimeout(() => {
            setCallStatus('connected');
            setIsAITalking(true);
            setCallTranscript('Hello! Thank you for calling Grand Hotel Assistant. How can I help you today?');
            
            // Turn off talking animation after a short delay
            setTimeout(() => {
                setIsAITalking(false);
            }, 3000);
        }, 2000);
    };

    const endCall = () => {
        setCallStatus('ended');
        setCallTranscript('Call Ended.');
        setIsAITalking(false);
        setTimeout(() => {
            setIsCalling(false);
        }, 800);
    };

    const handleVoiceResponse = (option: string) => {
        if (callStatus !== 'connected') return;

        // User speaks
        setCallTranscript(`You: "${option}"`);
        setIsAITalking(false);

        // Simulated AI response delay
        setTimeout(() => {
            setIsAITalking(true);
            switch (option) {
                case 'Book a Room':
                    setCallTranscript('AI: "Sure! I\'ve sent a shortcut in our text chat window. Alternatively, I can tell you that our deluxe suites start at $199/night. Would you like to book one?"');
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            sender: 'user',
                            message: 'Asked about room booking via voice call',
                            timestamp: new Date().toISOString(),
                        },
                        {
                            id: (Date.now() + 1).toString(),
                            sender: 'ai',
                            message: 'Here is the link to complete your room booking: click on the "Book Room" quick action button or navigate to booking page.',
                            timestamp: new Date().toISOString(),
                        }
                    ]);
                    break;
                case 'Room Service':
                    setCallTranscript('AI: "Our room service is active. What would you like to order today? We have hot meals, fresh juices, and desserts ready to deliver."');
                    break;
                case 'Housekeeping':
                    setCallTranscript('AI: "Understood. I will dispatch housekeeping to your room immediately to assist you with fresh towels or cleaning."');
                    break;
                case 'Talk to Agent':
                    setCallTranscript('AI: "Connecting you to the Front Desk agent now. Please hold..."');
                    setTimeout(() => {
                        setCallTranscript('AI: "Connected. Hello, this is Front Desk. How may we help you?"');
                    }, 2000);
                    break;
                default:
                    setCallTranscript('AI: "I am ready to help you. Let me know what you need."');
            }

            // Stop speaking wave animation after 4 seconds
            setTimeout(() => {
                setIsAITalking(false);
            }, 4000);
        }, 1200);
    };

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getAIResponse = (userMessage: string): string => {
        const msg = userMessage.toLowerCase();

        if (msg.includes('book') || msg.includes('room') || msg.includes('reservation')) {
            return 'I can help you book a room! Click the "Check Availability" button below or visit our rooms page to see available options.';
        } else if (msg.includes('price') || msg.includes('cost') || msg.includes('rate')) {
            return 'Our room rates range from $99 for a Single room to $799 for our Presidential Suite. Click "Check Availability" to see all options and current pricing.';
        } else if (msg.includes('complain') || msg.includes('issue') || msg.includes('problem')) {
            return "I'm sorry to hear you're experiencing an issue. You can submit a formal complaint using the \"File Complaint\" button below, and our staff will address it promptly.";
        } else if (msg.includes('emergency') || msg.includes('urgent') || msg.includes('help')) {
            return 'If this is an emergency, please click the "Emergency" button below immediately. Our staff will respond right away.';
        } else if (msg.includes('feedback') || msg.includes('review') || msg.includes('rating')) {
            return "We'd love to hear your feedback! Click the \"Give Feedback\" button below to rate your experience.";
        } else if (msg.includes('cancel') || msg.includes('modify')) {
            return 'To modify or cancel a booking, please contact our front desk or use the "File Complaint" option to request changes.';
        } else if (msg.includes('amenities') || msg.includes('facilities')) {
            return 'Our hotel offers WiFi, AC, TV, Mini Bar, and some rooms include Balcony, Jacuzzi, Living Room, and more. Check the room details for specific amenities.';
        } else if (msg.includes('check in') || msg.includes('check out') || msg.includes('checkout') || msg.includes('checkin')) {
            return 'Standard check-in time is 3:00 PM and check-out is 11:00 AM. Special arrangements can be made upon request.';
        } else {
            return "I'm here to help! You can ask me about room bookings, prices, hotel amenities, or use the quick action buttons below for common services.";
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            message: input,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI typing delay
        setTimeout(() => {
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                message: getAIResponse(input),
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1000);
    };

    const handleQuickAction = (action: string) => {
        switch (action) {
            case 'availability':
                router.push('/availability');
                break;
            case 'book':
                router.push('/booking');
                break;
            case 'complaint':
                router.push('/complaint');
                break;
            case 'emergency':
                router.push('/emergency');
                break;
            case 'feedback':
                router.push('/feedback');
                break;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className="relative flex flex-col h-[calc(100vh-12rem)] overflow-hidden">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b bg-primary text-primary-foreground rounded-t-lg flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold">AI Assistant Chat</h2>
                        <p className="text-sm opacity-90">Always here to help you</p>
                    </div>
                    <Button
                        onClick={startCall}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 h-10 w-10 flex items-center justify-center transition-all duration-200 border border-white/20 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                        aria-label="Call Assistant"
                    >
                        <Phone className="h-5 w-5" />
                    </Button>
                </div>

                {/* Messages Area */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${msg.sender === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <p>{msg.message}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                                <span className="text-gray-600">AI is typing...</span>
                            </div>
                        </div>
                    )}
                    <div />
                </div>

                {/* Quick Actions */}
                <div className="px-6 py-3 border-t bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-2">Quick Actions:</p>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickAction('availability')}
                        >
                            <Calendar className="h-4 w-4 mr-1" />
                            Check Availability
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickAction('book')}
                        >
                            <Hotel className="h-4 w-4 mr-1" />
                            Book Room
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickAction('complaint')}
                        >
                            <FileText className="h-4 w-4 mr-1" />
                            File Complaint
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickAction('emergency')}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Emergency
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickAction('feedback')}
                        >
                            <Star className="h-4 w-4 mr-1" />
                            Give Feedback
                        </Button>
                    </div>
                </div>

                {/* Input Area */}
                <div className="px-6 py-4 border-t">
                    <div className="flex space-x-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1"
                        />
                        <Button onClick={handleSend} disabled={!input.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Voice Call Overlay */}
                {isCalling && (
                    <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md text-white flex flex-col p-6 rounded-lg animate-in fade-in duration-300">
                        {/* Upper Section: Status & Timer */}
                        <div className="flex flex-col items-center space-y-2 mt-2 flex-shrink-0">
                            <div className="relative">
                                {/* Pulse circles */}
                                {callStatus === 'ringing' && (
                                    <div className="absolute -inset-4 rounded-full bg-blue-500/20 animate-pulse pointer-events-none" />
                                )}
                                {callStatus === 'connected' && isAITalking && (
                                    <div className="absolute -inset-4 rounded-full bg-green-500/20 animate-ping pointer-events-none" />
                                )}
                                <div className="h-28 w-28 rounded-full bg-white flex items-center justify-center border-4 border-white/15 shadow-2xl relative z-10 overflow-hidden p-1">
                                    <img src={LOGO_NO_BG_SRC} alt="Grand Hotel Logo" className="h-full w-full object-contain scale-110" />
                                </div>
                            </div>
                            
                            <div className="text-center space-y-0.5">
                                <h3 className="text-xl font-bold tracking-tight">Grand Hotel Assistant</h3>
                                <p className="text-xs font-medium text-slate-400">
                                    {callStatus === 'ringing' && 'Ringing...'}
                                    {callStatus === 'connected' && `Connected • ${formatDuration(callDuration)}`}
                                    {callStatus === 'ended' && 'Call Ended'}
                                </p>
                            </div>
                        </div>

                        {/* Middle Section: Subtitles & Sound Waves / Interactive Dialog (Scrollable if needed) */}
                        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full py-4 min-h-0 overflow-y-auto scrollbar-hide">
                            {/* Sound waves visualization */}
                            {callStatus === 'connected' && (
                                <div className="flex items-center space-x-1.5 h-6 mb-4 flex-shrink-0">
                                    {[1, 2, 3, 4, 5, 6, 7].map((bar) => {
                                        const delay = bar * 0.15;
                                        const duration = 0.5 + Math.random() * 0.5;
                                        return (
                                            <span
                                                key={bar}
                                                style={{
                                                    animationDelay: `${delay}s`,
                                                    animationDuration: `${duration}s`
                                                }}
                                                className={`w-1 rounded-full bg-blue-400 ${
                                                    isAITalking ? 'animate-bounce h-6' : 'h-2'
                                                } transition-all duration-300`}
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {/* Transcript/Subtitles Box */}
                            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center shadow-inner min-h-[80px] flex items-center justify-center flex-shrink-0">
                                <p className="text-sm text-slate-200 italic leading-relaxed">
                                    {callTranscript}
                                </p>
                            </div>

                            {/* Voice interactive options */}
                            {callStatus === 'connected' && (
                                <div className="mt-4 w-full space-y-2 flex-shrink-0">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-1">Speak Option:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Book a Room', 'Room Service', 'Housekeeping', 'Talk to Agent'].map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => handleVoiceResponse(opt)}
                                                className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] text-center truncate cursor-pointer"
                                            >
                                                💬 {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Section: Call Control Buttons (Anchored at the bottom) */}
                        <div className="flex justify-center items-center space-x-6 py-2 mt-auto flex-shrink-0">
                            {/* Mute button */}
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                disabled={callStatus === 'ended'}
                                className={`h-11 w-11 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                                    isMuted 
                                        ? 'bg-red-500/20 border-red-500/30 text-red-500 hover:bg-red-500/30' 
                                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                }`}
                                title={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                            </button>

                            {/* End call button */}
                            <button
                                onClick={endCall}
                                className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 flex items-center justify-center text-white shadow-lg hover:shadow-red-900/50 hover:scale-105 transition-all duration-200 cursor-pointer animate-pulse"
                                title="End Call"
                            >
                                <PhoneOff className="h-6 w-6" />
                            </button>

                            {/* Speaker button */}
                            <button
                                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                                disabled={callStatus === 'ended'}
                                className={`h-11 w-11 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                                    isSpeakerOn 
                                        ? 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30' 
                                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                }`}
                                title="Speaker"
                            >
                                {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
