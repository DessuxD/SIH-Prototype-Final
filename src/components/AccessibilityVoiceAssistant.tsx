import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Eye,
  EyeOff,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Volume1,
  Accessibility,
  MessageCircle,
  Home,
  Settings,
  HelpCircle,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface AccessibilitySettings {
  speechRate: number;
  speechVolume: number;
  voiceGender: 'male' | 'female' | 'auto';
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  keyboardNavigation: boolean;
  screenReaderMode: boolean;
  continuousListening: boolean;
  confirmationBeeps: boolean;
}

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
  category: 'navigation' | 'chat' | 'settings' | 'help';
}

export function AccessibilityVoiceAssistant() {
  const { t, currentLanguage } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<string>('');
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([]);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    speechRate: 1.0,
    speechVolume: 1.0,
    voiceGender: 'auto',
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    keyboardNavigation: true,
    screenReaderMode: false,
    continuousListening: false,
    confirmationBeeps: true
  });
  const [lastCommand, setLastCommand] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const focusElementRef = useRef<HTMLElement | null>(null);

  // Initialize accessibility features
  useEffect(() => {
    initializeAccessibility();
    setupVoiceCommands();
    loadAccessibilitySettings();
    
    // Announce activation
    speak(t('accessibility.welcomeMessage', { name: 'MindSupport' }) || 
          'Welcome to MindSupport Accessibility Assistant. I am here to help you navigate and use this mental health platform with voice commands.');
    
    return () => {
      cleanup();
    };
  }, [currentLanguage]);

  const initializeAccessibility = async () => {
    try {
      // Initialize speech synthesis
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      }

      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = getLanguageCode(currentLanguage);
        
        recognition.onresult = handleVoiceCommand;
        recognition.onerror = handleRecognitionError;
        recognition.onend = () => {
          if (accessibilitySettings.continuousListening && isListening) {
            startListening();
          }
        };
        
        recognitionRef.current = recognition;
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Accessibility initialization failed:', error);
      speak('Sorry, voice features are not available in this browser.');
    }
  };

  const getLanguageCode = (lang: string): string => {
    const langMap: Record<string, string> = {
      'en': 'en-US', 'hi': 'hi-IN', 'te': 'te-IN', 'bn': 'bn-IN',
      'or': 'or-IN', 'mr': 'mr-IN', 'ta': 'ta-IN', 'ml': 'ml-IN',
      'as': 'as-IN', 'pa': 'pa-IN', 'gu': 'gu-IN', 'kn': 'kn-IN',
      'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE', 'pt': 'pt-BR',
      'zh': 'zh-CN', 'ja': 'ja-JP', 'ar': 'ar-SA', 'ru': 'ru-RU'
    };
    return langMap[lang] || 'en-US';
  };

  const setupVoiceCommands = () => {
    const commands: VoiceCommand[] = [
      // Navigation Commands
      {
        command: 'go home',
        action: () => navigateTo('home'),
        description: 'Navigate to home page',
        category: 'navigation'
      },
      {
        command: 'open chat',
        action: () => navigateTo('chat'),
        description: 'Open AI chat assistant',
        category: 'navigation'
      },
      {
        command: 'mood tracker',
        action: () => navigateTo('mood'),
        description: 'Open mood tracking',
        category: 'navigation'
      },
      {
        command: 'resources',
        action: () => navigateTo('resources'),
        description: 'Open mental health resources',
        category: 'navigation'
      },
      {
        command: 'forum',
        action: () => navigateTo('forum'),
        description: 'Open peer support forum',
        category: 'navigation'
      },
      {
        command: 'book session',
        action: () => navigateTo('booking'),
        description: 'Book counseling session',
        category: 'navigation'
      },

      // Chat Commands
      {
        command: 'start conversation',
        action: () => startConversation(),
        description: 'Begin new chat conversation',
        category: 'chat'
      },
      {
        command: 'voice message',
        action: () => startVoiceMessage(),
        description: 'Send voice message to AI',
        category: 'chat'
      },
      {
        command: 'read messages',
        action: () => readRecentMessages(),
        description: 'Read recent chat messages',
        category: 'chat'
      },

      // Settings Commands
      {
        command: 'speak slower',
        action: () => adjustSpeechRate(-0.2),
        description: 'Decrease speech rate',
        category: 'settings'
      },
      {
        command: 'speak faster',
        action: () => adjustSpeechRate(0.2),
        description: 'Increase speech rate',
        category: 'settings'
      },
      {
        command: 'volume up',
        action: () => adjustVolume(0.2),
        description: 'Increase voice volume',
        category: 'settings'
      },
      {
        command: 'volume down',
        action: () => adjustVolume(-0.2),
        description: 'Decrease voice volume',
        category: 'settings'
      },
      {
        command: 'high contrast',
        action: () => toggleHighContrast(),
        description: 'Toggle high contrast mode',
        category: 'settings'
      },
      {
        command: 'large text',
        action: () => toggleLargeText(),
        description: 'Toggle large text mode',
        category: 'settings'
      },

      // Help Commands
      {
        command: 'help',
        action: () => announceHelp(),
        description: 'Get voice command help',
        category: 'help'
      },
      {
        command: 'what can I say',
        action: () => listCommands(),
        description: 'List available commands',
        category: 'help'
      },
      {
        command: 'repeat',
        action: () => repeatLastMessage(),
        description: 'Repeat last message',
        category: 'help'
      },
      {
        command: 'where am I',
        action: () => announceCurrentLocation(),
        description: 'Announce current page',
        category: 'help'
      }
    ];

    setVoiceCommands(commands);
  };

  const handleVoiceCommand = (event: SpeechRecognitionEvent) => {
    const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    setLastCommand(command);
    
    playConfirmationBeep();
    
    // Find matching command
    const matchedCommand = voiceCommands.find(cmd => 
      command.includes(cmd.command) || 
      cmd.command.split(' ').every(word => command.includes(word))
    );
    
    if (matchedCommand) {
      speak(`Executing: ${matchedCommand.description}`);
      matchedCommand.action();
    } else {
      // Try to extract intent for emotional support
      handleEmotionalIntent(command);
    }
  };

  const handleEmotionalIntent = (command: string) => {
    const emotionalKeywords = {
      crisis: ['help me', 'can\'t take it', 'want to die', 'hurt myself', 'end it all'],
      sad: ['feeling sad', 'depressed', 'down', 'crying', 'upset'],
      anxious: ['anxious', 'worried', 'scared', 'panic', 'nervous'],
      angry: ['angry', 'frustrated', 'mad', 'irritated'],
      happy: ['happy', 'good', 'great', 'wonderful', 'excited'],
      confused: ['confused', 'lost', 'don\'t understand', 'help me understand']
    };

    let detectedEmotion = 'neutral';
    
    for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
      if (keywords.some(keyword => command.includes(keyword))) {
        detectedEmotion = emotion;
        break;
      }
    }

    if (detectedEmotion === 'crisis') {
      handleCrisisSupport(command);
    } else if (detectedEmotion !== 'neutral') {
      handleEmotionalSupport(detectedEmotion, command);
    } else {
      speak('I heard you say: ' + command + '. How can I help you with your mental health needs today?');
    }
  };

  const handleCrisisSupport = (command: string) => {
    speak(`I'm concerned about what you shared. Please know that you're not alone and help is available. 
           I'm going to connect you with crisis resources immediately. 
           You can call 988 for the suicide prevention lifeline, or text HOME to 741741 for crisis text support.
           Would you like me to help you access immediate professional help?`);
    
    // Navigate to crisis resources
    setTimeout(() => {
      navigateTo('resources');
      speak('I have opened the crisis support resources. Please reach out for immediate help.');
    }, 3000);
  };

  const handleEmotionalSupport = (emotion: string, command: string) => {
    const supportResponses = {
      sad: 'I hear that you\'re feeling sad, and I want you to know that those feelings are valid. Would you like me to open the chat where you can talk more about this, or would you prefer to track your mood?',
      anxious: 'It sounds like you\'re feeling anxious. That can be really overwhelming. I can help you access breathing exercises, open a chat session, or guide you to anxiety resources. What would be most helpful right now?',
      angry: 'I can hear that you\'re feeling angry or frustrated. Those are normal emotions. Would you like to talk to our AI counselor, or should I help you find healthy ways to manage these feelings?',
      happy: 'I\'m glad to hear you\'re feeling positive! That\'s wonderful. Would you like to record this good mood in your mood tracker, or perhaps share your positive energy in our peer forum?',
      confused: 'It\'s okay to feel confused or lost sometimes. I\'m here to help guide you. Would you like me to explain how to use the platform, or would you prefer to talk with our AI assistant about what\'s confusing you?'
    };

    const response = supportResponses[emotion as keyof typeof supportResponses] || 
                    'I\'m here to support you. How can I help you with your mental health today?';
    
    speak(response);
  };

  const speak = (text: string, priority: 'low' | 'high' = 'high') => {
    if (!synthRef.current) return;

    // Cancel current speech if high priority
    if (priority === 'high' && synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = accessibilitySettings.speechRate;
    utterance.volume = accessibilitySettings.speechVolume;
    utterance.lang = getLanguageCode(currentLanguage);

    // Select voice based on preference
    const voices = synthRef.current.getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(currentLanguage) && 
        (accessibilitySettings.voiceGender === 'auto' || 
         voice.name.toLowerCase().includes(accessibilitySettings.voiceGender))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentUtterance(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentUtterance('');
    };

    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      setIsListening(true);
      recognitionRef.current.start();
      
      if (accessibilitySettings.confirmationBeeps) {
        playStartBeep();
      }
      
      speak('Listening for your command', 'low');
    } catch (error) {
      console.error('Failed to start listening:', error);
      speak('Sorry, voice recognition is not available right now.');
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    
    setIsListening(false);
    recognitionRef.current.stop();
    
    if (accessibilitySettings.confirmationBeeps) {
      playStopBeep();
    }
  };

  const playConfirmationBeep = () => {
    if (!accessibilitySettings.confirmationBeeps) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const playStartBeep = () => {
    // Higher pitch beep for start
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const playStopBeep = () => {
    // Lower pitch beep for stop
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  // Voice command implementations
  const navigateTo = (page: string) => {
    speak(`Navigating to ${page}`);
    // Emit navigation event that parent component can listen to
    window.dispatchEvent(new CustomEvent('voice-navigate', { detail: { page } }));
  };

  const startConversation = () => {
    speak('Starting new conversation with AI mental health assistant');
    navigateTo('chat');
  };

  const startVoiceMessage = () => {
    speak('Ready to record your voice message. Please speak after the beep.');
    // Trigger voice message component
    window.dispatchEvent(new CustomEvent('voice-message-start'));
  };

  const readRecentMessages = () => {
    speak('Reading recent chat messages');
    // Get messages from local storage or context
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const recentMessages = messages.slice(-3);
    
    if (recentMessages.length === 0) {
      speak('No recent messages found. Would you like to start a new conversation?');
    } else {
      recentMessages.forEach((msg: any, index: number) => {
        const speaker = msg.sender === 'user' ? 'You said' : 'AI responded';
        speak(`${speaker}: ${msg.text}`, 'low');
      });
    }
  };

  const adjustSpeechRate = (change: number) => {
    const newRate = Math.max(0.1, Math.min(3.0, accessibilitySettings.speechRate + change));
    setAccessibilitySettings(prev => ({ ...prev, speechRate: newRate }));
    speak(`Speech rate adjusted to ${Math.round(newRate * 100)}%`);
  };

  const adjustVolume = (change: number) => {
    const newVolume = Math.max(0.1, Math.min(1.0, accessibilitySettings.speechVolume + change));
    setAccessibilitySettings(prev => ({ ...prev, speechVolume: newVolume }));
    speak(`Volume adjusted to ${Math.round(newVolume * 100)}%`);
  };

  const toggleHighContrast = () => {
    const newHighContrast = !accessibilitySettings.highContrast;
    setAccessibilitySettings(prev => ({ ...prev, highContrast: newHighContrast }));
    
    // Apply high contrast mode
    if (newHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    speak(`High contrast mode ${newHighContrast ? 'enabled' : 'disabled'}`);
  };

  const toggleLargeText = () => {
    const newLargeText = !accessibilitySettings.largeText;
    setAccessibilitySettings(prev => ({ ...prev, largeText: newLargeText }));
    
    // Apply large text mode
    if (newLargeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
    
    speak(`Large text mode ${newLargeText ? 'enabled' : 'disabled'}`);
  };

  const announceHelp = () => {
    const helpText = `
      MindSupport Voice Assistant Help.
      You can say commands like:
      - "Go home" to navigate to the home page
      - "Open chat" to start talking with the AI assistant
      - "Mood tracker" to track your emotional state
      - "Help" to hear this message again
      - "What can I say" to hear all available commands
      - "Speak slower" or "speak faster" to adjust my speaking speed
      - "Volume up" or "volume down" to adjust my volume
      - Say "I'm feeling sad" or describe your emotions and I'll help guide you to appropriate support.
      
      For crisis support, you can say "help me" and I'll connect you with immediate resources.
      
      To stop listening, say "stop" or press the microphone button.
    `;
    speak(helpText);
  };

  const listCommands = () => {
    const commandsByCategory = voiceCommands.reduce((acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = [];
      acc[cmd.category].push(cmd);
      return acc;
    }, {} as Record<string, VoiceCommand[]>);

    Object.entries(commandsByCategory).forEach(([category, commands]) => {
      speak(`${category} commands:`);
      commands.forEach(cmd => {
        speak(`Say "${cmd.command}" to ${cmd.description}`, 'low');
      });
    });
  };

  const repeatLastMessage = () => {
    if (currentUtterance) {
      speak(currentUtterance);
    } else {
      speak('No previous message to repeat');
    }
  };

  const announceCurrentLocation = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'home';
    speak(`You are currently on the ${currentPage} page of MindSupport mental health platform`);
  };

  const handleRecognitionError = (event: any) => {
    console.error('Speech recognition error:', event.error);
    
    const errorMessages = {
      'no-speech': 'No speech detected. Please try speaking clearly.',
      'audio-capture': 'Audio capture failed. Please check your microphone.',
      'not-allowed': 'Microphone access denied. Please allow microphone access.',
      'network': 'Network error. Please check your connection.',
      'aborted': 'Speech recognition was stopped.'
    };
    
    const message = errorMessages[event.error as keyof typeof errorMessages] || 
                    'Speech recognition error occurred. Please try again.';
    
    speak(message);
    setIsListening(false);
  };

  const loadAccessibilitySettings = () => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      setAccessibilitySettings(JSON.parse(saved));
    }
  };

  const saveAccessibilitySettings = () => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
  };

  useEffect(() => {
    saveAccessibilitySettings();
  }, [accessibilitySettings]);

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  if (!isInitialized) {
    return (
      <Card className="border-2 border-blue-500 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
              <Accessibility className="h-6 w-6 text-white" />
            </div>
            <p>Initializing Accessibility Assistant...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${accessibilitySettings.highContrast ? 'border-yellow-400 bg-black text-white' : 'border-blue-500'} shadow-lg`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                accessibilitySettings.highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'
              }`}>
                <Accessibility className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`text-lg ${accessibilitySettings.largeText ? 'text-2xl' : ''}`}>
                  Voice Assistant
                </h3>
                <p className={`text-sm opacity-75 ${accessibilitySettings.largeText ? 'text-lg' : ''}`}>
                  Accessibility-focused mental health support
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Badge className={accessibilitySettings.highContrast ? 'bg-yellow-400 text-black' : ''}>
                {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Ready'}
              </Badge>
            </div>
          </div>

          {/* Status Display */}
          {currentUtterance && (
            <div className={`p-3 rounded-lg border ${
              accessibilitySettings.highContrast ? 'bg-gray-800 border-yellow-400' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-blue-500" />
                <span className={`text-sm ${accessibilitySettings.largeText ? 'text-lg' : ''}`}>
                  Speaking: {currentUtterance.substring(0, 100)}...
                </span>
              </div>
            </div>
          )}

          {/* Last Command */}
          {lastCommand && (
            <div className={`p-3 rounded-lg border ${
              accessibilitySettings.highContrast ? 'bg-gray-800 border-yellow-400' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span className={`text-sm ${accessibilitySettings.largeText ? 'text-lg' : ''}`}>
                  Last command: "{lastCommand}"
                </span>
              </div>
            </div>
          )}

          {/* Main Controls */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
              className={`h-16 ${accessibilitySettings.largeText ? 'h-20 text-lg' : ''} ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? <MicOff className="h-6 w-6 mr-2" /> : <Mic className="h-6 w-6 mr-2" />}
              {isListening ? 'Stop' : 'Listen'}
            </Button>
            
            <Button
              onClick={announceHelp}
              variant="outline"
              className={`h-16 ${accessibilitySettings.largeText ? 'h-20 text-lg' : ''}`}
              aria-label="Get help with voice commands"
            >
              <HelpCircle className="h-6 w-6 mr-2" />
              Help
            </Button>
          </div>

          {/* Quick Settings */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => adjustSpeechRate(-0.2)}
              variant="outline"
              size="sm"
              className={accessibilitySettings.largeText ? 'h-12 text-lg' : ''}
            >
              Slower
            </Button>
            <Button
              onClick={() => adjustSpeechRate(0.2)}
              variant="outline"
              size="sm"
              className={accessibilitySettings.largeText ? 'h-12 text-lg' : ''}
            >
              Faster
            </Button>
            <Button
              onClick={toggleHighContrast}
              variant="outline"
              size="sm"
              className={accessibilitySettings.largeText ? 'h-12 text-lg' : ''}
            >
              {accessibilitySettings.highContrast ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              onClick={toggleLargeText}
              variant="outline"
              size="sm"
              className={accessibilitySettings.largeText ? 'h-12 text-lg' : ''}
            >
              Large Text
            </Button>
          </div>

          {/* Emergency Support */}
          <div className={`p-4 rounded-lg border-2 ${
            accessibilitySettings.highContrast ? 'border-red-400 bg-red-900' : 'border-red-300 bg-red-50'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className={`text-red-700 ${accessibilitySettings.largeText ? 'text-lg' : 'text-sm'}`}>
                Crisis Support
              </span>
            </div>
            <p className={`text-red-600 ${accessibilitySettings.largeText ? 'text-base' : 'text-xs'}`}>
              Say "help me" for immediate crisis support, or "crisis" to access emergency resources.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}