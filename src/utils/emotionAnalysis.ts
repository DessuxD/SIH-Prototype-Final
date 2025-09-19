import { emotionalDataset, findSimilarEntries, getCrisisEntries, type EmotionalEntry } from '../data/emotionalDataset';

export interface EmotionAnalysisResult {
  detectedEmotion: string;
  severity: 'low' | 'moderate' | 'high' | 'crisis';
  confidence: number;
  suggestedResponse: string;
  copingStrategy: string;
  supportType: 'validation' | 'guidance' | 'intervention' | 'encouragement';
  isCrisis: boolean;
  similarEntries: EmotionalEntry[];
  emotionTags: string[];
}

// Crisis keywords that require immediate attention
const CRISIS_KEYWORDS = [
  'kill myself', 'suicide', 'end it all', 'can\'t go on', 'want to die',
  'hurt myself', 'self harm', 'give up', 'no point living', 'better off dead',
  'overdose', 'jump', 'hanging', 'cutting', 'worthless', 'hopeless',
  'can\'t take it', 'ready to quit everything', 'see no way out'
];

// High-severity emotional indicators
const HIGH_SEVERITY_KEYWORDS = [
  'hate myself', 'can\'t handle', 'overwhelmed', 'breaking down', 'falling apart',
  'can\'t cope', 'losing control', 'panic', 'terrified', 'devastated',
  'empty inside', 'nothing matters', 'can\'t function', 'exhausted'
];

// Comprehensive multilingual emotion detection patterns
const EMOTION_PATTERNS: Record<string, Record<string, string[]>> = {
  en: {
    sad: ['sad', 'depressed', 'down', 'blue', 'miserable', 'crying', 'tears', 'heartbroken', 'devastated'],
    anxious: ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic', 'terror', 'fearful', 'uneasy'],
    angry: ['angry', 'mad', 'furious', 'rage', 'irritated', 'frustrated', 'annoyed', 'pissed', 'outraged'],
    happy: ['happy', 'joyful', 'excited', 'elated', 'cheerful', 'pleased', 'delighted', 'thrilled'],
    stressed: ['stressed', 'overwhelmed', 'pressure', 'burden', 'strain', 'tension', 'overloaded'],
    lonely: ['lonely', 'isolated', 'alone', 'disconnected', 'abandoned', 'rejected', 'excluded'],
    guilty: ['guilty', 'shame', 'regret', 'sorry', 'fault', 'blame', 'responsible'],
    hopeless: ['hopeless', 'pointless', 'meaningless', 'futile', 'worthless', 'doomed'],
    confused: ['confused', 'lost', 'uncertain', 'unclear', 'puzzled', 'bewildered'],
    tired: ['tired', 'exhausted', 'drained', 'weary', 'fatigued', 'worn out']
  },
  hi: {
    sad: ['उदास', 'दुखी', 'परेशान', 'गम', 'रोना', 'दुख', 'निराश', 'मायूस'],
    anxious: ['चिंतित', 'घबराहट', 'डर', 'परेशानी', 'बेचैनी', 'चिंता', 'फिक्र', 'घबराना'],
    angry: ['गुस्सा', 'क्रोध', 'नाराज', 'चिढ़', 'गुस्से', 'क्रोधित'],
    happy: ['खुश', 'अच्छा', 'शानदार', 'खुशी', 'प्रसन्न', 'आनंद', 'हर्ष'],
    stressed: ['तनाव', 'दबाव', 'थका', 'परेशान', 'तनावग्रस्त', 'दबा हुआ'],
    lonely: ['अकेला', 'एकाकी', 'तन्हा', 'अकेलापन'],
    tired: ['थका', 'थकान', 'हारा हुआ', 'कमजोर']
  },
  te: {
    sad: ['దుఃఖం', 'విచారం', 'బాధ', 'దిగులు', 'అవసాదం'],
    anxious: ['ఆందోళన', 'భయం', 'చింత', 'కంగారు', 'అశాంతి'],
    angry: ['కోపం', 'ఆగ్రహం', 'రోషం', 'కోపంగా'],
    happy: ['సంతోషం', 'ఆనందం', 'ఉల్లాసం', 'హర్షం', 'సంతోషంగా'],
    stressed: ['ఒత్తిడి', 'ఆందోళన', 'టెన్షన్', 'ఒత్తిడిలో'],
    tired: ['అలసట', 'అలసిన', 'అలసిపోయిన']
  },
  bn: {
    sad: ['দুঃখ', 'বিষাদ', 'দুঃখিত', 'মন খারাপ', 'বিষণ্ণ'],
    anxious: ['উদ্বিগ্ন', 'চিন্তিত', 'ভয়', 'অস্থির', 'বেচৈন'],
    angry: ['রাগ', 'ক্রোধ', 'রেগে', 'ক্ষুব্ধ', 'অসন্তুষ্ট'],
    happy: ['খুশি', 'আনন্দ', 'সুখী', 'হর্ষিত', 'প্রসন্ন'],
    stressed: ['চাপ', 'মানসিক চাপ', 'টেনশন', 'চাপে'],
    tired: ['ক্লান্ত', 'ক্লান্তি', 'শ্রান্ত', 'হাঁপিয়ে']
  },
  or: {
    sad: ['ଦୁଃଖ', 'ଦୁଃଖିତ', 'ବିଷାଦ', 'ଦୁଃଖଗ୍ରସ୍ତ'],
    anxious: ['ଉଦ୍ବିଗ୍ନ', 'ଚିନ୍ତିତ', 'ଭୟ', 'ଅସ୍ଥିର'],
    angry: ['ରାଗ', 'କ୍ରୋଧ', 'ରାଗିଆ', 'କ୍ଷୁବ୍ଧ'],
    happy: ['ଖୁସି', 'ଆନନ୍ଦ', 'ସୁଖୀ', 'ହର୍ଷିତ'],
    stressed: ['ଚାପ', 'ମାନସିକ ଚାପ', 'ଟେନ୍‌ସନ୍‌'],
    tired: ['କ୍ଲାନ୍ତ', 'ଶ୍ରାନ୍ତ', 'କ୍ଲାନ୍ତି']
  },
  mr: {
    sad: ['दुःख', 'दुःखी', 'उदास', 'विषाद', 'खिन्न'],
    anxious: ['चिंतित', 'काळजी', 'भीती', 'अस्वस्थ', 'घाबरलेला'],
    angry: ['राग', 'क्रोध', 'रागावलेला', 'चिडलेला'],
    happy: ['खुश', 'आनंद', 'प्रसन्न', 'हर्षित', 'संतुष्ट'],
    stressed: ['तणाव', 'दबाव', 'टेन्शन', 'तणावग्रस्त'],
    tired: ['थकलेला', 'थकवा', 'दमलेला', 'कंटाळलेला']
  },
  ta: {
    sad: ['துக்கம்', 'வருத்தம்', 'சோகம்', 'மனவேதனை', 'மனச்சோர்வு'],
    anxious: ['கவலை', 'பதற்றம்', 'பயம்', 'கலக்கம்', 'அச்சம்'],
    angry: ['கோபம்', 'சினம்', 'ஆத்திரம்', 'எரிச்சல்'],
    happy: ['மகிழ்ச்சி', 'சந்தோஷம்', 'ஆனந்தம்', 'உல்லாசம்'],
    stressed: ['மன அழுத்தம்', 'சமுன்னல்', 'டென்ஷன்', 'அழுத்தம்'],
    tired: ['சோர்வு', 'களைப்பு', 'அயர்வு', 'மெத்தென']
  },
  ml: {
    sad: ['ദുഃഖം', 'വിഷാദം', 'സങ്കടം', 'ദുഃഖിതൻ', 'മനോവേദന'],
    anxious: ['ഉത്കണ്ഠ', 'ആകുലത', 'ഭയം', 'അസ്വസ്ഥത', 'വിഷമം'],
    angry: ['കോപം', 'ദേഷ്യം', 'ക്രോധം', 'രോഷം'],
    happy: ['സന്തോഷം', 'ആനന്ദം', 'സന്തോഷമുള്ള', 'ഹർഷം'],
    stressed: ['സമ്മർദ്ദം', 'ടെൻഷൻ', 'സമ്മർദ്ദത്തിൽ', 'മാനസിക സമ്മർദ്ദം'],
    tired: ['ക്ഷീണം', 'ക്ഷീണിതൻ', 'ക്ലാന്തി', 'തളർന്ന്']
  },
  as: {
    sad: ['দুখ', 'দুখী', 'বিষাদগ্ৰস্ত', 'মন বেয়া'],
    anxious: ['চিন্তিত', 'দুশ্চিন্তা', 'ভয়', 'অস্থিৰ'],
    angry: ['খং', 'ৰাগ', 'খঙাল', 'ক্ৰোধিত'],
    happy: ['সুখী', 'আনন্দ', 'আনন্দিত', 'প্ৰসন্ন'],
    stressed: ['মানসিক চাপ', 'টান', 'চাপত'],
    tired: ['ভাগৰ', 'ভাগৰুৱা', 'ক্লান্ত']
  },
  pa: {
    sad: ['ਦੁਖੀ', 'ਉਦਾਸ', 'ਗਮਗੀਨ', 'ਦੁਖ'],
    anxious: ['ਚਿੰਤਿਤ', 'ਪਰੇਸ਼ਾਨ', 'ਡਰਿਆ ਹੋਇਆ', 'ਬੇਚੈਨ'],
    angry: ['ਗੁੱਸਾ', 'ਕ੍ਰੋਧ', 'ਗੁੱਸੇ ਵਿੱਚ', 'ਨਾਰਾਜ਼'],
    happy: ['ਖੁਸ਼', 'ਆਨੰਦ', 'ਖੁਸ਼ੀ', 'ਪ੍ਰਸੰਨ'],
    stressed: ['ਤਣਾਅ', 'ਦਬਾਅ', 'ਟੈਂਸ਼ਨ', 'ਤਣਾਅ ਵਿੱਚ'],
    tired: ['ਥੱਕਿਆ', 'ਥਕਾਵਟ', 'ਸੁਸਤ', 'ਕਮਜ਼ੋਰ']
  },
  gu: {
    sad: ['દુખી', 'ઉદાસ', 'દુઃખ', 'વિષાદ', 'ખિન્ન'],
    anxious: ['ચિંતિત', 'પરેશાન', 'ભય', 'બેચેન', 'ઉદ્વિગ્ન'],
    angry: ['ગુસ્સો', 'ક્રોધ', 'ગુસ્સાથી', 'નારાજ'],
    happy: ['ખુશ', 'આનંદ', 'પ્રસન્ન', 'હર્ષિત', 'આનંદિત'],
    stressed: ['તણાવ', 'દબાણ', 'ટેન્શન', 'તણાવમાં'],
    tired: ['થાકેલો', 'થાક', 'કંટાળેલો', 'કમજોર']
  },
  kn: {
    sad: ['ದುಃಖ', 'ವಿಷಾದ', 'ದುಃಖಿತ', 'ಮನಸ್ಸು ಕೆಟ್ಟು'],
    anxious: ['ಚಿಂತೆ', 'ಆತಂಕ', 'ಭಯ', 'ಅಶಾಂತಿ', 'ಗಲಿಬಿಲಿ'],
    angry: ['ಕೋಪ', 'ಸಿಟ್ಟು', 'ಕೋಪದಿಂದ', 'ರೋಷ'],
    happy: ['ಸಂತೋಷ', 'ಆನಂದ', 'ಖುಷಿ', 'ಹರ್ಷ', 'ಉಲ್ಲಾಸ'],
    stressed: ['ಒತ್ತಡ', 'ಟೆನ್ಶನ್', 'ಮಾನಸಿಕ ಒತ್ತಡ', 'ಒತ್ತಡದಲ್ಲಿ'],
    tired: ['ಆಯಾಸ', 'ಸುಸ್ತು', 'ದಣಿವು', 'ಬಳಲಿಕೆ']
  },
  es: {
    sad: ['triste', 'deprimido', 'abatido', 'melancólico', 'desanimado', 'afligido'],
    anxious: ['ansioso', 'preocupado', 'nervioso', 'inquieto', 'agitado', 'estresado'],
    angry: ['enojado', 'furioso', 'molesto', 'irritado', 'rabioso', 'indignado'],
    happy: ['feliz', 'alegre', 'contento', 'eufórico', 'gozoso', 'dichoso'],
    stressed: ['estresado', 'abrumado', 'agobiado', 'presionado', 'tenso']
  },
  fr: {
    sad: ['triste', 'déprimé', 'abattu', 'mélancolique', 'morne', 'chagriné'],
    anxious: ['anxieux', 'inquiet', 'nerveux', 'soucieux', 'angoissé', 'préoccupé'],
    angry: ['en colère', 'furieux', 'fâché', 'irrité', 'indigné', 'exaspéré'],
    happy: ['heureux', 'joyeux', 'content', 'ravi', 'enjoué', 'réjoui'],
    stressed: ['stressé', 'débordé', 'accablé', 'sous pression', 'tendu']
  }
};

export function analyzeEmotion(
  userInput: string, 
  language: string = 'en',
  emotionalHistory: any[] = []
): EmotionAnalysisResult {
  const inputLower = userInput.toLowerCase();
  
  // 1. Crisis Detection (Highest Priority)
  const isCrisis = CRISIS_KEYWORDS.some(keyword => inputLower.includes(keyword));
  
  if (isCrisis) {
    const crisisEntries = getCrisisEntries();
    const matchingEntry = crisisEntries.find(entry => 
      inputLower.includes(entry.userInput.toLowerCase().substring(0, 10))
    ) || crisisEntries[0];
    
    return {
      detectedEmotion: 'crisis',
      severity: 'crisis',
      confidence: 0.95,
      suggestedResponse: matchingEntry.botResponse + " Please reach out to a crisis hotline immediately: 988 (US) or your local emergency services.",
      copingStrategy: "Immediate professional help needed. " + matchingEntry.copingStrategy,
      supportType: 'intervention',
      isCrisis: true,
      similarEntries: crisisEntries.slice(0, 3),
      emotionTags: ['crisis', 'emergency', 'intervention-needed']
    };
  }
  
  // 2. Find Similar Entries from Dataset
  const similarEntries = findSimilarEntries(userInput, 5);
  
  // 3. Emotion Detection using Patterns
  const emotionPatterns = EMOTION_PATTERNS[language] || EMOTION_PATTERNS.en;
  const emotionScores: Record<string, number> = {};
  
  Object.entries(emotionPatterns).forEach(([emotion, keywords]) => {
    emotionScores[emotion] = keywords.reduce((score, keyword) => {
      return score + (inputLower.includes(keyword) ? 1 : 0);
    }, 0);
  });
  
  // Get the highest scoring emotion
  const detectedEmotion = Object.entries(emotionScores).reduce((a, b) => 
    emotionScores[a[0]] > emotionScores[b[0]] ? a : b
  )[0];
  
  // 4. Severity Assessment
  let severity: EmotionAnalysisResult['severity'] = 'low';
  if (HIGH_SEVERITY_KEYWORDS.some(keyword => inputLower.includes(keyword))) {
    severity = 'high';
  } else if (emotionScores[detectedEmotion] >= 2) {
    severity = 'moderate';
  } else if (emotionScores[detectedEmotion] >= 1) {
    severity = 'low';
  }
  
  // 5. Select Best Response from Dataset
  let bestEntry = similarEntries[0];
  if (!bestEntry && emotionScores[detectedEmotion] > 0) {
    // Find entries with matching emotion tags
    bestEntry = emotionalDataset.find(entry => 
      entry.emotionTags.includes(detectedEmotion)
    ) || emotionalDataset[0];
  }
  
  // 6. Context from Emotional History
  let contextualResponse = bestEntry?.botResponse || "I hear you, and I want you to know that your feelings are valid.";
  
  if (emotionalHistory.length > 0) {
    const recentEmotion = emotionalHistory[0]?.emotion;
    if (recentEmotion === 'sad' && detectedEmotion === 'angry') {
      contextualResponse = "I notice you've been feeling sad, and now there's anger too. Sometimes sadness can transform into anger - both feelings are valid. " + contextualResponse;
    } else if (recentEmotion === detectedEmotion) {
      contextualResponse = "I see you're still struggling with these feelings. That must feel overwhelming. " + contextualResponse;
    }
  }
  
  // 7. Calculate Confidence
  const confidence = Math.min(0.95, Math.max(0.3, 
    (emotionScores[detectedEmotion] * 0.3) + 
    (similarEntries.length > 0 ? 0.4 : 0) + 
    (bestEntry ? 0.3 : 0)
  ));
  
  return {
    detectedEmotion,
    severity,
    confidence,
    suggestedResponse: contextualResponse,
    copingStrategy: bestEntry?.copingStrategy || "Take some deep breaths and be gentle with yourself.",
    supportType: bestEntry?.supportType || 'validation',
    isCrisis: false,
    similarEntries: similarEntries.slice(0, 3),
    emotionTags: bestEntry?.emotionTags || [detectedEmotion]
  };
}

// Therapeutic response patterns
export const THERAPEUTIC_RESPONSES = {
  validation: [
    "Your feelings are completely valid and understandable.",
    "It makes sense that you're feeling this way given what you're going through.",
    "Thank you for trusting me with these difficult emotions.",
    "What you're experiencing is real and important."
  ],
  
  encouragement: [
    "You've shown incredible strength by reaching out today.",
    "Even in this difficult moment, you're taking steps toward healing.",
    "Your resilience shines through even when things feel dark.",
    "You matter, and your wellbeing is important."
  ],
  
  guidance: [
    "Let's explore some strategies that might help you feel more grounded.",
    "There are some techniques we can try together to manage these feelings.",
    "Small steps can lead to meaningful changes in how you're feeling.",
    "Would you like to explore some coping strategies together?"
  ],
  
  reframe: [
    "Sometimes our thoughts can feel very convincing, but they're not always facts.",
    "What would you tell a good friend who was feeling exactly like you are now?",
    "This difficult moment is temporary, even though it doesn't feel that way.",
    "Your current situation doesn't define your future possibilities."
  ]
};

export function generateTherapeuticResponse(
  emotion: string, 
  severity: string, 
  context: string,
  language: string = 'en'
): string {
  const responseType = severity === 'crisis' ? 'intervention' : 
                      severity === 'high' ? 'validation' :
                      severity === 'moderate' ? 'guidance' : 'encouragement';
  
  const responses = THERAPEUTIC_RESPONSES[responseType as keyof typeof THERAPEUTIC_RESPONSES];
  const baseResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Add emotion-specific elements
  const emotionSpecific = getEmotionSpecificResponse(emotion, language);
  
  return `${baseResponse} ${emotionSpecific}`;
}

function getEmotionSpecificResponse(emotion: string, language: string): string {
  const responses: Record<string, Record<string, string>> = {
    en: {
      sad: "It's okay to feel sadness - it shows your capacity for deep emotion and connection.",
      anxious: "Anxiety often comes from caring deeply about outcomes. Your concern shows you care.",
      angry: "Anger can be a signal that something important to you has been threatened or hurt.",
      lonely: "Loneliness is one of the most painful human experiences, but connection is still possible.",
      guilty: "Guilt can weigh heavily, but it often shows your moral compass and desire to do right.",
      hopeless: "When hope feels distant, sometimes we need to borrow hope from others until we find our own again.",
      stressed: "Stress is your mind and body responding to challenges. You're human, not a machine.",
      confused: "Feeling lost or confused is often a sign that you're growing and facing new challenges."
    },
    hi: {
      sad: "उदास होना ठीक है - यह दिखाता है कि आप गहरी भावनाएं महसूस कर सकते हैं।",
      anxious: "चिंता अक्सर तब आती है जब हम किसी चीज़ की गहरी परवाह करते हैं।",
      angry: "गुस्सा एक संकेत हो सकता है कि आपके लिए महत्वपूर्ण कुछ को नुकसान पहुंचा है।",
      lonely: "अकेलापन सबसे दर्दनाक अनुभवों में से एक है, लेकिन संबंध अभी भी संभव हैं।"
    }
  };
  
  const langResponses = responses[language] || responses.en;
  return langResponses[emotion] || langResponses.sad;
}

// Advanced pattern matching for complex emotional states
export function detectComplexEmotions(input: string): string[] {
  const complexPatterns = {
    'mixed-anxiety-depression': ['anxious and sad', 'worried and depressed', 'scared and hopeless'],
    'anger-at-self': ['hate myself', 'angry at myself', 'mad at me'],
    'emotional-numbness': ['feel nothing', 'numb', 'empty inside', 'emotionally dead'],
    'social-anxiety': ['scared of people', 'afraid to speak', 'social anxiety'],
    'perfectionism-stress': ['not good enough', 'must be perfect', 'can\'t make mistakes'],
    'impostor-syndrome': ['don\'t deserve', 'fraud', 'fake it', 'don\'t belong']
  };
  
  const detected: string[] = [];
  const inputLower = input.toLowerCase();
  
  Object.entries(complexPatterns).forEach(([pattern, keywords]) => {
    if (keywords.some(keyword => inputLower.includes(keyword))) {
      detected.push(pattern);
    }
  });
  
  return detected;
}