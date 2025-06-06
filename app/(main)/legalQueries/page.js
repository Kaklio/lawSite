'use client';

import { useState, useRef, useEffect } from 'react';
import { SendHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

export default function LawSearch() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]); // [{ role: 'user' | 'bot', text: string, thinkText?: string }]
  const [loading, setLoading] = useState(false);
  const [expandedThinks, setExpandedThinks] = useState({});
  const containerRef = useRef(null);

  const toggleThink = (index) => {
    setExpandedThinks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userQuestion = question;
    setQuestion('');
    setLoading(true);

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', text: userQuestion }]);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await response.json();

      if (response.ok) {
        // Extract think text and main answer
        const fullText = data.answer;
        const thinkMatch = fullText.match(/<think>([\s\S]*?)<\/think>/);
        const thinkText = thinkMatch ? thinkMatch[1].trim() : null;
        const answerText = fullText.replace(/<think>[\s\S]*?<\/think>/, '').trim();

        setMessages((prev) => [...prev, { 
          role: 'bot', 
          text: answerText,
          thinkText: thinkText 
        }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: "Sorry, something went wrong. Please try again." },
        ]);
      }
    } catch (error) {
      console.error("Error calling /api/ask:", error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: "An error occurred while getting the answer." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, loading, expandedThinks]);

  const hasContent = messages.length > 0 || loading;

  return (
    <div className="flex flex-col bg-purple-950 text-white min-h-screen">
      {/* Chat area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6 transition-all duration-300 justify-center flex"
      >
        <div className="max-w-2xl w-full space-y-4 flex flex-col">
          {!hasContent && (
            <h2 className="text-center text-2xl font-semibold opacity-50">
              Ask your legal question
            </h2>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className="w-full">
              {msg.role === 'user' ? (
                <div className="bg-purple-800 p-3 rounded-lg shadow-md whitespace-pre-line leading-relaxed self-end text-right max-w-[90%] ml-auto">
                  {msg.text}
                </div>
              ) : (
                <div className="space-y-2">
{msg.thinkText && (
  <div className="bg-[#2a0252] rounded-lg overflow-hidden">
    <button
      onClick={() => toggleThink(idx)}
      className="w-full flex items-center justify-between p-3 text-sm text-purple-200 hover:text-white transition-colors"
    >
      <span>{expandedThinks[idx] ? 'Hide thought process' : 'Show thought process'}</span>
      {expandedThinks[idx] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    <div
      className={`transition-all duration-700 ease-in-out overflow-hidden ${
        expandedThinks[idx] 
          ? 'max-h-[1000px] opacity-100' 
          : 'max-h-0 opacity-0'
      }`}
    >
      <div className="p-3 pt-0 text-sm text-purple-100 whitespace-pre-line border-t border-purple-900">
        {msg.thinkText}
      </div>
    </div>
  </div>
)}
                  <div className={`bg-[#340259] p-3 rounded-lg shadow-md whitespace-pre-line leading-relaxed`}>
                    {msg.text.startsWith('Article') || msg.text.startsWith('**Answer:**') ? (
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-purple-100 bg-purple-900/50 px-2 py-1 rounded">
                          {msg.text.startsWith('Article') ? 'Legal Answer' : 'Answer'}
                        </h3>
                        <div className="text-white">
                          {msg.text.replace('**Answer:**', '').trim()}
                        </div>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-sm text-purple-300">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150"></div>
              <span>Thinking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="w-full px-4 py-3 border-y border-purple-800 bg-[#250140] sticky bottom-0">
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            className="w-full pr-12 pl-4 py-3 bg-purple-900 text-white placeholder-purple-400 rounded-lg border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ask anything legal"
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition disabled:opacity-50"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}