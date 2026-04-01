import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Send, User as UserIcon, Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import { getConversationsList, getChatHistory } from "../../services/chatService";

const MessagesPage = () => {
    const { user } = useSelector((state: any) => state.auth);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // User from URL (to start a new chat if coming from another page)
    const urlUserId = searchParams.get("userId");
    const urlUserName = searchParams.get("name");

    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize Socket
    useEffect(() => {
        if (!user) return;
        
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);

        newSocket.on("connect", () => {
            newSocket.emit("register_user", user._id);
        });

        newSocket.on("update_online_users", (users: string[]) => {
            setOnlineUsers(users);
        });

        newSocket.on("receive_message", (message: any) => {
            setMessages((prev) => [...prev, message]);
            
            // If the message is from someone not in our conversations list, reload the list
            setConversations(prev => {
                const exists = prev.find(c => c._id === message.sender);
                if (!exists) {
                    loadConversations();
                }
                return prev;
            });
        });

        newSocket.on("message_sent_success", (savedMessage: any) => {
            // Optimistically we might have pushed a temp message, or we just push the DB version here
            setMessages((prev) => [...prev, savedMessage]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load initial conversations
    const loadConversations = async () => {
        try {
            const res = await getConversationsList();
            setConversations(res.data);
            
            // If we came here from a link to start chatting with a user
            if (urlUserId && urlUserName) {
                const existingUser = res.data.find((u: any) => u._id === urlUserId);
                if (existingUser) {
                    setSelectedUser(existingUser);
                } else {
                    // Temporarily add them to the list so we can chat
                    const tempUser = { _id: urlUserId, name: urlUserName, role: "user" };
                    setConversations(prev => [tempUser, ...prev]);
                    setSelectedUser(tempUser);
                }
            } else if (res.data.length > 0 && !selectedUser) {
                setSelectedUser(res.data[0]);
            }
        } catch (error) {
            console.error("Failed to load conversations", error);
        } finally {
            setLoadingChats(false);
        }
    };

    useEffect(() => {
        loadConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlUserId]);

    // Load messages when selected user changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUser) return;
            setLoadingMessages(true);
            try {
                const res = await getChatHistory(selectedUser._id);
                setMessages(res.data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();
    }, [selectedUser]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedUser || !socket) return;

        // Emit to socket (the socket logic will hit the DB and emit "message_sent_success" back to us)
        socket.emit("send_message", {
            senderId: user._id,
            receiverId: selectedUser._id,
            content: messageInput.trim()
        });

        setMessageInput("");
    };

    // Auto resize text area logic could go here if using textarea, but using input for simplicity

    if (loadingChats) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col">
            <div className="glass-card flex overflow-hidden border border-[var(--border)] relative flex-grow animate-in fade-in duration-500 rounded-2xl">
                
                {/* Mobile back button when in a chat */}
                {selectedUser && (
                    <button 
                        onClick={() => setSelectedUser(null)}
                        className="md:hidden absolute top-4 left-4 z-10 p-2 bg-[var(--bg-main)] rounded-full text-[var(--text-primary)] border border-[var(--border)]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Sidebar - Conversations List */}
                <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-[var(--border)] bg-[var(--bg-main)]/30 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-[var(--border)]">
                        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Messages</h2>
                    </div>
                    
                    <div className="overflow-y-auto flex-grow h-0 custom-scrollbar">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center text-[var(--text-secondary)]">
                                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No recent conversations.</p>
                            </div>
                        ) : (
                            conversations.map((c) => {
                                const isOnline = onlineUsers.includes(c._id);
                                return (
                                    <div 
                                        key={c._id}
                                        onClick={() => setSelectedUser(c)}
                                        className={`p-4 border-b border-[var(--border)] cursor-pointer hover:bg-[var(--accent)]/5 transition-colors flex items-center gap-3 ${selectedUser?._id === c._id ? 'bg-[var(--accent)]/10 border-l-4 border-l-[var(--accent)]' : 'border-l-4 border-l-transparent'}`}
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 text-[var(--text-secondary)] overflow-hidden">
                                                {c.profilePicture ? (
                                                    <img src={c.profilePicture} alt={c.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserIcon className="w-6 h-6" />
                                                )}
                                            </div>
                                            {isOnline && (
                                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[var(--bg-main)]"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-[var(--text-primary)] truncate">{c.name}</h4>
                                            <p className="text-xs text-[var(--text-secondary)] capitalize">{c.role.replace("-", " ")}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className={`w-full md:w-2/3 lg:w-3/4 flex flex-col bg-gradient-to-br from-[var(--bg-main)]/50 to-transparent ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-16 px-6 border-b border-[var(--border)] flex items-center bg-[var(--bg-main)]/50 backdrop-blur-md shrink-0 md:pl-6 pl-16">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-extrabold text-[var(--text-primary)]">{selectedUser.name}</h3>
                                    {onlineUsers.includes(selectedUser._id) ? (
                                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wide">Online</span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded-full bg-[var(--text-secondary)]/10 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wide">Offline</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Messages Container */}
                            <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar h-0">
                                {loadingMessages ? (
                                    <div className="flex justify-center items-center h-full">
                                        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col justify-center items-center h-full text-[var(--text-secondary)] space-y-3 opacity-60">
                                        <MessageSquare className="w-16 h-16" />
                                        <p>Send a message to start the conversation</p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.sender === user._id;
                                        return (
                                            <div 
                                                key={msg._id || idx} 
                                                className={`flex w-full animate-in fade-in slide-in-from-bottom-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div 
                                                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl md:text-base text-sm ${isMe 
                                                        ? 'bg-[var(--accent)] text-white rounded-br-none shadow-lg shadow-[var(--accent)]/20' 
                                                        : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-none shadow-sm'
                                                    }`}
                                                >
                                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                                    <span className={`text-[10px] mt-1 block font-medium ${isMe ? 'text-white/70' : 'text-[var(--text-secondary)]'}`}>
                                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-[var(--bg-main)]/80 backdrop-blur-md border-t border-[var(--border)] shrink-0">
                                <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                                    <input 
                                        type="text" 
                                        className="input-field flex-grow py-3 px-4 shadow-sm"
                                        placeholder="Type your message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        autoFocus
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!messageInput.trim()}
                                        className="btn-primary w-12 flex items-center justify-center p-0 flex-shrink-0 shadow-lg shadow-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Send message"
                                    >
                                        <Send className="w-5 h-5 -ml-1 mt-0.5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]/50 p-6 text-center">
                            <MessageSquare className="w-20 h-20 mb-4" />
                            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Your Messages</h3>
                            <p>Select a conversation from the left to start chatting.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MessagesPage;
