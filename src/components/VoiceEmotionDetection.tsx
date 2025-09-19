import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Brain,
  Heart,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface VoiceAnalysisResult {
  transcript: string;
  emotion: 'happy' | 'sad' | 'anxious' | 'stressed' | 'neutral' | 'angry' | 'excited';
  confidence: number;
  voiceFeatures: {
    pitch: number;
    speed: number;
    volume: number;
    tone: string;
  };
  linguisticFeatures?: {
    sentiment: number;
    keywords: string[];
  };
}

interface VoiceEmotionDetectionProps {
  onEmotionDetected: (result: VoiceAnalysisResult) => void;
  onTranscriptReceived: (transcript: string) => void;
  isEnabled?: boolean;
  language?: string;
}

export function VoiceEmotionDetection({
  onEmotionDetected,
  onTranscriptReceived,
  isEnabled = true,
  language = 'en'
}: VoiceEmotionDetectionProps) {
  const { t, currentLanguage } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [transcript, setTranscript] = useState('');
  const [detectedEmotion, setDetectedEmotion] = useState<VoiceAnalysisResult | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getLanguageCode(currentLanguage);
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        const fullTranscript = finalTranscript + interimTranscript;
        setTranscript(fullTranscript);
        
        if (finalTranscript) {
          onTranscriptReceived(finalTranscript);
          analyzeEmotionFromText(finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(t('voice.microphoneError'));
      };
      
      recognitionRef.current = recognition;
    } else {
      setError(t('voice.voiceNotSupported'));
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLanguage, t, onTranscriptReceived]);

  // Get language code for speech recognition
  const getLanguageCode = (lang: string): string => {
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'te': 'te-IN',
      'bn': 'bn-IN',
      'or': 'or-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'ml': 'ml-IN',
      'as': 'as-IN',
      'pa': 'pa-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'pt': 'pt-BR',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ar': 'ar-SA',
      'ru': 'ru-RU'
    };
    return langMap[lang] || 'en-US';
  };

  // Request microphone permission
  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      
      // Set up audio context for real-time analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
        analyzeAudioBlob(audioBlob);
      };
      
      return stream;
    } catch (err) {
      console.error('Microphone permission denied:', err);
      setHasPermission(false);
      setError(t('voice.microphoneError'));
      return null;
    }
  };

  // Analyze audio blob for voice features (mock implementation)
  const analyzeAudioBlob = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    // In a real implementation, you would:
    // 1. Send audio to Google Speech-to-Text API
    // 2. Use voice analysis libraries to extract pitch, tone, etc.
    // 3. Apply machine learning models for emotion detection
    
    // Mock analysis - in production, replace with actual API calls
    setTimeout(() => {
      const mockVoiceFeatures = {
        pitch: Math.random() * 100 + 50, // Hz
        speed: Math.random() * 200 + 100, // words per minute
        volume: Math.random() * 100, // dB
        tone: ['monotone', 'varied', 'expressive'][Math.floor(Math.random() * 3)]
      };
      
      const emotion = analyzeEmotionFromVoice(mockVoiceFeatures);
      
      const result: VoiceAnalysisResult = {
        transcript,
        emotion,
        confidence: 0.75 + Math.random() * 0.2,
        voiceFeatures: mockVoiceFeatures
      };
      
      setDetectedEmotion(result);
      onEmotionDetected(result);
      setIsProcessing(false);
    }, 2000);
  };

  // Analyze emotion from voice features (simplified algorithm)
  const analyzeEmotionFromVoice = (features: any): VoiceAnalysisResult['emotion'] => {
    const { pitch, speed, volume, tone } = features;
    
    // Simplified emotion detection based on voice characteristics
    if (pitch > 150 && speed > 150 && volume > 70) {
      return 'excited';
    } else if (pitch < 100 && speed < 120 && volume < 50) {
      return 'sad';
    } else if (speed > 180 && tone === 'varied') {
      return 'anxious';
    } else if (pitch > 130 && volume > 60 && tone === 'expressive') {
      return 'happy';
    } else if (speed > 160 && pitch > 140) {
      return 'stressed';
    } else if (volume > 80 && speed > 170) {
      return 'angry';
    } else {
      return 'neutral';
    }
  };

  // Analyze emotion from text (sentiment analysis)
  const analyzeEmotionFromText = (text: string) => {
    const words = text.toLowerCase().split(' ');
    
    const emotionKeywords = {
      happy: ['happy', 'good', 'great', 'wonderful', 'amazing', 'fantastic', 'excellent', 'joy', 'pleased'],
      sad: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'grief', 'sorrow', 'upset'],
      anxious: ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic', 'fear', 'concern'],
      stressed: ['stressed', 'overwhelmed', 'pressure', 'burden', 'tired', 'exhausted', 'strain'],
      angry: ['angry', 'mad', 'furious', 'rage', 'annoyed', 'irritated', 'frustrated']
    };
    
    let emotionScores = {
      happy: 0,
      sad: 0,
      anxious: 0,
      stressed: 0,
      angry: 0,
      neutral: 0
    };
    
    words.forEach(word => {
      Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
        if (keywords.includes(word)) {
          emotionScores[emotion as keyof typeof emotionScores]++;
        }
      });
    });
    
    const maxEmotion = Object.entries(emotionScores).reduce((a, b) => 
      emotionScores[a[0] as keyof typeof emotionScores] > emotionScores[b[0] as keyof typeof emotionScores] ? a : b
    )[0];
    
    return maxEmotion as VoiceAnalysisResult['emotion'];
  };

  // Monitor audio levels
  const monitorAudioLevels = () => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      setAudioLevel(average);
      
      if (isRecording) {
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      }
    };
    
    updateLevel();
  };

  // Start recording
  const startRecording = async () => {
    if (!hasPermission) {
      const stream = await requestPermission();
      if (!stream) return;
    }
    
    setError(null);
    setTranscript('');
    setDetectedEmotion(null);
    setIsRecording(true);
    
    // Start speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
    
    // Start media recording
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
    }
    
    monitorAudioLevels();
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Stop media recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop audio level monitoring
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setAudioLevel(0);
  };

  // Get emotion color and icon
  const getEmotionDisplay = (emotion: string) => {
    const displays = {
      happy: { color: 'text-green-500', bg: 'bg-green-50', icon: '😊', label: 'Happy' },
      sad: { color: 'text-blue-500', bg: 'bg-blue-50', icon: '😢', label: 'Sad' },
      anxious: { color: 'text-yellow-500', bg: 'bg-yellow-50', icon: '😰', label: 'Anxious' },
      stressed: { color: 'text-orange-500', bg: 'bg-orange-50', icon: '😤', label: 'Stressed' },
      angry: { color: 'text-red-500', bg: 'bg-red-50', icon: '😠', label: 'Angry' },
      excited: { color: 'text-purple-500', bg: 'bg-purple-50', icon: '🤩', label: 'Excited' },
      neutral: { color: 'text-gray-500', bg: 'bg-gray-50', icon: '😐', label: 'Neutral' }
    };
    
    return displays[emotion as keyof typeof displays] || displays.neutral;
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg text-gray-800">{t('voice.startRecording')}</h3>
              <p className="text-gray-600 text-sm">
                {isRecording ? t('voice.speakNow') : t('chat.voicePrompt')}
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4">
            <AnimatePresence>
              {!isRecording ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Button
                    onClick={startRecording}
                    disabled={hasPermission === false}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Button
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white animate-pulse"
                  >
                    <MicOff className="h-6 w-6" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Audio Level Indicator */}
          {isRecording && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <Progress value={audioLevel} className="flex-1 h-2" />
              </div>
              <p className="text-center text-sm text-gray-600">
                {t('voice.listening')}
              </p>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="text-center space-y-2">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
              <p className="text-sm text-gray-600">{t('voice.analyzing')}</p>
            </div>
          )}

          {/* Live Transcript */}
          {transcript && (
            <div className="p-3 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-800 text-sm">{transcript}</p>
            </div>
          )}

          {/* Emotion Detection Result */}
          {detectedEmotion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full ${getEmotionDisplay(detectedEmotion.emotion).bg} flex items-center justify-center`}>
                    <span className="text-2xl">{getEmotionDisplay(detectedEmotion.emotion).icon}</span>
                  </div>
                  <div>
                    <p className={`text-lg ${getEmotionDisplay(detectedEmotion.emotion).color}`}>
                      {t('voice.emotionDetected', { emotion: getEmotionDisplay(detectedEmotion.emotion).label })}
                    </p>
                    <p className="text-sm text-gray-600">
                      Confidence: {Math.round(detectedEmotion.confidence * 100)}%
                    </p>
                  </div>
                </div>
                <Badge className={`${getEmotionDisplay(detectedEmotion.emotion).bg} ${getEmotionDisplay(detectedEmotion.emotion).color} border-0`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Detected
                </Badge>
              </div>

              {/* Voice Features */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Pitch</p>
                  <p className="text-sm text-gray-800">{Math.round(detectedEmotion.voiceFeatures.pitch)} Hz</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Speed</p>
                  <p className="text-sm text-gray-800">{Math.round(detectedEmotion.voiceFeatures.speed)} WPM</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}