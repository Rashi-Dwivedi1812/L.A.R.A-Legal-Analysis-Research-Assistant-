import React, { useState, useEffect } from 'react';
import { Send, User, Bot, Scale } from 'lucide-react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [userRole, setUserRole] = useState('citizen');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState('');

  useEffect(() => {
    setThreadId(crypto.randomUUID());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      // Replace with your actual axios call
      const result = await axios.post('http://127.0.0.1:8000/process_query', {
        user_query: query,
        role: userRole,
        thread_id: threadId,
      });

      const botMessage = {
        id: crypto.randomUUID(),
        type: 'bot',
        content: result.data.final_analysis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response from backend:", error);
      const errorMsg = error.response?.data?.detail || 'Could not get a response from the server.';
      
      const errorMessage = {
        id: crypto.randomUUID(),
        type: 'bot',
        content: `Error: ${errorMsg}`,
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setThreadId(crypto.randomUUID());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">L.A.R.A</h1>
            <p className="text-sm text-gray-500">Legal Analysis & Research Assistant</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* Role Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Role:</span>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="citizen"
                checked={userRole === 'citizen'}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Citizen</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="lawyer"
                checked={userRole === 'lawyer'}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Lawyer</span>
            </label>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Scale className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-medium mb-2">Welcome to L.A.R.A</h2>
              <p className="text-sm">Ask your legal questions and get expert analysis</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 p-6 ${
                  message.type === 'user' ? 'bg-gray-50' : 'bg-white'
                } border-b border-gray-100`}
              >
                <div className="flex-shrink-0">
                  {message.type === 'user' ? (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {message.type === 'user' ? 'You' : 'L.A.R.A'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`prose prose-sm max-w-none ${
                    message.isError ? 'text-red-600' : 'text-gray-700'
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {message.content}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 p-6 bg-white border-b border-gray-100">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">L.A.R.A</span>
                    <span className="text-xs text-gray-500">typing...</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your legal question..."
                className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!query.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;