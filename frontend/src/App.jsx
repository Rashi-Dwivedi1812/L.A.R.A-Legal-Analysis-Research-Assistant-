import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Scale, Sparkles, BookOpen, Gavel, MessageSquare, Shield, FileText, Users, Award } from 'lucide-react';
import * as THREE from 'three';
import axios from 'axios';

// --- Floating Images Component ---
const FloatingImages = () => {
  const mountRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Legal-themed icon components as SVG strings with grey theme
    const legalIcons = [
      // Scale of Justice
      '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="1.5" fill="rgba(107,114,128,0.1)"/><path d="M7 14L12 9L17 14" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
      
      // Gavel
      '<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="2" rx="1" fill="rgba(107,114,128,0.1)" stroke="currentColor" stroke-width="1.5"/><rect x="8" y="6" width="8" height="6" rx="1" fill="rgba(107,114,128,0.1)" stroke="currentColor" stroke-width="1.5"/></svg>',
      
      // Shield
      '<svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="rgba(107,114,128,0.1)" stroke="currentColor" stroke-width="1.5"/></svg>',
      
      // Document
      '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" fill="rgba(107,114,128,0.1)" stroke="currentColor" stroke-width="1.5"/><path d="M14 2V8H20" stroke="currentColor" stroke-width="1.5"/></svg>',
      
      // Book
      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M6.5 2H20V20H6.5C5.11929 20 4 18.8807 4 17.5V4.5C4 3.11929 5.11929 2 6.5 2Z" fill="rgba(107,114,128,0.1)" stroke="currentColor" stroke-width="1.5"/></svg>'
    ];

    // Create floating images
    const createFloatingImage = () => {
      const imageElement = document.createElement('div');
      const randomIcon = legalIcons[Math.floor(Math.random() * legalIcons.length)];
      
      imageElement.innerHTML = randomIcon;
      imageElement.style.position = 'absolute';
      imageElement.style.pointerEvents = 'none';
      imageElement.style.color = `rgba(107, 114, 128, ${0.15 + Math.random() * 0.25})`;
      imageElement.style.zIndex = '1';
      
      // Random starting position
      imageElement.style.left = Math.random() * container.clientWidth + 'px';
      imageElement.style.top = container.clientHeight + 'px';
      
      // Random animation duration and direction
      const duration = 15000 + Math.random() * 10000;
      const drift = (Math.random() - 0.5) * 200;
      
      container.appendChild(imageElement);
      imagesRef.current.push(imageElement);
      
      // Animate the image
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (progress >= 1) {
          container.removeChild(imageElement);
          const index = imagesRef.current.indexOf(imageElement);
          if (index > -1) imagesRef.current.splice(index, 1);
          return;
        }
        
        const currentTop = container.clientHeight - (progress * (container.clientHeight + 100));
        const currentLeft = parseFloat(imageElement.style.left) + (drift * progress) / duration * 16;
        
        imageElement.style.top = currentTop + 'px';
        imageElement.style.left = Math.max(0, Math.min(container.clientWidth - 60, currentLeft)) + 'px';
        imageElement.style.transform = `rotate(${progress * 360}deg) scale(${0.8 + Math.sin(progress * Math.PI * 4) * 0.3})`;
        
        requestAnimationFrame(animate);
      };
      animate();
    };

    // Create images at intervals
    const interval = setInterval(createFloatingImage, 3000);
    
    // Initial batch
    setTimeout(createFloatingImage, 1000);
    setTimeout(createFloatingImage, 2000);

    return () => {
      clearInterval(interval);
      imagesRef.current.forEach(img => {
        if (container.contains(img)) {
          container.removeChild(img);
        }
      });
      imagesRef.current = [];
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 overflow-hidden pointer-events-none" />;
};

// --- Enhanced 3D Particles Component ---
const FloatingParticles = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Enhanced particle system with grey theme
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      velocities[i * 3] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;

      // Grey gradient colors
      const colorVariation = Math.random();
      colors[i * 3] = 0.4 + colorVariation * 0.3;     // R
      colors[i * 3 + 1] = 0.4 + colorVariation * 0.3; // G
      colors[i * 3 + 2] = 0.4 + colorVariation * 0.3; // B
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);

      const posAttribute = particles.geometry.attributes.position;
      for (let i = 0; i < particlesCount; i++) {
        posAttribute.array[i * 3] += velocities[i * 3];
        posAttribute.array[i * 3 + 1] += velocities[i * 3 + 1];
        posAttribute.array[i * 3 + 2] += velocities[i * 3 + 2];

        // Wrap particles around
        if (posAttribute.array[i * 3] > 6) posAttribute.array[i * 3] = -6;
        if (posAttribute.array[i * 3] < -6) posAttribute.array[i * 3] = 6;
        if (posAttribute.array[i * 3 + 1] > 6) posAttribute.array[i * 3 + 1] = -6;
        if (posAttribute.array[i * 3 + 1] < -6) posAttribute.array[i * 3 + 1] = 6;
      }
      posAttribute.needsUpdate = true;

      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

// --- Main App Component ---
function App() {
  const [query, setQuery] = useState('');
  const [userRole, setUserRole] = useState('citizen');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState('');

  useEffect(() => {
    setThreadId(crypto.randomUUID());
    // Initial bot message for the light theme
    setMessages([{
        id: crypto.randomUUID(),
        type: 'bot',
        content: `Welcome to L.A.R.A! I am your AI Legal Assistant. How can I help you today? Please select your role and ask a question below.`,
        timestamp: new Date()
    }]);
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
    const currentQuery = query;
    setQuery('');
    setIsLoading(true);

    try {
      const result = await axios.post('http://127.0.0.1:8000/process_query', {
        user_query: currentQuery,
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
    setMessages([{
        id: crypto.randomUUID(),
        type: 'bot',
        content: `Welcome to L.A.R.A! I am your AI Legal Assistant. How can I help you today? Please select your role and ask a question below.`,
        timestamp: new Date()
    }]);
    setThreadId(crypto.randomUUID());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden">
      {/* Background Effects */}
      <FloatingParticles />
      <FloatingImages />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent pointer-events-none z-1" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-2xl">
          <div className="px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Scale className="w-9 h-9 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent drop-shadow-lg">
                  L.A.R.A
                </h1>
                <p className="text-gray-700 text-base font-semibold tracking-wide">Legal Analysis & Research Assistant</p>
                <p className="text-gray-500 text-sm">Powered by Advanced AI Technology</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-2xl transition-all duration-300 backdrop-blur-md border border-gray-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                New Chat
              </div>
            </button>
          </div>
          
           {/* Enhanced Role Selector */}
          <div className="bg-gray-100/80 border-t border-gray-200 px-6 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Your Role:
              </span>
              <div className="flex gap-4">
                {[
                  { value: 'citizen', label: 'Citizen', icon: User },
                  { value: 'lawyer', label: 'Legal Professional', icon: Gavel }
                ].map(({ value, label, icon: Icon }) => (
                  <label key={value} className="cursor-pointer group">
                    <div className={`relative px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 border ${
                      userRole === value 
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg border-gray-600 text-white' 
                        : 'bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 backdrop-blur-md text-gray-700'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          value={value}
                          checked={userRole === value}
                          onChange={(e) => setUserRole(e.target.value)}
                          className="sr-only"
                        />
                        <Icon className={`w-4 h-4 transition-colors ${userRole === value ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}`} />
                        <span className={`font-semibold text-sm transition-colors ${userRole === value ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                          {label}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto py-8 px-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-6 mb-8 animate-fade-in ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-xl border-2 border-gray-300">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                  </div>
                )}
                
                <div className={`max-w-3xl ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div className={`px-8 py-6 rounded-3xl shadow-2xl border-2 backdrop-blur-md ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-gray-700 to-gray-900 text-white border-gray-600'
                      : message.isError
                      ? 'bg-gradient-to-br from-red-500 to-red-700 text-white border-red-400'
                      : 'bg-white/90 text-gray-800 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`font-bold text-base ${
                        message.type === 'user' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {message.type === 'user' ? 'You' : 'L.A.R.A'}
                      </span>
                      {message.type === 'bot' && !message.isError && <Award className="w-4 h-4 text-gray-600" />}
                      <span className={`text-xs ${
                        message.type === 'user' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="prose prose-lg max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                        {message.content}
                      </pre>
                    </div>
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-xl border-2 border-gray-300">
                      <User className="w-7 h-7 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-6 mb-8 animate-fade-in">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-xl border-2 border-gray-300">
                    <Bot className="w-7 h-7 text-white animate-pulse" />
                  </div>
                </div>
                <div className="bg-white/90 rounded-3xl px-8 py-6 shadow-2xl border-2 border-gray-200 max-w-md backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-bold text-base text-gray-700">L.A.R.A</span>
                    <Sparkles className="w-4 h-4 text-gray-600 animate-spin" />
                    <span className="text-xs text-gray-500">analyzing...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-sm text-gray-600 ml-2">Processing your legal inquiry</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your legal question or case in detail..."
                  className="w-full resize-none bg-white backdrop-blur-md border-2 border-gray-300 rounded-3xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-gray-400/50 focus:border-gray-500 text-gray-800 placeholder-gray-500 shadow-2xl transition-all duration-300 text-lg"
                  rows="3"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!query.trim() || isLoading}
                className="px-8 py-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-black text-white rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 shadow-2xl transform hover:scale-105 disabled:hover:scale-100 font-bold text-lg border-2 border-gray-400"
              >
                <Send className="w-6 h-6" />
                <span>Analyze</span>
              </button>
            </div>
            <div className="text-sm text-gray-600 mt-4 text-center flex items-center justify-center gap-4">
              <span>Press Enter to send • Shift+Enter for a new line</span>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Secure & Confidential</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;