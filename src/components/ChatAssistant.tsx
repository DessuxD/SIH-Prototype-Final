import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { VoiceEmotionDetection } from './VoiceEmotionDetection';
import { MediaInputManager } from './MediaInputManager';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { analyzeEmotion, generateTherapeuticResponse, detectComplexEmotions } from '../utils/emotionAnalysis';
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  Lightbulb, 
  AlertCircle,
  Smile,
  Frown,
  Meh,
  Mic,
  Globe,
  Clock,
  TrendingUp,
  Shield,
  Brain,
  Zap,
  Video
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: 'positive' | 'negative' | 'neutral' | 'happy' | 'sad' | 'anxious' | 'stressed' | 'angry' | 'excited' | 'crisis' | 'lonely' | 'guilty' | 'hopeless';
  suggestion?: string;
  isVoiceMessage?: boolean;
  voiceAnalysis?: {
    confidence: number;
    voiceEmotion: string;
  };
  analysisData?: {
    severity: 'low' | 'moderate' | 'high' | 'crisis';
    confidence: number;
    complexEmotions: string[];
    supportType: 'validation' | 'guidance' | 'intervention' | 'encouragement';
  };
  aiInsights?: {
    emotionDetected: string;
    supportApproach: string;
    severityLevel: string;
    therapeuticStrategy: string;
  };
}

interface EmotionalMemory {
  date: string;
  mood: string;
  emotion: string;
  context: string;
  analysis?: {
    severity: 'low' | 'moderate' | 'high' | 'crisis';
    confidence: number;
    supportType: 'validation' | 'guidance' | 'intervention' | 'encouragement';
    complexEmotions: string[];
  };
}

interface MoodEntry {
  id: string;
  date: Date;
  overall: number;
  energy: number;
  stress: number;
  sleep: number;
  social: number;
  notes: string;
}

export function ChatAssistant() {
  const { t, currentLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVoiceDetection, setShowVoiceDetection] = useState(false);
  const [showAdvancedMedia, setShowAdvancedMedia] = useState(false);
  const [enableVideoInput, setEnableVideoInput] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [emotionalMemory, setEmotionalMemory] = useState<EmotionalMemory[]>([]);
  const [contextualAwareness, setContextualAwareness] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with personalized greeting
  useEffect(() => {
    initializeChat();
    loadEmotionalMemory();
  }, [currentLanguage, t]);

  // Load emotional memory from localStorage and mood tracker
  const loadEmotionalMemory = () => {
    const savedMemory = localStorage.getItem('emotionalMemory');
    if (savedMemory) {
      setEmotionalMemory(JSON.parse(savedMemory));
    }

    // Load recent mood data
    const moodHistory = localStorage.getItem('moodHistory');
    if (moodHistory) {
      const moods: MoodEntry[] = JSON.parse(moodHistory);
      const recentMoods = moods.slice(0, 7); // Last 7 entries
      
      const memoryEntries: EmotionalMemory[] = recentMoods.map(mood => ({
        date: mood.date.toString(),
        mood: getMoodLabel(mood.overall),
        emotion: getEmotionFromMood(mood),
        context: mood.notes || 'No additional context'
      }));
      
      setEmotionalMemory(prev => [...memoryEntries, ...prev].slice(0, 30)); // Keep last 30
    }
  };

  const getMoodLabel = (score: number): string => {
    if (score <= 3) return 'low';
    if (score <= 6) return 'moderate';
    if (score <= 8) return 'good';
    return 'excellent';
  };

  const getEmotionFromMood = (mood: MoodEntry): string => {
    if (mood.stress > 7) return 'stressed';
    if (mood.overall < 4) return 'sad';
    if (mood.energy < 4) return 'tired';
    if (mood.overall > 7) return 'happy';
    return 'neutral';
  };

  const initializeChat = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    const yesterdayMemory = emotionalMemory.find(mem => 
      new Date(mem.date).toDateString() === yesterdayStr
    );

    let greeting = t('chat.title');
    
    if (yesterdayMemory) {
      greeting = t('chat.rememberYesterday', { 
        mood: yesterdayMemory.mood 
      });
    } else {
      greeting = `${t('common.hello')}! ${t('chat.subtitle')}`;
    }

    const initialMessage: Message = {
      id: '1',
      text: greeting,
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'positive'
    };

    setMessages([initialMessage]);
  };

  // Advanced emotion detection using the comprehensive dataset
  const detectEmotion = (text: string): Message['emotion'] => {
    const analysis = analyzeEmotion(text, currentLanguage, emotionalMemory);
    
    // Update contextual awareness with analysis results
    if (analysis.confidence > 0.7) {
      setContextualAwareness(
        `Advanced AI Analysis: ${analysis.detectedEmotion} (${Math.round(analysis.confidence * 100)}% confidence) - ${analysis.supportType} approach suggested`
      );
    }
    
    // Handle crisis situations
    if (analysis.isCrisis) {
      setContextualAwareness('🚨 CRISIS DETECTED - Immediate support protocols activated');
    }
    
    return analysis.detectedEmotion as Message['emotion'];
  };

  // Advanced AI response generation using the emotional dataset
  const generateAIResponse = (userMessage: string, emotion: Message['emotion'], isVoiceMessage = false): string => {
    // Get comprehensive emotion analysis
    const analysis = analyzeEmotion(userMessage, currentLanguage, emotionalMemory);
    
    // Handle crisis situations immediately
    if (analysis.isCrisis) {
      return `${analysis.suggestedResponse}\n\n🆘 **IMPORTANT**: If you're having thoughts of self-harm, please contact:\n• Crisis Text Line: Text HOME to 741741\n• National Suicide Prevention Lifeline: 988\n• Emergency Services: 911\n\nYou matter, and help is available 24/7.`;
    }
    
    // Use the sophisticated response from dataset
    let response = analysis.suggestedResponse;
    
    // Add emotional memory context
    const recentMemory = emotionalMemory.slice(0, 3);
    if (recentMemory.length > 0) {
      const recentEmotions = recentMemory.map(m => m.emotion);
      const emotionPattern = recentEmotions.join(' → ');
      
      if (recentEmotions.includes('sad') && emotion === 'angry') {
        response = `I notice you've been feeling ${emotionPattern}. Sometimes sadness can transform into anger - both feelings are valid. ` + response;
      } else if (recentEmotions.filter(e => e === emotion).length >= 2) {
        response = `I see you're still working through feelings of ${emotion}. That persistence of emotion can feel overwhelming. ` + response;
      }
    }
    
    // Detect complex emotional states
    const complexEmotions = detectComplexEmotions(userMessage);
    if (complexEmotions.length > 0) {
      response += `\n\nI also notice some complex feelings here - this seems to touch on ${complexEmotions.join(', ')}. These layered emotions are completely normal and show your emotional intelligence.`;
    }
    
    // Add voice-specific empathy with advanced features
    if (isVoiceMessage) {
      const voiceAdditions = {
        en: ` I can hear the genuine emotion in your voice - the tone, the pauses, the feeling behind your words. That makes this conversation even more meaningful to me.`,
        hi: ` मैं आपकी आवाज़ में वास्तविक भावना सुन सकता हूं - स्वर, रुकना, आपके शब्दों के पीछे की भावना। यह इस बातचीत को मेरे लिए और भी अर्थपूर्ण बनाता है।`,
        es: ` Puedo escuchar la emoción genuina en tu voz - el tono, las pausas, el sentimiento detrás de tus palabras. Eso hace esta conversación aún más significativa para mí.`
      };
      
      response += voiceAdditions[currentLanguage] || voiceAdditions.en;
    }
    
    // Add therapeutic language based on support type
    if (analysis.supportType === 'validation') {
      response += `\n\n💙 Your feelings are completely valid and make perfect sense given what you're experiencing.`;
    } else if (analysis.supportType === 'encouragement') {
      response += `\n\n🌟 You're showing real strength by reaching out and being so honest about your feelings.`;
    } else if (analysis.supportType === 'guidance') {
      response += `\n\n🛤️ Would you like to explore some specific strategies that might help with what you're feeling?`;
    }
    
    return response;
  };

  // Analyze mood patterns from emotional memory
  const analyzeMoodPattern = (): string => {
    if (emotionalMemory.length < 3) return 'insufficient_data';
    
    const recentMoods = emotionalMemory.slice(0, 7);
    const negativeCount = recentMoods.filter(m => 
      ['sad', 'anxious', 'stressed', 'angry'].includes(m.emotion)
    ).length;
    
    if (negativeCount >= 5) return 'concerning_pattern';
    if (negativeCount >= 3) return 'mixed_pattern';
    return 'stable_pattern';
  };

  // Handle advanced media input
  const handleAdvancedAudioData = (audioBlob: Blob, analysis: any) => {
    // Process the high-quality audio data
    console.log('Received high-quality audio:', audioBlob, analysis);
    
    // You could send this to a more sophisticated backend API for analysis
    // For now, we'll use the existing voice emotion detection
  };

  const handleAdvancedVideoData = (videoBlob: Blob, analysis: any) => {
    // Process video data for facial expression analysis
    console.log('Received video data:', videoBlob, analysis);
    
    // Add video analysis to the chat context
    if (analysis.faceDetected) {
      setContextualAwareness(`Video Analysis: Face detected, engagement ${Math.round(analysis.emotionalCues.engagement)}%`);
    }
  };

  const handleAdvancedTranscript = (transcript: string, confidence: number) => {
    // Handle high-confidence transcripts from advanced media input
    if (confidence > 0.8) {
      setInputText(transcript);
      
      // Auto-send if confidence is very high
      if (confidence > 0.9) {
        setTimeout(() => {
          handleSendMessage();
        }, 500);
      }
    }
  };

  // Handle voice emotion detection
  const handleVoiceEmotion = (result: any) => {
    const emotion = result.emotion;
    setContextualAwareness(`Voice analysis detected: ${emotion} (${Math.round(result.confidence * 100)}% confidence)`);
    
    // Create a voice message
    const voiceMessage: Message = {
      id: Date.now().toString(),
      text: result.transcript,
      sender: 'user',
      timestamp: new Date(),
      emotion: emotion,
      isVoiceMessage: true,
      voiceAnalysis: {
        confidence: result.confidence,
        voiceEmotion: emotion
      }
    };

    setMessages(prev => [...prev, voiceMessage]);
    
    // Generate AI response with voice context
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(result.transcript, emotion, true),
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'positive',
        suggestion: getEmotionBasedSuggestion(emotion)
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Save to emotional memory
      const memoryEntry: EmotionalMemory = {
        date: new Date().toISOString(),
        mood: getMoodFromEmotion(emotion),
        emotion: emotion,
        context: result.transcript
      };
      
      const updatedMemory = [memoryEntry, ...emotionalMemory].slice(0, 30);
      setEmotionalMemory(updatedMemory);
      localStorage.setItem('emotionalMemory', JSON.stringify(updatedMemory));
    }, 1500);
  };

  const getMoodFromEmotion = (emotion: string): string => {
    const moodMap: Record<string, string> = {
      happy: 'good',
      excited: 'excellent',
      sad: 'low',
      anxious: 'low',
      stressed: 'moderate',
      angry: 'low',
      neutral: 'moderate'
    };
    return moodMap[emotion] || 'moderate';
  };

  const getEmotionBasedSuggestion = (emotion: string, analysisResult?: any): string => {
    // Use advanced analysis if available
    if (analysisResult) {
      let suggestion = analysisResult.copingStrategy;
      
      // Add personalized recommendations based on severity
      if (analysisResult.severity === 'high') {
        suggestion += ' Consider booking a counseling session for additional support.';
      } else if (analysisResult.severity === 'crisis') {
        return 'IMMEDIATE: Please contact crisis support services. Your safety is the top priority.';
      }
      
      // Add platform-specific recommendations
      const platformSuggestions = {
        'sad': ' Our mood tracker can help you monitor patterns, and peer forum offers supportive community.',
        'anxious': ' Try our breathing exercises in resources, and consider voice expression instead of typing.',
        'stressed': ' Explore our stress management tools and wellness survey for personalized insights.',
        'angry': ' Our mindfulness resources and anonymous peer forum provide safe outlets.',
        'lonely': ' Connect with others in our peer forum or book a session with a counselor.',
        'guilty': ' Our self-compassion resources and therapeutic chatbot can help process these feelings.',
        'hopeless': ' Please use our crisis resources immediately, and consider professional counseling support.'
      };
      
      suggestion += platformSuggestions[emotion] || platformSuggestions['sad'];
      return suggestion;
    }
    
    // Fallback to basic suggestions
    const suggestions: Record<string, Record<string, string>> = {
      en: {
        sad: 'Consider exploring our mood tracker to monitor your feelings, or browse our wellness resources for coping strategies.',
        anxious: 'Try our breathing exercises in the resources section, or consider booking a session with a counselor.',
        stressed: 'Our stress management resources might be helpful, or you could try tracking your daily mood patterns.',
        angry: 'Take some time for mindfulness. Our peer forum also offers a safe space to express these feelings.',
        happy: 'It\'s wonderful that you\'re feeling good! Consider sharing your positive energy in our peer forum.',
        excited: 'Your enthusiasm is contagious! Why not explore ways to maintain this positive energy in our resources.'
      }
    };
    
    const currentSuggestions = suggestions[currentLanguage] || suggestions.en;
    return currentSuggestions[emotion] || currentSuggestions.sad;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Comprehensive emotion analysis
    const analysisResult = analyzeEmotion(inputText, currentLanguage, emotionalMemory);
    const emotion = detectEmotion(inputText);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      emotion,
      // Add analysis metadata
      analysisData: {
        severity: analysisResult.severity,
        confidence: analysisResult.confidence,
        complexEmotions: detectComplexEmotions(inputText),
        supportType: analysisResult.supportType
      }
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText;
    setInputText('');
    setIsTyping(true);

    // Show real-time analysis
    setContextualAwareness(`Processing: ${analysisResult.detectedEmotion} detected with ${Math.round(analysisResult.confidence * 100)}% confidence...`);

    // Adaptive response time based on complexity
    const responseDelay = analysisResult.isCrisis ? 500 : // Immediate for crisis
                          analysisResult.severity === 'high' ? 1000 : // Quick for high severity
                          analysisResult.confidence > 0.8 ? 1200 : // Normal for confident detection
                          2000; // Longer for complex analysis

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(messageText, emotion),
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'positive',
        suggestion: getEmotionBasedSuggestion(emotion || 'neutral', analysisResult),
        // Add AI analysis insights
        aiInsights: {
          emotionDetected: analysisResult.detectedEmotion,
          supportApproach: analysisResult.supportType,
          severityLevel: analysisResult.severity,
          therapeuticStrategy: analysisResult.copingStrategy
        }
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Enhanced emotional memory with analysis data
      const memoryEntry: EmotionalMemory = {
        date: new Date().toISOString(),
        mood: getMoodFromEmotion(emotion || 'neutral'),
        emotion: analysisResult.detectedEmotion,
        context: messageText,
        // Add rich metadata
        analysis: {
          severity: analysisResult.severity,
          confidence: analysisResult.confidence,
          supportType: analysisResult.supportType,
          complexEmotions: detectComplexEmotions(inputText)
        }
      };
      
      const updatedMemory = [memoryEntry, ...emotionalMemory].slice(0, 50); // Increased memory
      setEmotionalMemory(updatedMemory);
      localStorage.setItem('emotionalMemory', JSON.stringify(updatedMemory));
      
      // Clear contextual awareness after response
      setTimeout(() => {
        setContextualAwareness('');
      }, 3000);
    }, responseDelay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getEmotionIcon = (emotion?: string, severity?: string) => {
    const iconMap = {
      happy: <Smile className="h-4 w-4 text-green-500" />,
      sad: <Frown className="h-4 w-4 text-blue-500" />,
      anxious: <AlertCircle className="h-4 w-4 text-yellow-500" />,
      stressed: <TrendingUp className="h-4 w-4 text-orange-500" />,
      angry: <Frown className="h-4 w-4 text-red-500" />,
      excited: <Heart className="h-4 w-4 text-purple-500" />,
      lonely: <User className="h-4 w-4 text-indigo-500" />,
      guilty: <AlertCircle className="h-4 w-4 text-yellow-600" />,
      hopeless: <Frown className="h-4 w-4 text-gray-600" />,
      crisis: <Shield className="h-4 w-4 text-red-600" />,
      positive: <Smile className="h-4 w-4 text-green-500" />,
      negative: <Frown className="h-4 w-4 text-red-500" />,
      neutral: <Meh className="h-4 w-4 text-gray-500" />
    };
    
    const baseIcon = iconMap[emotion as keyof typeof iconMap] || iconMap.neutral;
    
    // Add severity indicator
    if (severity === 'crisis') {
      return <div className="relative">
        {baseIcon}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      </div>;
    } else if (severity === 'high') {
      return <div className="relative">
        {baseIcon}
        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
      </div>;
    }
    
    return baseIcon;
  };

  const getQuickResponses = () => {
    const responses: Record<string, string[]> = {
      en: [
        "I'm feeling stressed about exams",
        "I'm having trouble sleeping",
        "I feel overwhelmed with coursework",
        "I'm feeling lonely",
        "I'm having a good day!"
      ],
      hi: [
        "मैं परीक्षा को लेकर तनाव में हूं",
        "मुझे नींद आने में परेशानी हो रही है",
        "मैं कोर्सवर्क से परेशान हूं",
        "मैं अकेलापन महसूस कर रहा हूं",
        "मेरा दिन अच्छा जा रहा है!"
      ],
      es: [
        "Me siento estresado por los exámenes",
        "Tengo problemas para dormir",
        "Me siento abrumado con el trabajo del curso",
        "Me siento solo",
        "¡Estoy teniendo un buen día!"
      ]
    };
    
    return responses[currentLanguage] || responses.en;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 h-screen flex flex-col space-y-4">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-800">{t('chat.title')}</h1>
                <p className="text-gray-600">{t('chat.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center space-x-2"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{currentLanguage.toUpperCase()}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVoiceDetection(!showVoiceDetection)}
                className="flex items-center space-x-2"
              >
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Voice</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedMedia(!showAdvancedMedia)}
                className="flex items-center space-x-2 relative"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">AI Media</span>
                {showAdvancedMedia && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </Button>
              
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
            </div>
          </div>
          
          {/* Contextual Awareness Display */}
          {contextualAwareness && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-blue-500" />
                <span className="text-blue-700 text-sm">{contextualAwareness}</span>
              </div>
            </div>
          )}
          
          {/* Emotional Memory Summary */}
          {emotionalMemory.length > 0 && (
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-purple-700 text-sm">
                  Recent patterns: {emotionalMemory.slice(0, 3).map(m => m.emotion).join(', ')}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex-1 flex space-x-4">
        {/* Main Chat */}
        <div className="flex-1 flex flex-col">
          {/* Language Selector */}
          {showLanguageSelector && (
            <div className="mb-4">
              <LanguageSelector compact={true} />
            </div>
          )}
          
          {/* Voice Detection */}
          {showVoiceDetection && (
            <div className="mb-4">
              <VoiceEmotionDetection
                onEmotionDetected={handleVoiceEmotion}
                onTranscriptReceived={(transcript) => setInputText(transcript)}
                language={currentLanguage}
              />
            </div>
          )}
          
          {/* Advanced Media Input */}
          {showAdvancedMedia && (
            <div className="mb-4">
              <MediaInputManager
                onAudioData={handleAdvancedAudioData}
                onVideoData={enableVideoInput ? handleAdvancedVideoData : undefined}
                onTranscriptReceived={handleAdvancedTranscript}
                enableVideo={enableVideoInput}
                enableAudio={true}
                language={currentLanguage}
                realTimeAnalysis={true}
              />
              
              {/* Video Toggle */}
              <div className="mt-4 flex items-center justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEnableVideoInput(!enableVideoInput)}
                  className="flex items-center space-x-2"
                >
                  {enableVideoInput ? (
                    <>
                      <Video className="h-4 w-4" />
                      <span>Disable Video</span>
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4" />
                      <span>Enable Video</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <Card className="flex-1 flex flex-col border-0 shadow-lg">
            <CardContent className="flex-1 p-0 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="w-8 h-8 mt-1">
                        <AvatarFallback className={`${message.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                          {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-2">
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="leading-relaxed">{message.text}</p>
                          
                          {/* Voice message indicator */}
                          {message.isVoiceMessage && (
                            <div className="flex items-center space-x-2 mt-2 text-xs opacity-80">
                              <Mic className="h-3 w-3" />
                              <span>Voice message</span>
                              {message.voiceAnalysis && (
                                <Badge variant="secondary" className="text-xs">
                                  {Math.round(message.voiceAnalysis.confidence * 100)}% confidence
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className={`flex items-center space-x-2 text-xs text-gray-500 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                          {getEmotionIcon(message.emotion, message.analysisData?.severity)}
                          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {message.analysisData && (
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(message.analysisData.confidence * 100)}%
                            </Badge>
                          )}
                        </div>
                        
                        {message.suggestion && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                            <div className="flex items-start space-x-2">
                              <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5" />
                              <p className="text-sm text-blue-700">{message.suggestion}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* AI Insights Panel */}
                        {message.aiInsights && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-2">
                            <div className="flex items-start space-x-2">
                              <Brain className="h-4 w-4 text-purple-500 mt-0.5" />
                              <div className="text-xs text-purple-700 space-y-1">
                                <p><strong>AI Analysis:</strong> {message.aiInsights.emotionDetected}</p>
                                <p><strong>Approach:</strong> {message.aiInsights.supportApproach}</p>
                                <p><strong>Strategy:</strong> {message.aiInsights.therapeuticStrategy}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Complex Emotions Indicator */}
                        {message.analysisData?.complexEmotions && message.analysisData.complexEmotions.length > 0 && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-2">
                            <div className="flex items-start space-x-2">
                              <Zap className="h-3 w-3 text-yellow-500 mt-0.5" />
                              <div className="text-xs text-yellow-700">
                                <p><strong>Complex emotions detected:</strong> {message.analysisData.complexEmotions.join(', ')}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex space-x-3 max-w-[80%]">
                      <Avatar className="w-8 h-8 mt-1">
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Quick Responses */}
              {messages.length <= 1 && (
                <div className="p-4 border-t bg-gray-50">
                  <p className="text-sm text-gray-600 mb-3">{t('chat.voicePrompt')}</p>
                  <div className="flex flex-wrap gap-2">
                    {getQuickResponses().map((response, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputText(response)}
                        className="text-xs hover:bg-blue-50 hover:border-blue-200"
                      >
                        {response}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Input Area */}
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-3">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('chat.placeholder')}
                    className="flex-1 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {t('chat.crisis')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Enhanced Sidebar - AI Analytics */}
        {emotionalMemory.length > 0 && (
          <div className="w-80 space-y-4">
            {/* Emotional Journey */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Heart className="h-4 w-4 text-purple-500" />
                  <h3 className="text-sm text-gray-800">Emotional Journey</h3>
                </div>
                
                <div className="space-y-3">
                  {emotionalMemory.slice(0, 5).map((memory, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          {getEmotionIcon(memory.emotion, memory.analysis?.severity)}
                          <span className="text-xs text-gray-600 capitalize">
                            {memory.emotion}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {memory.analysis && (
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                memory.analysis.severity === 'crisis' ? 'bg-red-100 text-red-700' :
                                memory.analysis.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                memory.analysis.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}
                            >
                              {memory.analysis.severity}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(memory.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      {memory.analysis?.complexEmotions && memory.analysis.complexEmotions.length > 0 && (
                        <div className="text-xs text-gray-600 pl-2 border-l-2 border-purple-200">
                          Complex: {memory.analysis.complexEmotions.slice(0, 2).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* AI Insights Summary */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm text-gray-800">AI Insights</h3>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-blue-700">
                      <strong>Pattern Analysis:</strong> {analyzeMoodPattern() === 'concerning_pattern' ? 
                        'Monitoring increased emotional intensity' : 
                        'Emotional patterns within normal range'}
                    </p>
                  </div>
                  
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-green-700">
                      <strong>Support Readiness:</strong> Advanced emotional intelligence active
                    </p>
                  </div>
                  
                  <div className="p-2 bg-purple-50 rounded">
                    <p className="text-purple-700">
                      <strong>Dataset:</strong> 350+ emotional scenarios analyzed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Crisis Resources */}
            <Card className="border-0 shadow-lg bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="h-4 w-4 text-red-500" />
                  <h3 className="text-sm text-red-800">Crisis Support</h3>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-white rounded border border-red-200">
                    <p className="text-red-700">
                      <strong>24/7 Crisis Line:</strong> 988
                    </p>
                  </div>
                  <div className="p-2 bg-white rounded border border-red-200">
                    <p className="text-red-700">
                      <strong>Text Support:</strong> HOME to 741741
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}