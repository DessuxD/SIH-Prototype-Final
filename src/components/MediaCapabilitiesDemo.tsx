import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Mic, 
  Camera, 
  Monitor, 
  Smartphone, 
  Headphones,
  CheckCircle,
  AlertCircle,
  Globe,
  Brain,
  Zap,
  Eye,
  Ear,
  Heart,
  Activity,
  Signal,
  Volume2,
  Settings,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface DeviceCapability {
  name: string;
  supported: boolean;
  quality: 'High' | 'Medium' | 'Low';
  icon: React.ReactNode;
  description: string;
}

export function MediaCapabilitiesDemo() {
  const { t, currentLanguage } = useLanguage();
  const [capabilities, setCapabilities] = useState<DeviceCapability[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');

  useEffect(() => {
    analyzeDeviceCapabilities();
    detectDeviceType();
  }, []);

  const detectDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      setDeviceType('tablet');
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      setDeviceType('mobile');
    } else {
      setDeviceType('desktop');
    }
  };

  const analyzeDeviceCapabilities = async () => {
    setIsAnalyzing(true);
    
    const caps: DeviceCapability[] = [];
    let totalScore = 0;

    // Microphone capabilities
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      
      caps.push({
        name: 'Microphone Access',
        supported: audioInputs.length > 0,
        quality: audioInputs.length > 1 ? 'High' : audioInputs.length > 0 ? 'Medium' : 'Low',
        icon: <Mic className="h-5 w-5" />,
        description: `${audioInputs.length} microphone(s) detected`
      });
      
      if (audioInputs.length > 0) totalScore += audioInputs.length > 1 ? 20 : 15;
    } catch (error) {
      caps.push({
        name: 'Microphone Access',
        supported: false,
        quality: 'Low',
        icon: <Mic className="h-5 w-5" />,
        description: 'Microphone access denied or unavailable'
      });
    }

    // Camera capabilities
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      
      caps.push({
        name: 'Camera Access',
        supported: videoInputs.length > 0,
        quality: videoInputs.length > 1 ? 'High' : videoInputs.length > 0 ? 'Medium' : 'Low',
        icon: <Camera className="h-5 w-5" />,
        description: `${videoInputs.length} camera(s) detected`
      });
      
      if (videoInputs.length > 0) totalScore += videoInputs.length > 1 ? 20 : 15;
    } catch (error) {
      caps.push({
        name: 'Camera Access',
        supported: false,
        quality: 'Low',
        icon: <Camera className="h-5 w-5" />,
        description: 'Camera access denied or unavailable'
      });
    }

    // Speech Recognition
    const speechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    caps.push({
      name: 'Speech Recognition',
      supported: speechSupported,
      quality: speechSupported ? 'High' : 'Low',
      icon: <Ear className="h-5 w-5" />,
      description: speechSupported ? 'Native speech recognition available' : 'Speech recognition not supported'
    });
    if (speechSupported) totalScore += 20;

    // Audio Context for advanced analysis
    const audioContextSupported = 'AudioContext' in window || 'webkitAudioContext' in window;
    caps.push({
      name: 'Audio Analysis',
      supported: audioContextSupported,
      quality: audioContextSupported ? 'High' : 'Low',
      icon: <Activity className="h-5 w-5" />,
      description: audioContextSupported ? 'Real-time audio analysis supported' : 'Audio analysis limited'
    });
    if (audioContextSupported) totalScore += 15;

    // Media Recorder
    const mediaRecorderSupported = 'MediaRecorder' in window;
    caps.push({
      name: 'Media Recording',
      supported: mediaRecorderSupported,
      quality: mediaRecorderSupported ? 'High' : 'Low',
      icon: <Volume2 className="h-5 w-5" />,
      description: mediaRecorderSupported ? 'High-quality recording supported' : 'Recording capabilities limited'
    });
    if (mediaRecorderSupported) totalScore += 15;

    // Network connection
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const networkQuality = connection ? 
      connection.effectiveType === '4g' ? 'High' : 
      connection.effectiveType === '3g' ? 'Medium' : 'Low' : 'Medium';
    
    caps.push({
      name: 'Network Quality',
      supported: true,
      quality: networkQuality,
      icon: <Signal className="h-5 w-5" />,
      description: connection ? 
        `${connection.effectiveType?.toUpperCase()} connection detected` : 
        'Network quality unknown'
    });
    if (networkQuality === 'High') totalScore += 10;
    else if (networkQuality === 'Medium') totalScore += 5;

    setCapabilities(caps);
    setOverallScore(Math.min(totalScore, 100));
    setIsAnalyzing(false);
  };

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-6 w-6" />;
      case 'tablet': return <Monitor className="h-6 w-6" />;
      default: return <Monitor className="h-6 w-6" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'High': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const supportedLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-800">Advanced Media Capabilities</CardTitle>
                <p className="text-gray-600">Comprehensive analysis of your device's audio-visual capabilities</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {getDeviceIcon()}
                <span className="text-sm text-gray-600 capitalize">{deviceType}</span>
              </div>
              <Badge className="bg-blue-100 text-blue-700">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Score */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl text-gray-800">Device Compatibility Score</h3>
            <div className="flex items-center justify-center space-x-4">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${overallScore * 3.51} 351`}
                    className={`transition-all duration-1000 ${getScoreColor(overallScore)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl ${getScoreColor(overallScore)}`}>
                    {isAnalyzing ? '...' : `${overallScore}%`}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className={`text-lg ${getScoreColor(overallScore)}`}>
                  {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Basic'}
                </div>
                <p className="text-gray-600 max-w-xs">
                  {overallScore >= 80 ? 
                    'Your device supports all advanced media features for optimal AI interaction.' :
                    overallScore >= 60 ?
                    'Your device supports most features. Some advanced capabilities may be limited.' :
                    'Your device has basic support. Consider upgrading for better experience.'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capabilities.map((capability, index) => (
          <motion.div
            key={capability.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    capability.supported ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <div className={capability.supported ? 'text-green-600' : 'text-red-600'}>
                      {capability.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm text-gray-800">{capability.name}</h4>
                      {capability.supported ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    
                    <Badge className={`text-xs ${getQualityColor(capability.quality)}`}>
                      {capability.quality}
                    </Badge>
                    
                    <p className="text-xs text-gray-600">{capability.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Language Support */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Multilingual Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {supportedLanguages.map((lang) => (
              <div
                key={lang.code}
                className={`p-3 rounded-lg border ${
                  currentLanguage === lang.code 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                } transition-all hover:shadow-md`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{lang.flag}</span>
                  <div>
                    <div className="text-sm text-gray-800">{lang.name}</div>
                    <div className="text-xs text-gray-600">{lang.code.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="mb-2">
                  <strong>Voice Recognition Support:</strong> All listed languages support advanced voice recognition 
                  with emotion detection and real-time transcription.
                </p>
                <p>
                  <strong>AI Analysis:</strong> Our emotional intelligence dataset covers cultural nuances 
                  and expressions specific to each Indian regional language for more accurate support.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Optimization Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {overallScore < 80 && (
              <div className="space-y-3">
                {!capabilities.find(c => c.name === 'Microphone Access')?.supported && (
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div className="text-sm text-yellow-700">
                      <strong>Enable Microphone:</strong> Allow microphone access in your browser settings 
                      to use voice input and emotion detection features.
                    </div>
                  </div>
                )}
                
                {!capabilities.find(c => c.name === 'Camera Access')?.supported && (
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div className="text-sm text-yellow-700">
                      <strong>Enable Camera:</strong> Allow camera access for advanced facial emotion analysis 
                      and enhanced interaction capabilities.
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Heart className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <strong>Best Experience:</strong> Use Chrome or Edge browsers on desktop for optimal 
                    performance with all advanced AI features enabled.
                  </div>
                </div>
              </div>
            )}
            
            {overallScore >= 80 && (
              <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="text-sm text-green-700">
                  <strong>Perfect Setup!</strong> Your device supports all advanced features. 
                  You'll have access to the full range of AI-powered mental health tools including 
                  real-time emotion analysis, multilingual support, and high-quality media processing.
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button
          onClick={analyzeDeviceCapabilities}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            'Re-analyze Capabilities'
          )}
        </Button>
      </div>
    </div>
  );
}