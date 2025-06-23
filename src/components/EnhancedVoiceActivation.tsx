/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Trash2 } from 'lucide-react';

// Message type
type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
};

// AI response generator
const getAIResponse = (input: string) => {
  const businessData = {
    mrr: '$12,450',
    users: 847,
    growth: '+23%',
    revenue: '$45,200',
    tasks: 12,
    meetings: 3
  };

  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) {
    return `Hi there! I'm Friday, your business assistant. How may I help you today?`;
  }
  if (lowerInput.includes('what can you do')) {
    return `I'm Friday, your AI assistant. I can check your metrics, manage tasks, schedule meetings, and analyze business trends. How would you like to proceed?`;
  }
  if (lowerInput.includes('revenue') || lowerInput.includes('sales') || lowerInput.includes('money')) {
    return `Your current revenue metrics: MRR is ${businessData.mrr}, total revenue is ${businessData.revenue}, and you're up ${businessData.growth} from last month.`;
  }
  if (lowerInput.includes('users') || lowerInput.includes('customers') || lowerInput.includes('growth')) {
    return `You have ${businessData.users} active users and are growing ${businessData.growth} month-over-month. Keep it up!`;
  }
  if (lowerInput.includes('tasks') || lowerInput.includes('todo') || lowerInput.includes('schedule')) {
    return `You have ${businessData.tasks} tasks and ${businessData.meetings} meetings today. Would you like me to organize them?`;
  }
  if (lowerInput.includes('help')) {
    return `I can help with business metrics, task management, meeting scheduling, and performance analysis. Just tell me what you need.`;
  }
  if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
    return `You're welcome! Always here to support your business success.`;
  }

  const shortInput = input.trim().split(' ').slice(0, 5).join(' ');
  return `I understand you're asking about "${shortInput}". As your business AI, I can help with metrics, tasks, scheduling, and growth analysis. What specific information would you like?`;
};

// Main chat interface
const FridayAIChatInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const fallbackAudioRef = useRef<HTMLAudioElement>(null);

  const playFallbackAudio = () => {
    if (fallbackAudioRef.current) {
      fallbackAudioRef.current.play();
    }
  };

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleVoiceCommand = useCallback((command: string) => {
    if (command.toLowerCase().includes('friday')) {
      setWakeWordDetected(true);
      addMessage(command, 'user');
      setTimeout(() => {
        const response = getAIResponse(command);
        addMessage(response, 'ai');
        playFallbackAudio();
        setWakeWordDetected(false);
      }, 1000);
    }
  }, []);

  const handleTextSubmit = (e: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (inputText.trim()) {
      addMessage(inputText, 'user');
      const response = getAIResponse(inputText);
      setTimeout(() => addMessage(response, 'ai'), 500);
      setInputText('');
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  const handleVoiceToggle = async () => {
    if (!hasPermission) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch {
        return;
      }
    }
    if (!isListening && recognitionRef.current) {
      recognitionRef.current.start();
    } else if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const getButtonState = () => {
    if (isListening) {
      return {
        className: 'bg-gradient-to-br from-green-500 to-green-600 text-white animate-pulse',
        icon: <Mic className="h-6 w-6" />,
        ringColor: 'focus:ring-green-200'
      };
    } else if (wakeWordDetected) {
      return {
        className: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
        icon: <Mic className="h-6 w-6" />,
        ringColor: 'focus:ring-blue-200'
      };
    } else {
      return {
        className: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700',
        icon: <Mic className="h-6 w-6" />,
        ringColor: 'focus:ring-purple-200'
      };
    }
  };

  const buttonState = getButtonState();

  useEffect(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      recognitionRef.current = new SpeechRecognitionClass();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => setIsListening(true);

      recognitionRef.current.onresult = (event: Event) => {
        const speechEvent = event as unknown as { results: SpeechRecognitionResultList };
        const transcript = Array.from(speechEvent.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        if (speechEvent.results[speechEvent.results.length - 1].isFinal) {
          handleVoiceCommand(transcript);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        playFallbackAudio();
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (!wakeWordDetected) {
          playFallbackAudio();
        }
      };
    }
  }, [wakeWordDetected, handleVoiceCommand]);

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then(status => {
        setHasPermission(status.state === 'granted');
        status.onchange = () => {
          setHasPermission(status.state === 'granted');
        };
      });
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative p-4">
      <div className="flex items-center justify-between mb-4">
        <form onSubmit={handleTextSubmit} className="w-full flex gap-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-md text-black dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Type something..."
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Send</button>
        </form>
        <button
          onClick={handleVoiceToggle}
          className={`ml-2 p-3 rounded-full ${buttonState.className} focus:outline-none focus:ring-4 ${buttonState.ringColor}`}
        >
          {buttonState.icon}
        </button>
        <button
          onClick={handleClearMessages}
          className="ml-2 p-3 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div ref={chatContainerRef} className="max-h-80 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`p-2 rounded-md ${msg.sender === 'user' ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white' : 'bg-green-100 dark:bg-green-800 text-black dark:text-white'}`}>
            <div className="text-xs text-gray-500 dark:text-gray-300">{msg.timestamp}</div>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <audio ref={fallbackAudioRef} src="/output.mp3" preload="auto" />
    </div>
  );
};

export default FridayAIChatInterface;
