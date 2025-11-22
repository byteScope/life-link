import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Paperclip,
  Smile,
} from 'lucide-react';

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      lastMessage: 'Your appointment is confirmed for tomorrow',
      time: '10:30 AM',
      unread: 2,
      online: true,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
    },
    {
      id: 2,
      name: 'CareNurse Services',
      lastMessage: 'We will arrive at 2 PM today',
      time: '9:15 AM',
      unread: 0,
      online: true,
      avatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    },
    {
      id: 3,
      name: 'MediLab Diagnostics',
      lastMessage: 'Your lab results are ready',
      time: 'Yesterday',
      unread: 1,
      online: false,
      avatar: 'https://images.unsplash.com/photo-1579154204601-01588f351e67',
    },
    {
      id: 4,
      name: 'Emergency Response Team',
      lastMessage: 'Thank you for using our service',
      time: '2 days ago',
      unread: 0,
      online: false,
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54',
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'them',
      text: 'Hello! How can I help you today?',
      time: '10:00 AM',
    },
    {
      id: 2,
      sender: 'me',
      text: 'Hi, I would like to schedule an appointment',
      time: '10:05 AM',
    },
    {
      id: 3,
      sender: 'them',
      text: 'Of course! What date and time works best for you?',
      time: '10:06 AM',
    },
    {
      id: 4,
      sender: 'me',
      text: 'Tomorrow at 3 PM if possible',
      time: '10:08 AM',
    },
    {
      id: 5,
      sender: 'them',
      text: 'Perfect! I have you scheduled for tomorrow at 3 PM. You will receive a confirmation shortly.',
      time: '10:10 AM',
    },
    {
      id: 6,
      sender: 'them',
      text: 'Your appointment is confirmed for tomorrow',
      time: '10:30 AM',
    },
  ];

  const selectedConversation = conversations.find((c) => c.id === selectedChat);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Add message logic here
      setMessageInput('');
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="grid md:grid-cols-3 h-full">
            {/* Conversations List */}
            <div className="border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-gray-900 mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv.id)}
                    className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedChat === conv.id ? 'bg-purple-50 border-l-4 border-[#9B4DFF]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                          <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                        </div>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#1BC47D] rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-gray-900 truncate">{conv.name}</p>
                          <span className="text-xs text-gray-500 flex-shrink-0">{conv.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                          {conv.unread > 0 && (
                            <Badge
                              className="ml-2 w-5 h-5 flex items-center justify-center p-0 rounded-full flex-shrink-0"
                              style={{ backgroundColor: '#9B4DFF' }}
                            >
                              {conv.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          <img
                            src={selectedConversation.avatar}
                            alt={selectedConversation.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {selectedConversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#1BC47D] rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-gray-900">{selectedConversation.name}</p>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="rounded-xl">
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl">
                        <Video className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            message.sender === 'me'
                              ? 'bg-[#9B4DFF] text-white rounded-br-sm'
                              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === 'me' ? 'text-purple-200' : 'text-gray-500'
                            }`}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="rounded-xl flex-shrink-0">
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <Input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="rounded-xl"
                      />
                      <Button variant="ghost" size="icon" className="rounded-xl flex-shrink-0">
                        <Smile className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        size="icon"
                        className="rounded-xl flex-shrink-0"
                        style={{ backgroundColor: '#9B4DFF' }}
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
