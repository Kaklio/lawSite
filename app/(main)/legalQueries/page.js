// app/(main)/legalQueries/page.js

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SendHorizontal, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Trash, Pencil, X } from 'lucide-react';

export default function LegalQueries() {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showThinking, setShowThinking] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') fetchChats();
  }, [status]);

  const fetchChats = async () => {
    const res = await fetch('/api/chats');
try {
  const data = await res.json();
  setChats(Array.isArray(data) ? data : []);
} catch (err) {
  console.error("Failed to load chats", err);
  setChats([]);
}
  };

  const handleNewChat = () => {
    setChatId(null);
    setMessages([]);
    setInput('');
  };

  const handleChatSelect = (chat) => {
    setChatId(chat._id);
    setMessages(chat.messages);
  };

  const formatMessage = (content) => {
    const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
    const visible = content.replace(/<think>[\s\S]*?<\/think>/, '').trim();
    // const headingsFormatted = visible.replace(/\*\*(.*?)\*\*/g, '<h3 class="font-semibold text-xl text-purple-300 mt-4 mb-1">$1</h3>');
const headingsFormatted = visible.replace(
  /(?:(\d+\.)\s*)?\*\*(.*?)(:?)\*\*/g,
  (match, number, heading, colon) => 
    `<h3 class="font-semibold text-xl text-purple-300 mt-4 mb-1">${number ? number + ' ' : ''}${heading}${colon}</h3>`
);

    return {
      thinking: thinkMatch ? thinkMatch[1].trim() : null,
      visible: headingsFormatted,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input, chatId }),
    });

    const data = await res.json();
    if (data.error) return;

    const aiMessage = { role: 'ai', content: data.answer };
    setMessages((prev) => [...prev, aiMessage]);
    if (!chatId) fetchChats();
    setInput('');
    setShowThinking(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      {/* Stylish Sidebar */}
      <aside className={`transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-16'} bg-gray-900 text-white flex flex-col p-4 overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4">
          <button
            className="text-white hover:text-purple-400"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
          {isSidebarOpen && <h2 className="text-2xl pr-44 font-semibold">Chats</h2>}
        </div>
        {isSidebarOpen && (
          <>
<button
  className="flex items-center gap-2 bg-gray-800 hover:bg-purple-950 my-1 text-white pr-32 py-1 rounded text-xl"
  onClick={handleNewChat}
>
  <Pencil/> <span>New Chat</span>
</button>
<button
  onClick={() => setShowDeleteModal(true)}
  className="flex items-center gap-2 bg-gray-800 hover:bg-purple-950 my-1 text-white pr-26 py-1 rounded text-xl"
>
  <Trash /> <span>Delete Chats</span>
</button>
            <div className="space-y-2 text-sm">
              {chats.map((chat) => (
                <button
                  key={chat._id}
                  className={`w-full text-left p-2 rounded hover:bg-gray-800 ${chat._id === chatId ? 'bg-purple-700' : ''}`}
                  onClick={() => handleChatSelect(chat)}
                >
                  {chat.title || 'Untitled'}
                </button>
              ))}
            </div>
          </>
        )}

{showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Delete Chats</h3>
        <button onClick={() => setShowDeleteModal(false)}>
          <X className="text-gray-500 hover:text-red-500" />
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2">
        {chats.map(chat => (
          <label key={chat._id} className="flex items-center gap-2 text-sm text-gray-800 dark:text-white">
            <input
              type="checkbox"
              checked={selectedChatIds.includes(chat._id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedChatIds([...selectedChatIds, chat._id]);
                } else {
                  setSelectedChatIds(selectedChatIds.filter(id => id !== chat._id));
                }
              }}
            />
            {chat.title || "Untitled"}
          </label>
        ))}
      </div>

      <button
        onClick={async () => {
          await fetch('/api/chats/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatIds: selectedChatIds })
          });
          setShowDeleteModal(false);
          setSelectedChatIds([]);
          fetchChats(); // refresh UI
          if (selectedChatIds.includes(chatId)) {
            setChatId(null);
            setMessages([]);
          }
        }}
        disabled={selectedChatIds.length === 0}
        className="mt-4 w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded"
      >
        Delete Selected
      </button>
    </div>
  </div>
)}

      </aside>

      {/* Chat Interface */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => {
            if (msg.role === 'ai') {
              const { visible, thinking } = formatMessage(msg.content);
              return (
                <div key={index} className="bg-gray-200 dark:bg-gray-700 p-4 rounded text-sm max-w-2xl self-start mr-auto">
                  <div dangerouslySetInnerHTML={{ __html: visible }} />
                  {thinking && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowThinking((prev) => !prev)}
                        className="text-xs text-purple-600 hover:underline flex items-center gap-1"
                      >
                        {showThinking ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showThinking ? 'Hide reasoning' : 'Show reasoning'}
                      </button>
                      {showThinking && (
                        <div className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded whitespace-pre-wrap">
                          {thinking}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <div
                key={index}
                className={`p-4 rounded max-w-xl text-sm ${msg.role === 'user' ? 'bg-purple-100 dark:bg-purple-800 self-end ml-auto' : 'bg-gray-200 dark:bg-gray-700 self-start mr-auto'}`}
              >
                {msg.content}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a legal question..."
            />
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white p-2 rounded-lg"
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
