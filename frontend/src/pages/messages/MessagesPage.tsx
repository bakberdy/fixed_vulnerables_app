import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient } from '@/shared/api/client';
import { useAuth } from '@/app/providers/AuthProvider';
import type { Message } from '@/entities/message';

interface Conversation {
  userId: number;
  userName?: string;
  lastMessage: string;
  lastMessageDate: string;
  unread: boolean;
}

export function MessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedUserId = searchParams.get('user');
  
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    setConversations(buildConversationsFromMessages(allMessages));
  }, [allMessages, user?.id]);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    const userIdNumber = Number(selectedUserId);
    const thread = getThreadForUser(userIdNumber);
    setMessages(thread);
    void markThreadAsRead(thread);
  }, [selectedUserId, allMessages]);

  async function loadConversations() {
    try {
      const [inboxRes, sentRes] = await Promise.all([
        apiClient.get<Message[]>('/messages/inbox'),
        apiClient.get<Message[]>('/messages/sent'),
      ]);

      const merged = [...inboxRes.data, ...sentRes.data];
      setAllMessages(merged);
      setConversations(buildConversationsFromMessages(merged));
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedUserId) return;

    setSending(true);
    try {
      const receiverId = Number(selectedUserId);
      await apiClient.post<Message>('/messages', {
        receiver_id: receiverId,
        subject: subject || 'Re: Conversation',
        body: newMessage,
      });
      
      setNewMessage('');
      setSubject('');
      await loadConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  }

  function buildConversationsFromMessages(messagesList: Message[]): Conversation[] {
    const convMap = new Map<number, Conversation>();

    messagesList.forEach((msg) => {
      const otherUserId = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
      const otherUserName = msg.sender_id === user?.id ? msg.receiver_name : msg.sender_name;

      const existing = convMap.get(otherUserId);
      const isUnread = !msg.read && msg.receiver_id === user?.id;
      if (!existing || new Date(msg.created_at) > new Date(existing.lastMessageDate)) {
        convMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: msg.body,
          lastMessageDate: msg.created_at,
          unread: isUnread,
        });
      } else if (isUnread) {
        convMap.set(otherUserId, { ...existing, unread: true });
      }
    });

    return Array.from(convMap.values()).sort((a, b) => (
      new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime()
    ));
  }

  function getThreadForUser(userId: number): Message[] {
    return allMessages
      .filter((msg) =>
        (msg.sender_id === user?.id && msg.receiver_id === userId) ||
        (msg.receiver_id === user?.id && msg.sender_id === userId)
      )
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  async function markThreadAsRead(thread: Message[]) {
    const unreadIds = thread
      .filter((msg) => !msg.read && msg.receiver_id === user?.id)
      .map((msg) => msg.id);

    if (unreadIds.length === 0) return;

    try {
      await Promise.all(unreadIds.map((id) => apiClient.patch(`/messages/${id}/read`)));
      const updatedMessages = allMessages.map((msg) => (
        unreadIds.includes(msg.id) ? { ...msg, read: true } : msg
      ));
      setAllMessages(updatedMessages);
      setConversations(buildConversationsFromMessages(updatedMessages));
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-screen flex">
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>

        {conversations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No conversations yet</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map((conv) => (
              <Link
                key={conv.userId}
                to={`/messages?user=${conv.userId}`}
                className={`block p-4 hover:bg-gray-50 transition-colors ${
                  selectedUserId === String(conv.userId) ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">{conv.userName}</h3>
                  {conv.unread && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(conv.lastMessageDate).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {selectedUserId ? (
          <>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {conversations.find((c) => c.userId === Number(selectedUserId))?.userName || `User #${selectedUserId}`}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => {
                const isSent = message.sender_id === user?.id;
                return (
                  <div key={message.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                        isSent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                      } rounded-lg p-4`}
                    >
                      <p className="text-sm font-medium mb-1">{message.subject}</p>
                      <p className="text-sm">{message.body}</p>
                      <p className={`text-xs mt-2 ${isSent ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="mb-3">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
