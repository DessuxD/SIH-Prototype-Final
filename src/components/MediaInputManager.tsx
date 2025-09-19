import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { 
  Mic, 
  MicOff, 
  Camera,
  CameraOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2,
  Monitor,
  Smartphone,
  Headphones,
  Speaker,
  RefreshCw,
  Zap,
  Eye,
  EyeOff,
  Globe,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface MediaDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput' | 'videoinput';
}

interface AudioAnalysis {
  volume: number;
  frequency: number;
  clarity: number;
  backgroundNoise: number;
}

interface VideoAnalysis {
  brightness: number;
  faceDetected: boolean;
  emotionalCues: {
    expressiveness: number;
    engagement: number;
  };
}

interface MediaInputManagerProps {
  onAudioData: (audioBlob: Blob, analysis: AudioAnalysis) => void;
  onVideoData?: (videoBlob: Blob, analysis: VideoAnalysis) => void;
  onTranscriptReceived: (transcript: string, confidence: number) => void;
  enableVideo?: boolean;
  enableAudio?: boolean;
  language?: string;
  realTimeAnalysis?: boolean;
}

export function MediaInputManager({
  onAudioData,
  onVideoData,
  onTranscriptReceived,
  enableVideo = false,
  enableAudio = true,
  language = 'en',
  realTimeAnalysis = true
}: MediaInputManagerProps) {
  const { t, currentLanguage } = useLanguage();
  
  // Device and Permission States
  const [devices, setDevices] = useState<MediaDevice[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState<string>('');
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  const [hasVideoPermission, setHasVideoPermission] = useState<boolean | null>(null);
  
  // Recording States
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Analysis States
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysis>({
    volume: 0,
    frequency: 0,
    clarity: 0,
    backgroundNoise: 0
  });
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis>({
    brightness: 0,
    faceDetected: false,
    emotionalCues: { expressiveness: 0, engagement: 0 }
  });
  
  // Settings States
  const [audioSettings, setAudioSettings] = useState({
    gain: 50,
    noiseReduction: true,
    echoCancellation: true,
    autoGainControl: true
  });
  const [videoSettings, setVideoSettings] = useState({
    resolution: '720p',
    frameRate: 30,
    brightness: 50,
    contrast: 50
  });
  
  // Live Transcript
  const [liveTranscript, setLiveTranscript] = useState('');
  const [transcriptConfidence, setTranscriptConfidence] = useState(0);
  
  // Refs
  const audioStreamRef = useRef<MediaStream | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);

  // Initialize on component mount
  useEffect(() => {
    initializeMediaDevices();
    initializeSpeechRecognition();
    
    return () => {
      cleanup();
    };
  }, []);

  // Update speech recognition language
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = getLanguageCode(currentLanguage);
    }
  }, [currentLanguage]);

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

  const initializeMediaDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const mediaDevices: MediaDevice[] = deviceList.map(device => ({
        deviceId: device.deviceId,
        label: device.label || `${device.kind} ${device.deviceId.slice(0, 8)}`,
        kind: device.kind as MediaDevice['kind']
      }));
      
      setDevices(mediaDevices);
      
      // Set default devices
      const audioInput = mediaDevices.find(d => d.kind === 'audioinput');
      const videoInput = mediaDevices.find(d => d.kind === 'videoinput');
      const audioOutput = mediaDevices.find(d => d.kind === 'audiooutput');
      
      if (audioInput) setSelectedAudioDevice(audioInput.deviceId);
      if (videoInput) setSelectedVideoDevice(videoInput.deviceId);
      if (audioOutput) setSelectedAudioOutput(audioOutput.deviceId);
      
    } catch (error) {
      console.error('Error enumerating devices:', error);
      setError('Unable to access media devices');
    }
  };

  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getLanguageCode(currentLanguage);
      recognition.maxAlternatives = 3;
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let confidence = 0;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          confidence = result[0].confidence || 0;
          
          if (result.isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const fullTranscript = finalTranscript + interimTranscript;
        setLiveTranscript(fullTranscript);
        setTranscriptConfidence(confidence);
        
        if (finalTranscript) {
          onTranscriptReceived(finalTranscript, confidence);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please speak clearly.');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
      };
      
      recognition.onend = () => {
        if (isAudioRecording) {
          // Restart recognition if still recording
          try {
            recognition.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
          }
        }
      };
      
      recognitionRef.current = recognition;
    } else {
      setError('Speech recognition not supported in this browser');
    }
  };

  const requestAudioPermission = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: selectedAudioDevice ? { exact: selectedAudioDevice } : undefined,
          echoCancellation: audioSettings.echoCancellation,
          noiseSuppression: audioSettings.noiseReduction,
          autoGainControl: audioSettings.autoGainControl,
          sampleRate: 44100,
          channelCount: 2
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      audioStreamRef.current = stream;
      setHasAudioPermission(true);
      
      // Set up audio analysis
      setupAudioAnalysis(stream);
      
      return stream;
    } catch (error) {
      console.error('Audio permission denied:', error);
      setHasAudioPermission(false);
      setError('Microphone access denied. Please allow microphone access in your browser settings.');
      return null;
    }
  };

  const requestVideoPermission = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: selectedVideoDevice ? { exact: selectedVideoDevice } : undefined,
          width: { ideal: videoSettings.resolution === '1080p' ? 1920 : 1280 },
          height: { ideal: videoSettings.resolution === '1080p' ? 1080 : 720 },
          frameRate: { ideal: videoSettings.frameRate }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoStreamRef.current = stream;
      setHasVideoPermission(true);
      
      // Set up video preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      // Set up video analysis
      if (realTimeAnalysis) {
        setupVideoAnalysis();
      }
      
      return stream;
    } catch (error) {
      console.error('Video permission denied:', error);
      setHasVideoPermission(false);
      setError('Camera access denied. Please allow camera access in your browser settings.');
      return null;
    }
  };

  const setupAudioAnalysis = (stream: MediaStream) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm; codecs=opus'
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        onAudioData(audioBlob, audioAnalysis);
      };
      
      audioRecorderRef.current = mediaRecorder;
      
      // Start real-time analysis
      if (realTimeAnalysis) {
        analyzeAudioRealTime();
      }
      
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }
  };

  const setupVideoAnalysis = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const analyzeFrame = () => {
      if (!video.videoWidth || !video.videoHeight) {
        animationFrameRef.current = requestAnimationFrame(analyzeFrame);
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      // Basic video analysis
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let totalBrightness = 0;
      let pixelCount = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;
        pixelCount++;
      }
      
      const avgBrightness = totalBrightness / pixelCount;
      
      // Mock face detection and emotion analysis
      const faceDetected = avgBrightness > 50 && avgBrightness < 200; // Simple brightness-based "detection"
      const expressiveness = Math.random() * 100; // Mock data
      const engagement = faceDetected ? 70 + Math.random() * 30 : 20 + Math.random() * 30;
      
      setVideoAnalysis({
        brightness: avgBrightness,
        faceDetected,
        emotionalCues: {
          expressiveness,
          engagement
        }
      });
      
      if (isVideoRecording) {
        animationFrameRef.current = requestAnimationFrame(analyzeFrame);
      }
    };
    
    analyzeFrame();
  };

  const analyzeAudioRealTime = () => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const frequencyArray = new Uint8Array(bufferLength);
    
    const analyze = () => {
      analyser.getByteTimeDomainData(dataArray);
      analyser.getByteFrequencyData(frequencyArray);
      
      // Calculate volume (RMS)
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const sample = (dataArray[i] - 128) / 128;
        sum += sample * sample;
      }
      const volume = Math.sqrt(sum / dataArray.length) * 100;
      
      // Calculate dominant frequency
      let maxIndex = 0;
      let maxValue = 0;
      for (let i = 0; i < frequencyArray.length; i++) {
        if (frequencyArray[i] > maxValue) {
          maxValue = frequencyArray[i];
          maxIndex = i;
        }
      }
      const frequency = (maxIndex * audioContextRef.current!.sampleRate) / (2 * bufferLength);
      
      // Calculate clarity (high frequency content)
      const highFreqSum = frequencyArray.slice(bufferLength * 0.7).reduce((a, b) => a + b, 0);
      const clarity = (highFreqSum / (bufferLength * 0.3)) / 255 * 100;
      
      // Calculate background noise (low amplitude consistency)
      const lowAmpCount = dataArray.filter(val => Math.abs(val - 128) < 10).length;
      const backgroundNoise = (lowAmpCount / dataArray.length) * 100;
      
      setAudioAnalysis({
        volume: volume,
        frequency: frequency,
        clarity: clarity,
        backgroundNoise: backgroundNoise
      });
      
      if (isAudioRecording) {
        animationFrameRef.current = requestAnimationFrame(analyze);
      }
    };
    
    analyze();
  };

  const startAudioRecording = async () => {
    if (!hasAudioPermission) {
      const stream = await requestAudioPermission();
      if (!stream) return;
    }
    
    setError(null);
    setIsAudioRecording(true);
    setLiveTranscript('');
    
    // Start speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
    
    // Start audio recording
    if (audioRecorderRef.current) {
      audioRecorderRef.current.start(1000); // Collect data every second
    }
    
    // Start real-time analysis
    if (realTimeAnalysis) {
      analyzeAudioRealTime();
    }
  };

  const stopAudioRecording = () => {
    setIsAudioRecording(false);
    
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Stop audio recording
    if (audioRecorderRef.current && audioRecorderRef.current.state === 'recording') {
      audioRecorderRef.current.stop();
    }
    
    // Stop real-time analysis
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const startVideoRecording = async () => {
    if (!hasVideoPermission) {
      const stream = await requestVideoPermission();
      if (!stream) return;
    }
    
    setError(null);
    setIsVideoRecording(true);
    
    // Set up video recorder
    if (videoStreamRef.current && onVideoData) {
      const mediaRecorder = new MediaRecorder(videoStreamRef.current, {
        mimeType: 'video/webm; codecs=vp8,opus'
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        videoChunksRef.current = [];
        onVideoData(videoBlob, videoAnalysis);
      };
      
      videoRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
    }
    
    // Start video analysis
    if (realTimeAnalysis) {
      setupVideoAnalysis();
    }
  };

  const stopVideoRecording = () => {
    setIsVideoRecording(false);
    
    if (videoRecorderRef.current && videoRecorderRef.current.state === 'recording') {
      videoRecorderRef.current.stop();
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const cleanup = () => {
    // Stop all recordings
    stopAudioRecording();
    stopVideoRecording();
    
    // Close streams
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const getDeviceIcon = (kind: string) => {
    switch (kind) {
      case 'audioinput': return <Mic className="h-4 w-4" />;
      case 'audiooutput': return <Speaker className="h-4 w-4" />;
      case 'videoinput': return <Camera className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Controls */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-gray-800">Advanced Media Input</h3>
                  <p className="text-gray-600">High-quality audio and video recording with real-time analysis</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Globe className="h-3 w-3 mr-1" />
                  {currentLanguage.toUpperCase()}
                </Badge>
                {realTimeAnalysis && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <Zap className="h-3 w-3 mr-1" />
                    Real-time AI
                  </Badge>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700">{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setError(null)}
                  className="ml-auto"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Recording Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Audio Controls */}
              {enableAudio && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg text-gray-800 flex items-center space-x-2">
                      <Mic className="h-5 w-5" />
                      <span>Audio Recording</span>
                    </h4>
                    <div className="flex space-x-2">
                      {hasAudioPermission === null && (
                        <Badge variant="secondary">Not requested</Badge>
                      )}
                      {hasAudioPermission === false && (
                        <Badge variant="destructive">Denied</Badge>
                      )}
                      {hasAudioPermission === true && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Authorized
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <AnimatePresence>
                      {!isAudioRecording ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Button
                            onClick={startAudioRecording}
                            disabled={hasAudioPermission === false}
                            className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg"
                          >
                            <Mic className="h-8 w-8" />
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Button
                            onClick={stopAudioRecording}
                            className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white animate-pulse shadow-lg"
                          >
                            <MicOff className="h-8 w-8" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Audio Analysis */}
                  {isAudioRecording && realTimeAnalysis && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Volume</span>
                            <span className="text-sm font-medium">{Math.round(audioAnalysis.volume)}%</span>
                          </div>
                          <Progress value={audioAnalysis.volume} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Clarity</span>
                            <span className="text-sm font-medium">{Math.round(audioAnalysis.clarity)}%</span>
                          </div>
                          <Progress value={audioAnalysis.clarity} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="text-center text-sm text-gray-600">
                        Frequency: {Math.round(audioAnalysis.frequency)} Hz • 
                        Noise: {Math.round(audioAnalysis.backgroundNoise)}%
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Video Controls */}
              {enableVideo && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg text-gray-800 flex items-center space-x-2">
                      <Camera className="h-5 w-5" />
                      <span>Video Recording</span>
                    </h4>
                    <div className="flex space-x-2">
                      {hasVideoPermission === null && (
                        <Badge variant="secondary">Not requested</Badge>
                      )}
                      {hasVideoPermission === false && (
                        <Badge variant="destructive">Denied</Badge>
                      )}
                      {hasVideoPermission === true && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Authorized
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <AnimatePresence>
                      {!isVideoRecording ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Button
                            onClick={startVideoRecording}
                            disabled={hasVideoPermission === false}
                            className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg"
                          >
                            <Video className="h-8 w-8" />
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Button
                            onClick={stopVideoRecording}
                            className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white animate-pulse shadow-lg"
                          >
                            <VideoOff className="h-8 w-8" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Video Preview and Analysis */}
                  {hasVideoPermission && (
                    <div className="space-y-3">
                      <div className="relative">
                        <video
                          ref={videoRef}
                          className="w-full h-32 bg-gray-100 rounded-lg object-cover"
                          muted
                        />
                        <canvas
                          ref={canvasRef}
                          className="hidden"
                        />
                        {isVideoRecording && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-red-500 text-white animate-pulse">
                              ● REC
                            </Badge>
                          </div>
                        )}
                      </div>

                      {isVideoRecording && realTimeAnalysis && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">Brightness</span>
                              <span className="text-sm font-medium">{Math.round(videoAnalysis.brightness)}</span>
                            </div>
                            <Progress value={(videoAnalysis.brightness / 255) * 100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">Engagement</span>
                              <span className="text-sm font-medium">{Math.round(videoAnalysis.emotionalCues.engagement)}%</span>
                            </div>
                            <Progress value={videoAnalysis.emotionalCues.engagement} className="h-2" />
                          </div>
                        </div>
                      )}

                      {videoAnalysis.faceDetected && (
                        <div className="flex items-center space-x-2 text-sm text-green-700">
                          <Eye className="h-4 w-4" />
                          <span>Face detected</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Live Transcript */}
            {liveTranscript && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm text-gray-600">Live Transcript</h4>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(transcriptConfidence * 100)}% confidence
                  </Badge>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="text-gray-800">{liveTranscript}</p>
                </div>
              </div>
            )}

            {/* Device Selection */}
            <div className="space-y-4">
              <h4 className="text-lg text-gray-800 flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Device Settings</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {enableAudio && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Microphone</label>
                      <select
                        value={selectedAudioDevice}
                        onChange={(e) => setSelectedAudioDevice(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      >
                        {devices.filter(d => d.kind === 'audioinput').map(device => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Speaker</label>
                      <select
                        value={selectedAudioOutput}
                        onChange={(e) => setSelectedAudioOutput(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      >
                        {devices.filter(d => d.kind === 'audiooutput').map(device => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                
                {enableVideo && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Camera</label>
                    <select
                      value={selectedVideoDevice}
                      onChange={(e) => setSelectedVideoDevice(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {devices.filter(d => d.kind === 'videoinput').map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}