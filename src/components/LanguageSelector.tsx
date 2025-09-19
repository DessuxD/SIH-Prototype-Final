import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  Globe, 
  ChevronDown, 
  MapPin, 
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, SupportedLanguage } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  showLocationDetection?: boolean;
  compact?: boolean;
}

export function LanguageSelector({ 
  showLocationDetection = true, 
  compact = false 
}: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, supportedLanguages, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Detect user's location and suggest language
  const detectLocationLanguage = async () => {
    setIsDetectingLocation(true);
    
    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // In a real app, you'd use a reverse geocoding service
      // For demo purposes, we'll simulate language detection based on coordinates
      const detectedLanguage = simulateLanguageDetection(latitude, longitude);
      
      if (detectedLanguage && detectedLanguage !== currentLanguage) {
        const langInfo = supportedLanguages.find(lang => lang.code === detectedLanguage);
        if (langInfo && confirm(`Detected location suggests ${langInfo.nativeName}. Switch to this language?`)) {
          setLanguage(detectedLanguage);
        }
      }
    } catch (error) {
      console.error('Location detection failed:', error);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Simulate language detection based on coordinates
  const simulateLanguageDetection = (lat: number, lng: number): SupportedLanguage | null => {
    // Simple geographic language mapping (for demo)
    if (lat >= 20 && lat <= 37 && lng >= 68 && lng <= 97) return 'hi'; // India region
    if (lat >= 36 && lat <= 72 && lng >= -9 && lng <= 40) return 'en'; // Europe/UK
    if (lat >= 35 && lat <= 43 && lng >= -5 && lng <= 9) return 'es'; // Spain
    if (lat >= 41 && lat <= 51 && lng >= -5 && lng <= 9) return 'fr'; // France
    if (lat >= 47 && lat <= 55 && lng >= 5 && lng <= 15) return 'de'; // Germany
    if (lat >= -34 && lat <= 5 && lng >= -74 && lng <= -34) return 'pt'; // Brazil
    if (lat >= 18 && lat <= 54 && lng >= 73 && lng <= 135) return 'zh'; // China
    if (lat >= 24 && lat <= 46 && lng >= 123 && lng <= 146) return 'ja'; // Japan
    if (lat >= 12 && lat <= 37 && lng >= 34 && lng <= 55) return 'ar'; // Middle East
    if (lat >= 41 && lat <= 82 && lng >= 19 && lng <= 180) return 'ru'; // Russia
    
    return null;
  };

  const currentLangInfo = supportedLanguages.find(lang => lang.code === currentLanguage);

  if (compact) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 h-8 px-2"
        >
          <span className="text-lg">{currentLangInfo?.flag}</span>
          <span className="text-xs">{currentLangInfo?.code.toUpperCase()}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-full right-0 mt-1 z-50"
            >
              <Card className="border-0 shadow-lg min-w-[200px]">
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {supportedLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentLanguage === lang.code
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="flex-1 text-left">{lang.nativeName}</span>
                        {currentLanguage === lang.code && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg text-gray-800">Language Preferences</h3>
                <p className="text-gray-600 text-sm">Choose your preferred language</p>
              </div>
            </div>
            
            {showLocationDetection && (
              <Button
                variant="outline"
                size="sm"
                onClick={detectLocationLanguage}
                disabled={isDetectingLocation}
                className="flex items-center space-x-2"
              >
                <MapPin className="h-4 w-4" />
                <span>{isDetectingLocation ? 'Detecting...' : 'Auto-detect'}</span>
              </Button>
            )}
          </div>

          {/* Current Language */}
          <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-2xl">{currentLangInfo?.flag}</span>
            <div>
              <p className="text-blue-800">{currentLangInfo?.nativeName}</p>
              <p className="text-blue-600 text-sm">{currentLangInfo?.name}</p>
            </div>
            <Badge className="bg-blue-100 text-blue-700 ml-auto">Current</Badge>
          </div>

          {/* Language Grid */}
          <div className="grid grid-cols-2 gap-3">
            {supportedLanguages
              .filter(lang => lang.code !== currentLanguage)
              .map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {lang.flag}
                  </span>
                  <div className="text-left">
                    <p className="text-gray-800 text-sm">{lang.nativeName}</p>
                    <p className="text-gray-500 text-xs">{lang.name}</p>
                  </div>
                </button>
              ))}
          </div>

          {/* RTL Support Notice */}
          {isRTL && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700 text-sm">
                  Right-to-left layout is now active
                </span>
              </div>
            </div>
          )}

          {/* Features Notice */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-700 text-sm mb-2">
              <strong>Multilingual Features:</strong>
            </p>
            <ul className="text-gray-600 text-xs space-y-1">
              <li>• AI chatbot responds in your language</li>
              <li>• Voice recognition supports your language</li>
              <li>• All interface elements are translated</li>
              <li>• Cultural context-aware responses</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}