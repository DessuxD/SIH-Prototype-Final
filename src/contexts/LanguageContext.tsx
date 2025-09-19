import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'te' | 'bn' | 'or' | 'mr' | 'ta' | 'ml' | 'as' | 'pa' | 'gu' | 'kn' | 'es' | 'fr' | 'de' | 'pt' | 'zh' | 'ja' | 'ar' | 'ru';

interface Translation {
  [key: string]: string | Translation;
}

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
  supportedLanguages: { code: SupportedLanguage; name: string; nativeName: string; flag: string; region?: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Supported languages with regional information
const supportedLanguages = [
  // Global Languages
  { code: 'en' as SupportedLanguage, name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Global' },
  
  // Indian Regional Languages
  { code: 'hi' as SupportedLanguage, name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India' },
  { code: 'te' as SupportedLanguage, name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'Andhra Pradesh, Telangana' },
  { code: 'bn' as SupportedLanguage, name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', region: 'West Bengal, Bangladesh' },
  { code: 'or' as SupportedLanguage, name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', region: 'Odisha' },
  { code: 'mr' as SupportedLanguage, name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'Maharashtra' },
  { code: 'ta' as SupportedLanguage, name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'Tamil Nadu' },
  { code: 'ml' as SupportedLanguage, name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'Kerala' },
  { code: 'as' as SupportedLanguage, name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', region: 'Assam' },
  { code: 'pa' as SupportedLanguage, name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'Punjab' },
  { code: 'gu' as SupportedLanguage, name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'Gujarat' },
  { code: 'kn' as SupportedLanguage, name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'Karnataka' },
  
  // International Languages
  { code: 'es' as SupportedLanguage, name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Global' },
  { code: 'fr' as SupportedLanguage, name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Global' },
  { code: 'de' as SupportedLanguage, name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany' },
  { code: 'pt' as SupportedLanguage, name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', region: 'Brazil, Portugal' },
  { code: 'zh' as SupportedLanguage, name: 'Chinese', nativeName: '中文', flag: '🇨🇳', region: 'China' },
  { code: 'ja' as SupportedLanguage, name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Japan' },
  { code: 'ar' as SupportedLanguage, name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East' },
  { code: 'ru' as SupportedLanguage, name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Russia' }
];

// Translation data structure
const translations: Record<SupportedLanguage, Translation> = {
  en: {
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      continue: 'Continue',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      search: 'Search',
      filter: 'Filter',
      close: 'Close',
      menu: 'Menu',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      signup: 'Sign Up',
      welcome: 'Welcome',
      hello: 'Hello',
      today: 'Today',
      yesterday: 'Yesterday',
      week: 'Week',
      month: 'Month',
      year: 'Year'
    },
    navigation: {
      home: 'Home',
      chat: 'AI Support',
      mood: 'Mood Tracker',
      survey: 'Wellness Survey',
      resources: 'Resources',
      forum: 'Peer Forum',
      booking: 'Book Session',
      dashboard: 'Dashboard'
    },
    chat: {
      title: 'AI Mental Health Support',
      subtitle: 'Your compassionate digital companion for emotional wellbeing',
      placeholder: 'Share what\'s on your mind...',
      voicePrompt: 'Click to speak or type your message',
      listening: 'Listening...',
      processing: 'Processing your voice...',
      emotionDetected: 'I can hear you\'re feeling {{emotion}}',
      rememberYesterday: 'I remember yesterday you felt {{mood}}. How are you doing today?',
      supportiveResponse: 'I\'m here to support you through this.',
      crisis: 'This is a supportive AI assistant. For crisis situations, please contact emergency services.'
    },
    accessibility: {
      welcomeMessage: 'Welcome to {{name}} Accessibility Assistant. I am here to help you navigate and use this mental health platform with voice commands.'
    },
    mood: {
      title: 'Daily Mood Tracker',
      subtitle: 'Track your emotional wellbeing and identify patterns',
      overall: 'Overall Mood',
      energy: 'Energy Level',
      stress: 'Stress Level',
      sleep: 'Sleep Quality',
      social: 'Social Connection',
      notes: 'Additional Notes',
      saveToday: 'Save Today\'s Mood',
      howFeeling: 'How are you feeling today?',
      moodSaved: 'Mood entry saved successfully!'
    },
    voice: {
      startRecording: 'Start Voice Recording',
      stopRecording: 'Stop Recording',
      analyzing: 'Analyzing your voice...',
      emotionDetected: 'Emotion detected: {{emotion}}',
      speakNow: 'Speak now...',
      voiceNotSupported: 'Voice recognition not supported in this browser',
      microphoneError: 'Could not access microphone. Please check permissions.'
    }
  },
  hi: {
    common: {
      loading: 'लोड हो रहा है...',
      save: 'सेव करें',
      cancel: 'रद्द करें',
      continue: 'जारी रखें',
      back: 'वापस',
      next: 'अगला',
      submit: 'जमा करें',
      search: 'खोजें',
      filter: 'फिल्टर',
      close: 'बंद करें',
      menu: 'मेनू',
      settings: 'सेटिंग्स',
      profile: 'प्रोफाइल',
      logout: 'लॉगआउट',
      login: 'लॉगिन',
      signup: 'साइन अप',
      welcome: 'स्वागत',
      hello: 'नमस्ते',
      today: 'आज',
      yesterday: 'कल',
      week: 'सप्ताह',
      month: 'महीना',
      year: 'साल'
    },
    navigation: {
      home: 'होम',
      chat: 'AI सहायता',
      mood: 'मूड ट्रैकर',
      survey: 'स्वास्थ्य सर्वे',
      resources: 'संसाधन',
      forum: 'फोरम',
      booking: 'सेशन बुक करें',
      dashboard: 'डैशबोर्ड'
    },
    chat: {
      title: 'AI मानसिक स्वास्थ्य सहायता',
      subtitle: 'आपका भावनात्मक कल्याण के लिए दयालु डिजिटल साथी',
      placeholder: 'अपने मन की बात साझा करें...',
      voicePrompt: 'बोलने के लिए क्लिक करें या अपना संदेश टाइप करें',
      listening: 'सुन रहा हूँ...',
      processing: 'आपकी आवाज़ प्रोसेस कर रहा हूँ...',
      emotionDetected: 'मैं सुन सकता हूँ कि आप {{emotion}} महसूस कर रहे हैं',
      rememberYesterday: 'मुझे याद है कल आपने {{mood}} महसूस किया था। आज कैसा लग रहा है?',
      supportiveResponse: 'मैं इस कठिन समय में आपका साथ देने के लिए यहाँ हूँ।',
      crisis: 'यह एक सहायक AI असिस्टेंट है। संकट की स्थिति में कृपया आपातकालीन सेवाओं से संपर्क करें।'
    },
    accessibility: {
      welcomeMessage: '{{name}} पहुंच सहायक में आपका स्वागत है। मैं वॉयस कमांड के साथ इस मानसिक स्वास्थ्य प्लेटफॉर्म का उपयोग करने में आपकी सहायता करने के लिए यहां हूं।'
    },
    mood: {
      title: 'दैनिक मूड ट्रैकर',
      subtitle: 'अपनी भावनात्मक स्थिति को ट्रैक करें और पैटर्न पहचानें',
      overall: 'समग्र मूड',
      energy: 'ऊर्जा स्तर',
      stress: 'तनाव का स्तर',
      sleep: 'नींद की गुणवत्ता',
      social: 'सामाजिक जुड़ाव',
      notes: 'अतिरिक्त नोट्स',
      saveToday: 'आज का मूड सेव करें',
      howFeeling: 'आज आप कैसा महसूस कर रहे हैं?',
      moodSaved: 'मूड एंट्री सफलतापूर्वक सेव हो गई!'
    },
    voice: {
      startRecording: 'आवाज़ रिकॉर्डिंग शुरू करें',
      stopRecording: 'रिकॉर्डिंग रोकें',
      analyzing: 'आपकी आवाज़ का विश्लेषण कर रहा हूँ...',
      emotionDetected: 'भावना पहचानी गई: {{emotion}}',
      speakNow: 'अब बोलें...',
      voiceNotSupported: 'इस ब्राउज़र में वॉयस रिकग्निशन समर्थित नहीं है',
      microphoneError: 'माइक्रोफोन एक्सेस नहीं कर सके। कृपया अनुमतियाँ जाँचें।'
    }
  },
  te: {
    common: {
      loading: 'లోడ్ అవుతోంది...',
      save: 'సేవ్ చేయండి',
      cancel: 'రద్దు చేయండి',
      continue: 'కొనసాగించండి',
      back: 'వెనుకకు',
      next: 'తరువాత',
      submit: 'సమర్పించండి',
      search: 'వెతకండి',
      filter: 'ఫిల్టర్',
      close: 'మూసివేయండి',
      menu: 'మెను',
      settings: 'సెట్టింగ్‌లు',
      profile: 'ప్రొఫైల్',
      logout: 'లాగ్ అవుట్',
      login: 'లాగిన్',
      signup: 'సైన్ అప్',
      welcome: 'స్వాగతం',
      hello: 'నమస్కారం',
      today: 'ఈరోజు',
      yesterday: 'నిన్న',
      week: 'వారం',
      month: 'నెల',
      year: 'సంవత్సరం'
    },
    navigation: {
      home: 'హోమ్',
      chat: 'AI సహాయం',
      mood: 'మూడ్ ట్రాకర్',
      survey: 'ఆరోగ్య సర్వే',
      resources: 'వనరులు',
      forum: 'ఫోరం',
      booking: 'సెషన్ బుక్ చేయండి',
      dashboard: 'డాష్‌బోర్డ్'
    },
    chat: {
      title: 'AI మానసిక ఆరోగ్య సహాయం',
      subtitle: 'మీ భావోద్వేగ శ్రేయస్సు కోసం దయగల డిజిటల్ తోడుగా',
      placeholder: 'మీ మనసులోని మాట పంచుకోండి...',
      voicePrompt: 'మాట్లాడటానికి క్లిక్ చేయండి లేదా మీ సందేశాన్ని టైప్ చేయండి',
      listening: 'వింటున్నాను...',
      processing: 'మీ వాయిస్‌ను ప్రాసెస్ చేస్తున్నాను...',
      emotionDetected: 'మీరు {{emotion}} అనుభవిస్తున్నారని నేను వినగలుగుతున్నాను',
      rememberYesterday: 'నిన్న మీరు {{mood}} అనుభవించారని నాకు గుర్తుంది। ఈరోజు ఎలా అనిపిస్తోంది?',
      supportiveResponse: 'ఈ కష్ట సమయంలో మీకు మద్దతు ఇవ్వడానికి నేను ఇక్కడ ఉన్నాను।',
      crisis: 'ఇది సహాయక AI అసిస్టెంట్. సంక్షోభ పరిస్థితుల్లో దయచేసి అత్యవసర సేవలను సంప్రదించండి।'
    },
    accessibility: {
      welcomeMessage: '{{name}} యాక్సెసిబిలిటీ అసిస్టెంట్‌కి స్వాగతం। వాయిస్ కమాండ్‌లతో ఈ మానసిక ఆరోగ్య ప్లాట్‌ఫామ్‌ను నావిగేట్ చేయడంలో మరియు ఉపయోగించడంలో మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను।'
    },
    mood: {
      title: 'దైనందిన మూడ్ ట్రాకర్',
      subtitle: 'మీ భావోద్వేగ శ్రేయస్సును ట్రాక్ చేయండి మరియు నమూనాలను గుర్తించండి',
      overall: 'మొత్తం మూడ్',
      energy: 'శక్తి స్థాయి',
      stress: 'ఒత్తిడి స్థాయి',
      sleep: 'నిద్ర నాణ్యత',
      social: 'సామాజిక కనెక్షన్',
      notes: 'అదనపు గమనికలు',
      saveToday: 'నేటి మూడ్‌ను సేవ్ చేయండి',
      howFeeling: 'ఈరోజు మీరు ఎలా అనుభవిస్తున్నారు?',
      moodSaved: 'మూడ్ ఎంట్రీ విజయవంతంగా సేవ్ చేయబడింది!'
    },
    voice: {
      startRecording: 'వాయిస్ రికార్డింగ్ ప్రారంభించండి',
      stopRecording: 'రికార్డింగ్ ఆపండి',
      analyzing: 'మీ వాయిస్‌ను విశ్లేషిస్తున్నాను...',
      emotionDetected: 'భావోద్వేగం గుర్తించబడింది: {{emotion}}',
      speakNow: 'ఇప్పుడు మాట్లాడండి...',
      voiceNotSupported: 'ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ మద్దతు లేదు',
      microphoneError: 'మైక్రోఫోన్‌ను యాక్సెస్ చేయలేకపోయాము. దయచేసి అనుమతులను తనిఖీ చేయండి।'
    }
  },
  bn: {
    common: {
      loading: 'লোড হচ্ছে...',
      save: 'সেভ করুন',
      cancel: 'বাতিল করুন',
      continue: 'চালিয়ে যান',
      back: 'ফিরে যান',
      next: 'পরবর্তী',
      submit: 'জমা দিন',
      search: 'অনুসন্ধান',
      filter: 'ফিল্টার',
      close: 'বন্ধ করুন',
      menu: 'মেনু',
      settings: 'সেটিংস',
      profile: 'প্রোফাইল',
      logout: 'লগআউট',
      login: 'লগইন',
      signup: 'সাইন আপ',
      welcome: 'স্বাগতম',
      hello: 'নমস্কার',
      today: 'আজ',
      yesterday: 'গতকাল',
      week: 'সপ্তাহ',
      month: 'মাস',
      year: 'বছর'
    },
    navigation: {
      home: 'হোম',
      chat: 'AI সহায়তা',
      mood: 'মুড ট্র্যাকার',
      survey: 'স্বাস্থ্য সমীক্ষা',
      resources: 'সম্পদ',
      forum: 'ফোরাম',
      booking: 'সেশন বুক করুন',
      dashboard: 'ড্যাশবোর্ড'
    },
    chat: {
      title: 'AI মানসিক স্বাস্থ্য সহায়তা',
      subtitle: 'আপনার আবেগজনিত সুস্থতার জন্য দয়ালু ডিজিটাল সঙ্গী',
      placeholder: 'আপনার মনের কথা শেয়ার করুন...',
      voicePrompt: 'কথা বলতে ক্লিক করুন বা আপনার বার্তা টাইপ করুন',
      listening: 'শুনছি...',
      processing: 'আপনার কণ্ঠস্বর প্রক্রিয়া করছি...',
      emotionDetected: 'আমি শুনতে পাচ্ছি আপনি {{emotion}} অনুভব করছেন',
      rememberYesterday: 'মনে আছে গতকাল আপনি {{mood}} অনুভব করেছিলেন। আজ কেমন লাগছে?',
      supportiveResponse: 'এই কঠিন সময়ে আপনাকে সাহায্য করতে আমি এখানে আছি।',
      crisis: 'এটি একটি সাহায্যকারী AI সহায়ক। সংকটের সময় দয়া করে জরুরি সেবায় যোগাযোগ করুন।'
    },
    accessibility: {
      welcomeMessage: '{{name}} অ্যাক্সেসিবিলিটি অ্যাসিস্ট্যান্টে স্বাগতম। ভয়েস কমান্ডের সাহায্যে এই মানসিক স্বাস্থ্য প্ল্যাটফর্মটি নেভিগেট এবং ব্যবহার করতে আমি এখানে আছি।'
    },
    mood: {
      title: 'দৈনিক মুড ট্র্যাকার',
      subtitle: 'আপনার আবেগজনিত সুস্থতা ট্র্যাক করুন এবং প্যাটার্ন চিহ্নিত করুন',
      overall: 'সামগ্রিক মুড',
      energy: 'শক্তির স্তর',
      stress: 'চাপের স্তর',
      sleep: 'ঘুমের গুণমান',
      social: 'সামাজিক সংযোগ',
      notes: 'অতিরিক্ত নোট',
      saveToday: 'আজকের মুড সেভ করুন',
      howFeeling: 'আজ আপনি কেমন অনুভব করছেন?',
      moodSaved: 'মুড এন্ট্রি সফলভাবে সংরক্ষিত হয়েছে!'
    },
    voice: {
      startRecording: 'ভয়েস রেকর্ডিং শুরু করুন',
      stopRecording: 'রেকর্ডিং বন্ধ করুন',
      analyzing: 'আপনার কণ্ঠস্বর বিশ্লেষণ করছি...',
      emotionDetected: 'আবেগ সনাক্ত করা হয়েছে: {{emotion}}',
      speakNow: 'এখন বলুন...',
      voiceNotSupported: 'এই ব্রাউজারে ভয়েস রিকগনিশন সমর্থিত নয়',
      microphoneError: 'মাইক্রোফোন অ্যাক্সেস করতে পারেনি। দয়া করে অনুমতি পরীক্ষা করুন।'
    }
  },
  or: {
    common: {
      loading: 'ଲୋଡ୍ ହେଉଛି...',
      save: 'ସେଭ୍ କରନ୍ତୁ',
      cancel: 'ବାତିଲ୍ କରନ୍ତୁ',
      continue: 'ଜାରି ରଖନ୍ତୁ',
      back: 'ପଛକୁ',
      next: 'ପରବର୍ତ୍ତୀ',
      submit: 'ଦାଖଲ କରନ୍ତୁ',
      search: 'ଖୋଜନ୍ତୁ',
      filter: 'ଫିଲ୍ଟର',
      close: 'ବନ୍ଦ କରନ୍ତୁ',
      menu: 'ମେନୁ',
      settings: 'ସେଟିଂସ',
      profile: 'ପ୍ରୋଫାଇଲ୍',
      logout: 'ଲଗଆଉଟ୍',
      login: 'ଲଗଇନ୍',
      signup: 'ସାଇନ୍ ଅପ୍',
      welcome: 'ସ୍ୱାଗତ',
      hello: 'ନମସ୍କାର',
      today: 'ଆଜି',
      yesterday: 'ଗତକାଲି',
      week: 'ସପ୍ତାହ',
      month: 'ମାସ',
      year: 'ବର୍ଷ'
    },
    navigation: {
      home: 'ଘର',
      chat: 'AI ସହାୟତା',
      mood: 'ମୁଡ୍ ଟ୍ରାକର୍',
      survey: 'ସ୍ୱାସ୍ଥ୍ୟ ସର୍ଭେ',
      resources: 'ସମ୍ବଳ',
      forum: 'ଫୋରମ୍',
      booking: 'ସେସନ୍ ବୁକ୍ କରନ୍ତୁ',
      dashboard: 'ଡ୍ୟାସବୋର୍ଡ'
    },
    chat: {
      title: 'AI ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା',
      subtitle: 'ଆପଣଙ୍କ ଭାବନାତ୍ମକ କଲ୍ୟାଣ ପାଇଁ ଦୟାଳୁ ଡିଜିଟାଲ୍ ସାଥୀ',
      placeholder: 'ଆପଣଙ୍କ ମନର କଥା ଶେୟାର କରନ୍ତୁ...',
      voicePrompt: 'କଥା କହିବା ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ କିମ୍ବା ଆପଣଙ୍କ ମେସେଜ୍ ଟାଇପ୍ କରନ୍ତୁ',
      listening: 'ଶୁଣୁଛି...',
      processing: 'ଆପଣଙ୍କ ସ୍ୱର ପ୍ରକ୍ରିୟା କରୁଛି...',
      emotionDetected: 'ମୁଁ ଶୁଣି ପାରୁଛି ଯେ ଆପଣ {{emotion}} ଅନୁଭବ କରୁଛନ୍ତି',
      rememberYesterday: 'ମୋର ମନେ ଅଛି ଗତକାଲି ଆପଣ {{mood}} ଅନୁଭବ କରିଥିଲେ। ଆଜି କେମିତି ଲାଗୁଛି?',
      supportiveResponse: 'ଏହି କଠିନ ସମୟରେ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିବା ପାଇଁ ମୁଁ ଏଠାରେ ଅଛି।',
      crisis: 'ଏହା ଏକ ସହାୟକ AI ସହାୟକ। ସଙ୍କଟ ପରିସ୍ଥିତିରେ ଦୟାକରି ଜରୁରୀକାଳୀନ ସେବାକୁ ଯୋଗାଯୋଗ କରନ୍ତୁ।'
    },
    accessibility: {
      welcomeMessage: '{{name}} ଆକ୍ସେସିବିଲିଟି ଆସିଷ୍ଟାଣ୍ଟରେ ସ୍ୱାଗତ। ଭଏସ କମାଣ୍ଡ ସହିତ ଏହି ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ଲାଟଫର୍ମ ନେଭିଗେଟ ଏବଂ ବ୍ୟବହାର କରିବାରେ ସାହାଯ୍ୟ କରିବାକୁ ମୁଁ ଏଠାରେ ଅଛି।'
    },
    mood: {
      title: 'ଦୈନିକ ମୁଡ୍ ଟ୍ରାକର୍',
      subtitle: 'ଆପଣଙ୍କ ଭାବନାତ୍ମକ କଲ୍ୟାଣ ଟ୍ରାକ କରନ୍ତୁ ଏବଂ ପ୍ୟାଟର୍ନ ଚିହ୍ନଟ କରନ୍ତୁ',
      overall: 'ସାମଗ୍ରିକ ମୁଡ୍',
      energy: 'ଶକ୍ତି ସ୍ତର',
      stress: 'ଚାପ ସ୍ତର',
      sleep: 'ନିଦ୍ରା ଗୁଣବତ୍ତା',
      social: 'ସାମାଜିକ ସଂଯୋଗ',
      notes: 'ଅତିରିକ୍ତ ନୋଟ୍ସ',
      saveToday: 'ଆଜିର ମୁଡ୍ ସେଭ୍ କରନ୍ତୁ',
      howFeeling: 'ଆଜି ଆପଣ କେମିତି ଅନୁଭବ କରୁଛନ୍ତି?',
      moodSaved: 'ମୁଡ୍ ଏଣ୍ଟ୍ରି ସଫଳତାର ସହିତ ସେଭ୍ ହୋଇଛି!'
    },
    voice: {
      startRecording: 'ଭଏସ୍ ରେକର୍ଡିଂ ଆରମ୍ଭ କରନ୍ତୁ',
      stopRecording: 'ରେକର୍ଡିଂ ବନ୍ଦ କରନ୍ତୁ',
      analyzing: 'ଆପଣଙ୍କ ସ୍ୱର ବିଶ୍ଳେଷଣ କରୁଛି...',
      emotionDetected: 'ଭାବନା ଚିହ୍ନଟ ହୋଇଛି: {{emotion}}',
      speakNow: 'ଏବେ କୁହନ୍ତୁ...',
      voiceNotSupported: 'ଏହି ବ୍ରାଉଜରରେ ଭଏସ୍ ରିକଗନିସନ୍ ସପୋର୍ଟ ନାହିଁ',
      microphoneError: 'ମାଇକ୍ରୋଫୋନ୍ ଆକ୍ସେସ୍ କରିପାରିଲା ନାହିଁ। ଦୟାକରି ଅନୁମତି ଯାଞ୍ଚ କରନ୍ତୁ।'
    }
  },
  mr: {
    common: {
      loading: 'लोड होत आहे...',
      save: 'सेव्ह करा',
      cancel: 'रद्द करा',
      continue: 'सुरू ठेवा',
      back: 'मागे',
      next: 'पुढे',
      submit: 'सबमिट करा',
      search: 'शोधा',
      filter: 'फिल्टर',
      close: 'बंद करा',
      menu: 'मेनू',
      settings: 'सेटिंग्ज',
      profile: 'प्रोफाइल',
      logout: 'लॉगआउट',
      login: 'लॉगिन',
      signup: 'साइन अप',
      welcome: 'स्वागत',
      hello: 'नमस्कार',
      today: 'आज',
      yesterday: 'काल',
      week: 'आठवडा',
      month: 'महिना',
      year: 'वर्ष'
    },
    navigation: {
      home: 'होम',
      chat: 'AI सहाय्य',
      mood: 'मूड ट्रॅकर',
      survey: 'आरोग्य सर्वेक्षण',
      resources: 'संसाधने',
      forum: 'फोरम',
      booking: 'सेशन बुक करा',
      dashboard: 'डॅशबोर्ड'
    },
    chat: {
      title: 'AI मानसिक आरोग्य सहाय्य',
      subtitle: 'तुमच्या भावनिक कल्याणासाठी दयाळू डिजिटल साथीदार',
      placeholder: 'तुमच्या मनातील गोष्ट शेअर करा...',
      voicePrompt: 'बोलण्यासाठी क्लिक करा किंवा तुमचा संदेश टाइप करा',
      listening: 'ऐकत आहे...',
      processing: 'तुमचा आवाज प्रोसेस करत आहे...',
      emotionDetected: 'मी ऐकू शकतो की तुम्ही {{emotion}} अनुभवत आहात',
      rememberYesterday: 'मला आठवते काल तुम्ही {{mood}} अनुभवले होते। आज कसे वाटते?',
      supportiveResponse: 'या कठीण काळात तुम्हाला साथ देण्यासाठी मी इथे आहे।',
      crisis: 'हे एक सहाय्यक AI असिस्टंट आहे. संकटाच्या परिस्थितीत कृपया आपत्कालीन सेवांशी संपर्क साधा।'
    },
    accessibility: {
      welcomeMessage: '{{name}} अॅक्सेसिबिलिटी असिस्टंटमध्ये स्वागत आहे। व्हॉइस कमांडसह या मानसिक आरोग्य प्लॅटफॉर्मला नेव्हिगेट आणि वापरण्यात मदत करण्यासाठी मी येथे आहे।'
    },
    mood: {
      title: 'दैनिक मूड ट्रॅकर',
      subtitle: 'तुमच्या भावनिक कल्याणाचा मागोवा घ्या आणि नमुने ओळखा',
      overall: 'एकूण मूड',
      energy: 'ऊर्जा स्तर',
      stress: 'तणावाची पातळी',
      sleep: 'झोपेची गुणवत्ता',
      social: 'सामाजिक कनेक्शन',
      notes: 'अतिरिक्त नोट्स',
      saveToday: 'आजचा मूड सेव्ह करा',
      howFeeling: 'आज तुम्हाला कसे वाटते?',
      moodSaved: 'मूड एंट्री यशस्वीरित्या सेव्ह झाली!'
    },
    voice: {
      startRecording: 'व्हॉइस रेकॉर्डिंग सुरू करा',
      stopRecording: 'रेकॉर्डिंग थांबवा',
      analyzing: 'तुमचा आवाज विश्लेषित करत आहे...',
      emotionDetected: 'भावना शोधली गेली: {{emotion}}',
      speakNow: 'आता बोला...',
      voiceNotSupported: 'या ब्राउझरमध्ये व्हॉइस रिकग्निशन समर्थित नाही',
      microphoneError: 'मायक्रोफोन ऍक्सेस करू शकत नाही. कृपया परवानग्या तपासा.'
    }
  },
  ta: {
    common: {
      loading: 'ஏற்றப்படுகிறது...',
      save: 'சேமி',
      cancel: 'ரத்து செய்',
      continue: 'தொடர்',
      back: 'பின்னால்',
      next: 'அடுத்து',
      submit: 'சமர்ப்பி',
      search: 'தேடு',
      filter: 'வடிகட்டு',
      close: 'மூடு',
      menu: 'மெனு',
      settings: 'அமைப்புகள்',
      profile: 'சுயவிவரம்',
      logout: 'வெளியேறு',
      login: 'உள்நுழை',
      signup: 'பதிவு செய்',
      welcome: 'வரவேற்கிறோம்',
      hello: 'வணக்கம்',
      today: 'இன்று',
      yesterday: 'நேற்று',
      week: 'வாரம்',
      month: 'மாதம்',
      year: 'வருடம்'
    },
    navigation: {
      home: 'முகப்பு',
      chat: 'AI உதவி',
      mood: 'மூட் டிராக்கர்',
      survey: 'உடல்நலம் சர்வே',
      resources: 'வளங்கள்',
      forum: 'மன்றம்',
      booking: 'அமர்வு பதிவு',
      dashboard: 'டாஷ்போர்டு'
    },
    chat: {
      title: 'AI மனநல உதவி',
      subtitle: 'உங்கள் உணர்ச்சி நலனுக்கான கருணையுள்ள டிஜிட்டல் துணை',
      placeholder: 'உங்கள் மனதில் உள்ளதை பகிர்ந்து கொள்ளுங்கள்...',
      voicePrompt: 'பேச கிளிக் செய்யுங்கள் அல்லது உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்',
      listening: 'கேட்கிறேன்...',
      processing: 'உங்கள் குரலை செயலாக்குகிறேன்...',
      emotionDetected: 'நீங்கள் {{emotion}} உணர்கிறீர்கள் என்று என்னால் கேட்க முடிகிறது',
      rememberYesterday: 'நேற்று நீங்கள் {{mood}} உணர்ந்தீர்கள் என்று நினைவிருக்கிறது। இன்று எப்படி உணர்கிறீர்கள்?',
      supportiveResponse: 'இந்த கடினமான நேரத்தில் உங்களுக்கு ஆதரவளிக்க நான் இங்கே இருக்கிறேன்।',
      crisis: 'இது ஒரு ஆதரவு AI உதவியாளர். நெருக்கடி சூழ்நிலைகளில் தயவுசெய்து அவசர சேவைகளை தொடர்பு கொள்ளுங்கள்।'
    },
    accessibility: {
      welcomeMessage: '{{name}} அணுகல்தன்மை உதவியாளரில் உங்களை வரவேற்கிறோம். குரல் கட்டளைகளுடன் இந்த மனநல தளத்தை நேவிகேட் செய்து பயன்படுத்த உதவ நான் இங்கே இருக்கிறேன்।'
    },
    mood: {
      title: 'தினசரி மூட் டிராக்கர்',
      subtitle: 'உங்கள் உணர்ச்சி நலனை கண்காணித்து வடிவங்களை அடையாளம் காணுங்கள்',
      overall: 'ஒட்டுமொத்த மூட்',
      energy: 'ஆற்றல் நிலை',
      stress: 'மன அழுத்த நிலை',
      sleep: 'தூக்கத்தின் தரம்',
      social: 'சமூக தொடர்பு',
      notes: 'கூடுதல் குறிப்புகள்',
      saveToday: 'இன்றைய மூட்டை சேமிக்கவும்',
      howFeeling: 'இன்று எப்படி உணர்கிறீர்கள்?',
      moodSaved: 'மூட் நுழைவு வெற்றிகரமாக சேமிக்கப்பட்டது!'
    },
    voice: {
      startRecording: 'குரல் பதிவைத் தொடங்கு',
      stopRecording: 'பதிவை நிறுத்து',
      analyzing: 'உங்கள் குரலை பகுப்பாய்வு செய்கிறேன்...',
      emotionDetected: 'உணர்ச்சி கண்டறியப்பட்டது: {{emotion}}',
      speakNow: 'இப்போது பேசுங்கள்...',
      voiceNotSupported: 'இந்த உலாவியில் குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை',
      microphoneError: 'மைக்ரோஃபோனை அணுக முடியவில்லை. அனுமதிகளைச் சரிபார்க்கவும்.'
    }
  },
  ml: {
    common: {
      loading: 'ലോഡ് ചെയ്യുന്നു...',
      save: 'സേവ് ചെയ്യുക',
      cancel: 'റദ്ദാക്കുക',
      continue: 'തുടരുക',
      back: 'പിന്നോട്ട്',
      next: 'അടുത്തത്',
      submit: 'സമർപ്പിക്കുക',
      search: 'തിരയുക',
      filter: 'ഫിൽട്ടർ',
      close: 'അടയ്ക്കുക',
      menu: 'മെനു',
      settings: 'ക്രമീകരണങ്ങൾ',
      profile: 'പ്രൊഫൈൽ',
      logout: 'ലോഗൗട്ട്',
      login: 'ലോഗിൻ',
      signup: 'സൈൻ അപ്പ്',
      welcome: 'സ്വാഗതം',
      hello: 'നമസ്കാരം',
      today: 'ഇന്ന്',
      yesterday: 'ഇന്നലെ',
      week: 'ആഴ്ച',
      month: 'മാസം',
      year: 'വർഷം'
    },
    navigation: {
      home: 'ഹോം',
      chat: 'AI സഹായം',
      mood: 'മൂഡ് ട്രാക്കർ',
      survey: 'ആരോഗ്യ സർവേ',
      resources: 'വിഭവങ്ങൾ',
      forum: 'ഫോറം',
      booking: 'സെഷൻ ബുക്ക് ചെയ്യുക',
      dashboard: 'ഡാഷ്ബോർഡ്'
    },
    chat: {
      title: 'AI മാനസികാരോഗ്യ സഹായം',
      subtitle: 'നിങ്ങളുടെ വൈകാരിക ക്ഷേമത്തിനുള്ള കരുണാപൂർവമായ ഡിജിറ്റൽ കൂട്ടാളി',
      placeholder: 'നിങ്ങളുടെ മനസ്സിലുള്ളത് പങ്കിടുക...',
      voicePrompt: 'സംസാരിക്കാൻ ക്ലിക്ക് ചെയ്യുക അല്ലെങ്കിൽ നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക',
      listening: 'കേൾക്കുന്നു...',
      processing: 'നിങ്ങളുടെ ശബ്ദം പ്രോസസ് ചെയ്യുന്നു...',
      emotionDetected: 'നിങ്ങൾ {{emotion}} അനുഭവിക്കുന്നുണ്ടെന്ന് എനിക്ക് കേൾക്കാൻ കഴിയുന്നു',
      rememberYesterday: 'ഇന്നലെ നിങ്ങൾ {{mood}} അനുഭവിച്ചത് എനിക്ക് ഓർമയുണ്ട്. ഇന്ന് എങ്ങനെ തോന്നുന്നു?',
      supportiveResponse: 'ഈ പ്രയാസകരമായ സമയത്ത് നിങ്ങളെ പിന്തുണയ്ക്കാൻ ഞാൻ ഇവിടെയുണ്ട്।',
      crisis: 'ഇത് ഒരു പിന്തുണാ AI അസിസ്റ്റന്റാണ്. പ്രതിസന്ധി സാഹചര്യങ്ങളിൽ ദയവായി അടിയന്തര സേവനങ്ങളെ ബന്ധപ്പെടുക।'
    },
    accessibility: {
      welcomeMessage: '{{name}} ആക്സസിബിലിറ്റി അസിസ്റ്റന്റിലേക്ക് സ്വാഗതം. വോയ്‌സ് കമാൻഡുകൾ ഉപയോഗിച്ച് ഈ മാനസികാരോഗ്യ പ്ലാറ്റ്‌ഫോം നാവിഗേറ്റ് ചെയ്യാനും ഉപയോഗിക്കാനും സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്.'
    },
    mood: {
      title: 'ദൈനംദിന മൂഡ് ട്രാക്കർ',
      subtitle: 'നിങ്ങളുടെ വൈകാരിക ക്ഷേമം ട്രാക്ക് ചെയ്യുകയും പാറ്റേണുകൾ തിരിച്ചറിയുകയും ചെയ്യുക',
      overall: 'മൊത്തത്തിലുള്ള മൂഡ്',
      energy: 'ഊർജ്ജത്തിന്റെ നില',
      stress: 'സമ്മർദ്ദത്തിന്റെ നില',
      sleep: 'ഉറക്കത്തിന്റെ ഗുണനിലവാരം',
      social: 'സാമൂഹിക ബന്ധം',
      notes: 'അധിക കുറിപ്പുകൾ',
      saveToday: 'ഇന്നത്തെ മൂഡ് സേവ് ചെയ്യുക',
      howFeeling: 'ഇന്ന് നിങ്ങൾക്ക് എങ്ങനെ തോന്നുന്നു?',
      moodSaved: 'മൂഡ് എൻട്രി വിജയകരമായി സേവ് ചെയ്തു!'
    },
    voice: {
      startRecording: 'വോയ്‌സ് റെക്കോർഡിംഗ് ആരംഭിക്കുക',
      stopRecording: 'റെക്കോർഡിംഗ് നിർത്തുക',
      analyzing: 'നിങ്ങളുടെ ശബ്ദം വിശകലനം ചെയ്യുന്നു...',
      emotionDetected: 'വികാരം കണ്ടെത്തി: {{emotion}}',
      speakNow: 'ഇപ്പോൾ സംസാരിക്കുക...',
      voiceNotSupported: 'ഈ ബ്രൗസറിൽ വോയ്‌സ് റെക്കഗ്നിഷൻ പിന്തുണയ്ക്കുന്നില്ല',
      microphoneError: 'മൈക്രോഫോൺ ആക്സസ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി അനുമതികൾ പരിശോധിക്കുക.'
    }
  },
  as: {
    common: {
      loading: 'লোড হৈ আছে...',
      save: 'ছেভ কৰক',
      cancel: 'বাতিল কৰক',
      continue: 'অব্যাহত ৰাখক',
      back: 'পিছলৈ',
      next: 'পৰৱৰ্তী',
      submit: 'দাখিল কৰক',
      search: 'বিচাৰক',
      filter: 'ফিল্টাৰ',
      close: 'বন্ধ কৰক',
      menu: 'মেনু',
      settings: 'ছেটিংছ',
      profile: 'প্ৰ\'ফাইল',
      logout: 'লগআউট',
      login: 'লগইন',
      signup: 'ছাইন আপ',
      welcome: 'স্বাগতম',
      hello: 'নমস্কাৰ',
      today: 'আজি',
      yesterday: 'কালি',
      week: 'সপ্তাহ',
      month: 'মাহ',
      year: 'বছৰ'
    },
    navigation: {
      home: 'ঘৰ',
      chat: 'AI সহায়',
      mood: 'মুড ট্ৰেকাৰ',
      survey: 'স্বাস্থ্য সৰ্ভে',
      resources: 'সম্পদ',
      forum: 'ফ\'ৰাম',
      booking: 'ছেশ্যন বুক কৰক',
      dashboard: 'ডেশ্ববৰ্ড'
    },
    chat: {
      title: 'AI মানসিক স্বাস্থ্য সহায়',
      subtitle: 'আপোনাৰ আৱেগিক কল্যাণৰ বাবে দয়ালু ডিজিটেল সংগী',
      placeholder: 'আপোনাৰ মনৰ কথা শ্বেয়াৰ কৰক...',
      voicePrompt: 'কথা ক\'বলৈ ক্লিক কৰক বা আপোনাৰ বাৰ্তা টাইপ কৰক',
      listening: 'শুনি আছোঁ...',
      processing: 'আপোনাৰ কণ্ঠস্বৰ প্ৰ\'চেছ কৰি আছোঁ...',
      emotionDetected: 'মই শুনিব পাৰিছোঁ যে আপুনি {{emotion}} অনুভৱ কৰি আছে',
      rememberYesterday: 'মোৰ মনত আছে কালি আপুনি {{mood}} অনুভৱ কৰিছিল। আজি কেনে লাগিছে?',
      supportiveResponse: 'এই কঠিন সময়ত আপোনাক সহায় কৰিবলৈ মই ইয়াত আছোঁ।',
      crisis: 'এইটো এটা সহায়ক AI সহায়ক। সংকটৰ পৰিস্থিতিত অনুগ্ৰহ কৰি জৰুৰীকালীন সেৱাৰ সৈতে যোগাযোগ কৰক।'
    },
    accessibility: {
      welcomeMessage: '{{name}} অভিগম্যতা সহায়কলৈ স্বাগতম। ভয়েচ কমান্ডৰ সৈতে এই মানসিক স্বাস্থ্য প্লেটফৰ্ম নেভিগেট আৰু ব্যৱহাৰ কৰাত সহায় কৰিবলৈ মই ইয়াত আছোঁ।'
    },
    mood: {
      title: 'দৈনিক মুড ট্ৰেকাৰ',
      subtitle: 'আপোনাৰ আৱেগিক কল্যাণ ট্ৰেক কৰক আৰু আৰ্হি চিনাক্ত কৰক',
      overall: 'সামগ্ৰিক মুড',
      energy: 'শক্তিৰ স্তৰ',
      stress: 'মানসিক চাপৰ স্তৰ',
      sleep: 'নিদ্ৰাৰ গুণগত মান',
      social: 'সামাজিক সংযোগ',
      notes: 'অতিৰিক্ত টোকা',
      saveToday: 'আজিৰ মুড ছেভ কৰক',
      howFeeling: 'আজি আপোনাৰ কেনে লাগিছে?',
      moodSaved: 'মুড এণ্ট্ৰি সফলতাৰে ছেভ হ\'ল!'
    },
    voice: {
      startRecording: 'ভয়েচ ৰেকৰ্ডিং আৰম্ভ কৰক',
      stopRecording: 'ৰেকৰ্ডিং বন্ধ কৰক',
      analyzing: 'আপোনাৰ কণ্ঠস্বৰ বিশ্লেষণ কৰি আছোঁ...',
      emotionDetected: 'আৱেগ চিনাক্ত কৰা হৈছে: {{emotion}}',
      speakNow: 'এতিয়া ক\'ওক...',
      voiceNotSupported: 'এই ব্ৰাউজাৰত ভয়েচ ৰিকগনিচন সমৰ্থিত নহয়',
      microphoneError: 'মাইক্ৰ\'ফোন অভিগম কৰিব পৰা নগ\'ল। অনুগ্ৰহ কৰি অনুমতিসমূহ পৰীক্ষা কৰক।'
    }
  },
  pa: {
    common: {
      loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
      save: 'ਸੇਵ ਕਰੋ',
      cancel: 'ਰੱਦ ਕਰੋ',
      continue: 'ਜਾਰੀ ਰੱਖੋ',
      back: 'ਵਾਪਸ',
      next: 'ਅਗਲਾ',
      submit: 'ਜਮ੍ਹਾ ਕਰੋ',
      search: 'ਖੋਜੋ',
      filter: 'ਫਿਲਟਰ',
      close: 'ਬੰਦ ਕਰੋ',
      menu: 'ਮੀਨੂ',
      settings: 'ਸੈਟਿੰਗਾਂ',
      profile: 'ਪ੍ਰੋਫਾਈਲ',
      logout: 'ਲੌਗਆਊਟ',
      login: 'ਲੌਗਇਨ',
      signup: 'ਸਾਈਨ ਅੱਪ',
      welcome: 'ਸਵਾਗਤ',
      hello: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
      today: 'ਅੱਜ',
      yesterday: 'ਕੱਲ੍ਹ',
      week: 'ਹਫ਼ਤਾ',
      month: 'ਮਹੀਨਾ',
      year: 'ਸਾਲ'
    },
    navigation: {
      home: 'ਘਰ',
      chat: 'AI ਮਦਦ',
      mood: 'ਮੂਡ ਟਰੈਕਰ',
      survey: 'ਸਿਹਤ ਸਰਵੇ',
      resources: 'ਸਰੋਤ',
      forum: 'ਫੋਰਮ',
      booking: 'ਸੈਸ਼ਨ ਬੁੱਕ ਕਰੋ',
      dashboard: 'ਡੈਸ਼ਬੋਰਡ'
    },
    chat: {
      title: 'AI ਮਾਨਸਿਕ ਸਿਹਤ ਮਦਦ',
      subtitle: 'ਤੁਹਾਡੀ ਭਾਵਨਾਤਮਕ ਭਲਾਈ ਲਈ ਦਿਆਲੂ ਡਿਜੀਟਲ ਸਾਥੀ',
      placeholder: 'ਆਪਣੇ ਮਨ ਦੀ ਗੱਲ ਸਾਂਝੀ ਕਰੋ...',
      voicePrompt: 'ਬੋਲਣ ਲਈ ਕਲਿੱਕ ਕਰੋ ਜਾਂ ਆਪਣਾ ਸੰਦੇਸ਼ ਟਾਈਪ ਕਰੋ',
      listening: 'ਸੁਣ ਰਿਹਾ ਹਾਂ...',
      processing: 'ਤੁਹਾਡੀ ਆਵਾਜ਼ ਪ੍ਰੋਸੈਸ ਕਰ ਰਿਹਾ ਹਾਂ...',
      emotionDetected: 'ਮੈਂ ਸੁਣ ਸਕਦਾ ਹਾਂ ਕਿ ਤੁਸੀਂ {{emotion}} ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ',
      rememberYesterday: 'ਮੈਨੂੰ ਯਾਦ ਹੈ ਕਿ ਕੱਲ੍ਹ ਤੁਸੀਂ {{mood}} ਮਹਿਸੂਸ ਕੀਤਾ ਸੀ। ਅੱਜ ਕਿਵੇਂ ਲੱਗ ਰਿਹਾ ਹੈ?',
      supportiveResponse: 'ਇਸ ਮੁਸ਼ਕਿਲ ਸਮੇਂ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਮੈਂ ਇੱਥੇ ਹਾਂ।',
      crisis: 'ਇਹ ਇੱਕ ਸਹਾਇਕ AI ਸਹਾਇਕ ਹੈ। ਸੰਕਟ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਕਿਰਪਾ ਕਰਕੇ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।'
    },
    accessibility: {
      welcomeMessage: '{{name}} ਪਹੁੰਚਯੋਗਤਾ ਸਹਾਇਕ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਵਾਇਸ ਕਮਾਂਡਾਂ ਨਾਲ ਇਸ ਮਾਨਸਿਕ ਸਿਹਤ ਪਲੇਟਫਾਰਮ ਨੂੰ ਨੇਵਿਗੇਟ ਅਤੇ ਵਰਤਣ ਵਿੱਚ ਮਦਦ ਕਰਨ ਲਈ ਮੈਂ ਇੱਥੇ ਹਾਂ।'
    },
    mood: {
      title: 'ਰੋਜ਼ਾਨਾ ਮੂਡ ਟਰੈਕਰ',
      subtitle: 'ਆਪਣੀ ਭਾਵਨਾਤਮਕ ਭਲਾਈ ਨੂੰ ਟਰੈਕ ਕਰੋ ਅਤੇ ਪੈਟਰਨ ਦੀ ਪਛਾਣ ਕਰੋ',
      overall: 'ਸਮੁੱਚਾ ਮੂਡ',
      energy: 'ਊਰਜਾ ਪੱਧਰ',
      stress: 'ਤਣਾਅ ਦਾ ਪੱਧਰ',
      sleep: 'ਨੀਂਦ ਦੀ ਗੁਣਵੱਤਾ',
      social: 'ਸਮਾਜਿਕ ਸੰਪਰਕ',
      notes: 'ਵਾਧੂ ਨੋਟਸ',
      saveToday: 'ਅੱਜ ਦਾ ਮੂਡ ਸੇਵ ਕਰੋ',
      howFeeling: 'ਅੱਜ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?',
      moodSaved: 'ਮੂਡ ਐਂਟਰੀ ਸਫਲਤਾਪੂਰਵਕ ਸੇਵ ਹੋ ਗਈ!'
    },
    voice: {
      startRecording: 'ਵਾਇਸ ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰੋ',
      stopRecording: 'ਰਿਕਾਰਡਿੰਗ ਬੰਦ ਕਰੋ',
      analyzing: 'ਤੁਹਾਡੀ ਆਵਾਜ਼ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹਾਂ...',
      emotionDetected: 'ਭਾਵਨਾ ਦਾ ਪਤਾ ਲਗਾਇਆ ਗਿਆ: {{emotion}}',
      speakNow: 'ਹੁਣ ਬੋਲੋ...',
      voiceNotSupported: 'ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਵਾਇਸ ਰਿਕਗਨਿਸ਼ਨ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ',
      microphoneError: 'ਮਾਈਕ੍ਰੋਫੋਨ ਤੱਕ ਪਹੁੰਚ ਨਹੀਂ ਹੋ ਸਕੀ। ਕਿਰਪਾ ਕਰਕੇ ਇਜਾਜ਼ਤਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।'
    }
  },
  gu: {
    common: {
      loading: 'લોડ થઈ રહ્યું છે...',
      save: 'સેવ કરો',
      cancel: 'રદ કરો',
      continue: 'ચાલુ રાખો',
      back: 'પાછળ',
      next: 'આગળ',
      submit: 'સબમિટ કરો',
      search: 'શોધો',
      filter: 'ફિલ્ટર',
      close: 'બંધ કરો',
      menu: 'મેનુ',
      settings: 'સેટિંગ્સ',
      profile: 'પ્રોફાઇલ',
      logout: 'લોગઆઉટ',
      login: 'લોગિન',
      signup: 'સાઇન અપ',
      welcome: 'સ્વાગત',
      hello: 'નમસ્તે',
      today: 'આજે',
      yesterday: 'ગઈકાલે',
      week: 'અઠવાડિયું',
      month: 'મહિનો',
      year: 'વર્ષ'
    },
    navigation: {
      home: 'હોમ',
      chat: 'AI સહાય',
      mood: 'મૂડ ટ્રેકર',
      survey: 'આરોગ્ય સર્વે',
      resources: 'સંસાધનો',
      forum: 'ફોરમ',
      booking: 'સેશન બુક કરો',
      dashboard: 'ડેશબોર્ડ'
    },
    chat: {
      title: 'AI માનસિક આરોગ્য સહાય',
      subtitle: 'તમારી ભાવનાત્મક સુખાકારી માટે દયાળુ ડિજિટલ સાથી',
      placeholder: 'તમારા મનની વાત શેર કરો...',
      voicePrompt: 'બોલવા માટે ક્લિક કરો અથવા તમારો સંદેશ ટાઇપ કરો',
      listening: 'સાંભળી રહ્યા છીએ...',
      processing: 'તમારો અવાજ પ્રોસેસ કરી રહ્યા છીએ...',
      emotionDetected: 'હું સાંભળી શકું છું કે તમે {{emotion}} અનુભવી રહ્યા છો',
      rememberYesterday: 'મને યાદ છે કે ગઈકાલે તમે {{mood}} અનુભવ્યું હતું. આજે કેવું લાગે છે?',
      supportiveResponse: 'આ મુશ્કેલ સમયમાં તમારી મદદ કરવા માટે હું અહીં છું।',
      crisis: 'આ એક સહાયક AI સહાયક છે. સંકટની પરિસ્થિતિમાં કૃપા કરીને કટોકટી સેવાઓનો સંપર્ક કરો।'
    },
    accessibility: {
      welcomeMessage: '{{name}} ઍક્સેસિબિલિટી આસિસ્ટન્ટમાં તમારું સ્વાગત છે. વૉઇસ કમાન્ડ્સ સાથે આ માનસિક આરોગ્ય પ્લેટફોર્મને નેવિગેટ અને ઉપયોગ કરવામાં મદદ કરવા માટે હું અહીં છું.'
    },
    mood: {
      title: 'દૈનિક મૂડ ટ્રેકર',
      subtitle: 'તમારી ભાવનાત્મક સુખાકારીને ટ્રેક કરો અને પેટર્નની ઓળખ કરો',
      overall: 'એકંદર મૂડ',
      energy: 'ઊર્જા સ્તર',
      stress: 'તણાવનું સ્તર',
      sleep: 'ઊંઘની ગુણવત્તા',
      social: 'સામાજિક જોડાણ',
      notes: 'વધારાની નોંધો',
      saveToday: 'આજનો મૂડ સેવ કરો',
      howFeeling: 'આજે તમને કેવું લાગે છે?',
      moodSaved: 'મૂડ એન્ટ્રી સફળતાપૂર્વક સેવ થઈ!'
    },
    voice: {
      startRecording: 'વૉઇસ રેકોર્ડિંગ શરૂ કરો',
      stopRecording: 'રેકોર્ડિંગ બંધ કરો',
      analyzing: 'તમારા અવાજનું વિશ્લેષણ કરી રહ્યા છીએ...',
      emotionDetected: 'લાગણી શોધી કાઢી: {{emotion}}',
      speakNow: 'હવે બોલો...',
      voiceNotSupported: 'આ બ્રાઉઝરમાં વૉઇસ રિકગ્નિશન સપોર્ટેડ નથી',
      microphoneError: 'માઇક્રોફોન એક્સેસ કરી શકાતો નથી. કૃપા કરીને પરમિશન્સ ચેક કરો.'
    }
  },
  kn: {
    common: {
      loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
      save: 'ಸೇವ್ ಮಾಡಿ',
      cancel: 'ರದ್ದುಗೊಳಿಸಿ',
      continue: 'ಮುಂದುವರಿಸಿ',
      back: 'ಹಿಂದೆ',
      next: 'ಮುಂದೆ',
      submit: 'ಸಲ್ಲಿಸಿ',
      search: 'ಹುಡುಕಿ',
      filter: 'ಫಿಲ್ಟರ್',
      close: 'ಮುಚ್ಚಿ',
      menu: 'ಮೆನು',
      settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
      profile: 'ಪ್ರೊಫೈಲ್',
      logout: 'ಲಾಗ್‌ಔಟ್',
      login: 'ಲಾಗಿನ್',
      signup: 'ಸೈನ್ ಅಪ್',
      welcome: 'ಸ್ವಾಗತ',
      hello: 'ನಮಸ್ಕಾರ',
      today: 'ಇಂದು',
      yesterday: 'ನಿನ್ನೆ',
      week: 'ವಾರ',
      month: 'ತಿಂಗಳು',
      year: 'ವರ್ಷ'
    },
    navigation: {
      home: 'ಮನೆ',
      chat: 'AI ಸಹಾಯ',
      mood: 'ಮೂಡ್ ಟ್ರ್ಯಾಕರ್',
      survey: 'ಆರೋಗ್ಯ ಸಮೀಕ್ಷೆ',
      resources: 'ಸಂಪನ್ಮೂಲಗಳು',
      forum: 'ಫೋರಂ',
      booking: 'ಸೆಷನ್ ಬುಕ್ ಮಾಡಿ',
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್'
    },
    chat: {
      title: 'AI ಮಾನಸಿಕ ಆರೋಗ್ಯ ಸಹಾಯ',
      subtitle: 'ನಿಮ್ಮ ಭಾವನಾತ್ಮಕ ಯೋಗಕ್ಷೇಮಕ್ಕಾಗಿ ದಯೆಯ ಡಿಜಿಟಲ್ ಒಡನಾಡಿ',
      placeholder: 'ನಿಮ್ಮ ಮನಸ್ಸಿನ ಮಾತನ್ನು ಹಂಚಿಕೊಳ್ಳಿ...',
      voicePrompt: 'ಮಾತನಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ',
      listening: 'ಆಲಿಸುತ್ತಿದ್ದೇನೆ...',
      processing: 'ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತಿದ್ದೇನೆ...',
      emotionDetected: 'ನೀವು {{emotion}} ಅನುಭವಿಸುತ್ತಿದ್ದೀರಿ ಎಂದು ನಾನು ಕೇಳಬಲ್ಲೆ',
      rememberYesterday: 'ನಿನ್ನೆ ನೀವು {{mood}} ಅನುಭವಿಸಿದ್ದಿರಿ ಎಂದು ನನಗೆ ನೆನಪಿದೆ. ಇಂದು ಹೇಗೆ ಅನಿಸುತ್ತಿದೆ?',
      supportiveResponse: 'ಈ ಕಷ್ಟದ ಸಮಯದಲ್ಲಿ ನಿಮಗೆ ಬೆಂಬಲ ನೀಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ।',
      crisis: 'ಇದು ಒಂದು ಸಹಾಯಕ AI ಸಹಾಯಕ. ಬಿಕ್ಕಟ್ಟಿನ ಸಂದರ್ಭಗಳಲ್ಲಿ ದಯವಿಟ್ಟು ತುರ್ತು ಸೇವೆಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ।'
    },
    accessibility: {
      welcomeMessage: '{{name}} ಪ್ರವೇಶಸಾಧ್ಯತೆ ಸಹಾಯಕನಿಗೆ ಸ್ವಾಗತ. ವಾಯ್ಸ್ ಕಮಾಂಡ್‌ಗಳೊಂದಿಗೆ ಈ ಮಾನಸಿಕ ಆರೋಗ್ಯ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಅನ್ನು ನ್ಯಾವಿಗೇಟ್ ಮಾಡಲು ಮತ್ತು ಬಳಸಲು ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.'
    },
    mood: {
      title: 'ದೈನಂದಿನ ಮೂಡ್ ಟ್ರ್ಯಾಕರ್',
      subtitle: 'ನಿಮ್ಮ ಭಾವನಾತ್ಮಕ ಯೋಗಕ್ಷೇಮವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಮಾದರಿಗಳನ್ನು ಗುರುತಿಸಿ',
      overall: 'ಒಟ್ಟಾರೆ ಮೂಡ್',
      energy: 'ಶಕ್ತಿಯ ಮಟ್ಟ',
      stress: 'ಒತ್ತಡದ ಮಟ್ಟ',
      sleep: 'ನಿದ್ರೆಯ ಗುಣಮಟ್ಟ',
      social: 'ಸಾಮಾಜಿಕ ಸಂಪರ್ಕ',
      notes: 'ಹೆಚ್ಚುವರಿ ಟಿಪ್ಪಣಿಗಳು',
      saveToday: 'ಇಂದಿನ ಮೂಡ್ ಸೇವ್ ಮಾಡಿ',
      howFeeling: 'ಇಂದು ನೀವು ಹೇಗೆ ಅನುಭವಿಸುತ್ತಿದ್ದೀರಿ?',
      moodSaved: 'ಮೂಡ್ ಎಂಟ್ರಿ ಯಶಸ್ವಿಯಾಗಿ ಸೇವ್ ಆಗಿದೆ!'
    },
    voice: {
      startRecording: 'ವಾಯ್ಸ್ ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
      stopRecording: 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ',
      analyzing: 'ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದ್ದೇನೆ...',
      emotionDetected: 'ಭಾವನೆ ಪತ್ತೆಯಾಗಿದೆ: {{emotion}}',
      speakNow: 'ಈಗ ಮಾತನಾಡಿ...',
      voiceNotSupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ವಾಯ್ಸ್ ರೆಕಗ್ನಿಷನ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ',
      microphoneError: 'ಮೈಕ್ರೊಫೋನ್ ಪ್ರವೇಶಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಅನುಮತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.'
    }
  },
  es: {
    common: {
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      continue: 'Continuar',
      back: 'Atrás',
      next: 'Siguiente',
      submit: 'Enviar',
      search: 'Buscar',
      filter: 'Filtrar',
      close: 'Cerrar',
      menu: 'Menú',
      settings: 'Configuración',
      profile: 'Perfil',
      logout: 'Cerrar sesión',
      login: 'Iniciar sesión',
      signup: 'Registrarse',
      welcome: 'Bienvenido',
      hello: 'Hola',
      today: 'Hoy',
      yesterday: 'Ayer',
      week: 'Semana',
      month: 'Mes',
      year: 'Año'
    },
    navigation: {
      home: 'Inicio',
      chat: 'Apoyo IA',
      mood: 'Monitor de Estado',
      survey: 'Encuesta de Bienestar',
      resources: 'Recursos',
      forum: 'Foro',
      booking: 'Reservar Sesión',
      dashboard: 'Panel'
    },
    chat: {
      title: 'Apoyo de Salud Mental IA',
      subtitle: 'Tu compañero digital compasivo para el bienestar emocional',
      placeholder: 'Comparte lo que tienes en mente...',
      voicePrompt: 'Haz clic para hablar o escribe tu mensaje',
      listening: 'Escuchando...',
      processing: 'Procesando tu voz...',
      emotionDetected: 'Puedo escuchar que te sientes {{emotion}}',
      rememberYesterday: 'Recuerdo que ayer te sentías {{mood}}. ¿Cómo estás hoy?',
      supportiveResponse: 'Estoy aquí para apoyarte en esto.',
      crisis: 'Este es un asistente de IA de apoyo. Para situaciones de crisis, contacta los servicios de emergencia.'
    },
    accessibility: {
      welcomeMessage: 'Bienvenido al Asistente de Accesibilidad {{name}}. Estoy aquí para ayudarte a navegar y usar esta plataforma de salud mental con comandos de voz.'
    },
    mood: {
      title: 'Monitor Diario de Estado de Ánimo',
      subtitle: 'Rastrea tu bienestar emocional e identifica patrones',
      overall: 'Estado General',
      energy: 'Nivel de Energía',
      stress: 'Nivel de Estrés',
      sleep: 'Calidad del Sueño',
      social: 'Conexión Social',
      notes: 'Notas Adicionales',
      saveToday: 'Guardar Estado de Hoy',
      howFeeling: '¿Cómo te sientes hoy?',
      moodSaved: '¡Entrada de estado guardada exitosamente!'
    },
    voice: {
      startRecording: 'Iniciar Grabación de Voz',
      stopRecording: 'Detener Grabación',
      analyzing: 'Analizando tu voz...',
      emotionDetected: 'Emoción detectada: {{emotion}}',
      speakNow: 'Habla ahora...',
      voiceNotSupported: 'Reconocimiento de voz no compatible en este navegador',
      microphoneError: 'No se pudo acceder al micrófono. Verifica los permisos.'
    }
  },
  fr: {
    common: {
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      continue: 'Continuer',
      back: 'Retour',
      next: 'Suivant',
      submit: 'Soumettre',
      search: 'Rechercher',
      filter: 'Filtrer',
      close: 'Fermer',
      menu: 'Menu',
      settings: 'Paramètres',
      profile: 'Profil',
      logout: 'Déconnexion',
      login: 'Connexion',
      signup: 'S\'inscrire',
      welcome: 'Bienvenue',
      hello: 'Bonjour',
      today: 'Aujourd\'hui',
      yesterday: 'Hier',
      week: 'Semaine',
      month: 'Mois',
      year: 'Année'
    },
    navigation: {
      home: 'Accueil',
      chat: 'Support IA',
      mood: 'Suivi d\'Humeur',
      survey: 'Enquête Bien-être',
      resources: 'Ressources',
      forum: 'Forum',
      booking: 'Réserver Session',
      dashboard: 'Tableau de Bord'
    },
    chat: {
      title: 'Support de Santé Mentale IA',
      subtitle: 'Votre compagnon numérique compatissant pour le bien-être émotionnel',
      placeholder: 'Partagez ce que vous avez en tête...',
      voicePrompt: 'Cliquez pour parler ou tapez votre message',
      listening: 'Écoute...',
      processing: 'Traitement de votre voix...',
      emotionDetected: 'Je peux entendre que vous vous sentez {{emotion}}',
      rememberYesterday: 'Je me souviens qu\'hier vous vous sentiez {{mood}}. Comment allez-vous aujourd\'hui?',
      supportiveResponse: 'Je suis là pour vous soutenir dans cette épreuve.',
      crisis: 'Ceci est un assistant IA de soutien. Pour les situations de crise, contactez les services d\'urgence.'
    },
    accessibility: {
      welcomeMessage: 'Bienvenue dans l\'Assistant d\'Accessibilité {{name}}. Je suis ici pour vous aider à naviguer et utiliser cette plateforme de santé mentale avec des commandes vocales.'
    },
    mood: {
      title: 'Suivi Quotidien d\'Humeur',
      subtitle: 'Suivez votre bien-être émotionnel et identifiez les tendances',
      overall: 'Humeur Générale',
      energy: 'Niveau d\'Énergie',
      stress: 'Niveau de Stress',
      sleep: 'Qualité du Sommeil',
      social: 'Connexion Sociale',
      notes: 'Notes Supplémentaires',
      saveToday: 'Sauvegarder l\'Humeur d\'Aujourd\'hui',
      howFeeling: 'Comment vous sentez-vous aujourd\'hui?',
      moodSaved: 'Entrée d\'humeur sauvegardée avec succès!'
    },
    voice: {
      startRecording: 'Démarrer Enregistrement Vocal',
      stopRecording: 'Arrêter Enregistrement',
      analyzing: 'Analyse de votre voix...',
      emotionDetected: 'Émotion détectée: {{emotion}}',
      speakNow: 'Parlez maintenant...',
      voiceNotSupported: 'Reconnaissance vocale non prise en charge dans ce navigateur',
      microphoneError: 'Impossible d\'accéder au microphone. Vérifiez les autorisations.'
    }
  },
  de: {
    common: {
      loading: 'Laden...',
      save: 'Speichern',
      cancel: 'Abbrechen',
      continue: 'Weiter',
      back: 'Zurück',
      next: 'Weiter',
      submit: 'Senden',
      search: 'Suchen',
      filter: 'Filter',
      close: 'Schließen',
      menu: 'Menü',
      settings: 'Einstellungen',
      profile: 'Profil',
      logout: 'Abmelden',
      login: 'Anmelden',
      signup: 'Registrieren',
      welcome: 'Willkommen',
      hello: 'Hallo',
      today: 'Heute',
      yesterday: 'Gestern',
      week: 'Woche',
      month: 'Monat',
      year: 'Jahr'
    },
    navigation: {
      home: 'Startseite',
      chat: 'KI-Unterstützung',
      mood: 'Stimmungs-Tracker',
      survey: 'Wellness-Umfrage',
      resources: 'Ressourcen',
      forum: 'Forum',
      booking: 'Sitzung buchen',
      dashboard: 'Dashboard'
    },
    chat: {
      title: 'KI-Unterstützung für mentale Gesundheit',
      subtitle: 'Ihr mitfühlender digitaler Begleiter für emotionales Wohlbefinden',
      placeholder: 'Teilen Sie mit, was Sie beschäftigt...',
      voicePrompt: 'Klicken Sie zum Sprechen oder tippen Sie Ihre Nachricht',
      listening: 'Höre zu...',
      processing: 'Verarbeitung Ihrer Stimme...',
      emotionDetected: 'Ich kann hören, dass Sie sich {{emotion}} fühlen',
      rememberYesterday: 'Ich erinnere mich, dass Sie sich gestern {{mood}} gefühlt haben. Wie geht es Ihnen heute?',
      supportiveResponse: 'Ich bin hier, um Sie dabei zu unterstützen.',
      crisis: 'Dies ist ein unterstützender KI-Assistent. In Krisensituationen wenden Sie sich bitte an die Notdienste.'
    },
    accessibility: {
      welcomeMessage: 'Willkommen beim {{name}} Barrierefreiheits-Assistenten. Ich bin hier, um Ihnen zu helfen, diese Plattform für mentale Gesundheit mit Sprachbefehlen zu navigieren und zu nutzen.'
    },
    mood: {
      title: 'Täglicher Stimmungs-Tracker',
      subtitle: 'Verfolgen Sie Ihr emotionales Wohlbefinden und identifizieren Sie Muster',
      overall: 'Gesamte Stimmung',
      energy: 'Energielevel',
      stress: 'Stresslevel',
      sleep: 'Schlafqualität',
      social: 'Soziale Verbindung',
      notes: 'Zusätzliche Notizen',
      saveToday: 'Heutige Stimmung speichern',
      howFeeling: 'Wie fühlen Sie sich heute?',
      moodSaved: 'Stimmungseintrag erfolgreich gespeichert!'
    },
    voice: {
      startRecording: 'Sprachaufnahme starten',
      stopRecording: 'Aufnahme stoppen',
      analyzing: 'Analysiere Ihre Stimme...',
      emotionDetected: 'Emotion erkannt: {{emotion}}',
      speakNow: 'Sprechen Sie jetzt...',
      voiceNotSupported: 'Spracherkennung in diesem Browser nicht unterstützt',
      microphoneError: 'Mikrofon konnte nicht aufgerufen werden. Überprüfen Sie die Berechtigungen.'
    }
  },
  pt: {
    common: {
      loading: 'Carregando...',
      save: 'Salvar',
      cancel: 'Cancelar',
      continue: 'Continuar',
      back: 'Voltar',
      next: 'Próximo',
      submit: 'Enviar',
      search: 'Pesquisar',
      filter: 'Filtrar',
      close: 'Fechar',
      menu: 'Menu',
      settings: 'Configurações',
      profile: 'Perfil',
      logout: 'Sair',
      login: 'Entrar',
      signup: 'Cadastrar',
      welcome: 'Bem-vindo',
      hello: 'Olá',
      today: 'Hoje',
      yesterday: 'Ontem',
      week: 'Semana',
      month: 'Mês',
      year: 'Ano'
    },
    navigation: {
      home: 'Início',
      chat: 'Suporte IA',
      mood: 'Monitor de Humor',
      survey: 'Pesquisa de Bem-estar',
      resources: 'Recursos',
      forum: 'Fórum',
      booking: 'Agendar Sessão',
      dashboard: 'Painel'
    },
    chat: {
      title: 'Suporte de Saúde Mental IA',
      subtitle: 'Seu companheiro digital compassivo para bem-estar emocional',
      placeholder: 'Compartilhe o que está em sua mente...',
      voicePrompt: 'Clique para falar ou digite sua mensagem',
      listening: 'Ouvindo...',
      processing: 'Processando sua voz...',
      emotionDetected: 'Posso ouvir que você está se sentindo {{emotion}}',
      rememberYesterday: 'Lembro que ontem você se sentia {{mood}}. Como está hoje?',
      supportiveResponse: 'Estou aqui para apoiá-lo nisso.',
      crisis: 'Este é um assistente de IA de apoio. Para situações de crise, entre em contato com serviços de emergência.'
    },
    accessibility: {
      welcomeMessage: 'Bem-vindo ao Assistente de Acessibilidade {{name}}. Estou aqui para ajudá-lo a navegar e usar esta plataforma de saúde mental com comandos de voz.'
    },
    mood: {
      title: 'Monitor Diário de Humor',
      subtitle: 'Rastreie seu bem-estar emocional e identifique padrões',
      overall: 'Humor Geral',
      energy: 'Nível de Energia',
      stress: 'Nível de Estresse',
      sleep: 'Qualidade do Sono',
      social: 'Conexão Social',
      notes: 'Notas Adicionais',
      saveToday: 'Salvar Humor de Hoje',
      howFeeling: 'Como você está se sentindo hoje?',
      moodSaved: 'Entrada de humor salva com sucesso!'
    },
    voice: {
      startRecording: 'Iniciar Gravação de Voz',
      stopRecording: 'Parar Gravação',
      analyzing: 'Analisando sua voz...',
      emotionDetected: 'Emoção detectada: {{emotion}}',
      speakNow: 'Fale agora...',
      voiceNotSupported: 'Reconhecimento de voz não suportado neste navegador',
      microphoneError: 'Não foi possível acessar o microfone. Verifique as permissões.'
    }
  },
  zh: {
    common: {
      loading: '加载中...',
      save: '保存',
      cancel: '取消',
      continue: '继续',
      back: '返回',
      next: '下一步',
      submit: '提交',
      search: '搜索',
      filter: '过滤',
      close: '关闭',
      menu: '菜单',
      settings: '设置',
      profile: '个人资料',
      logout: '登出',
      login: '登录',
      signup: '注册',
      welcome: '欢迎',
      hello: '你好',
      today: '今天',
      yesterday: '昨天',
      week: '周',
      month: '月',
      year: '年'
    },
    navigation: {
      home: '首页',
      chat: 'AI 支持',
      mood: '情绪追踪',
      survey: '健康调查',
      resources: '资源',
      forum: '论坛',
      booking: '预约会话',
      dashboard: '仪表板'
    },
    chat: {
      title: 'AI 心理健康支持',
      subtitle: '您情感健康的贴心数字伙伴',
      placeholder: '分享您的心声...',
      voicePrompt: '点击说话或输入您的消息',
      listening: '正在倾听...',
      processing: '正在处理您的语音...',
      emotionDetected: '我能听出您感到{{emotion}}',
      rememberYesterday: '我记得昨天您感到{{mood}}。今天怎么样？',
      supportiveResponse: '我在这里支持您度过这段时间。',
      crisis: '这是一个支持性AI助手。在危机情况下，请联系紧急服务。'
    },
    accessibility: {
      welcomeMessage: '欢迎使用{{name}}无障碍助手。我在这里帮助您使用语音命令导航和使用这个心理健康平台。'
    },
    mood: {
      title: '每日情绪追踪',
      subtitle: '追踪您的情感健康并识别模式',
      overall: '整体情绪',
      energy: '能量水平',
      stress: '压力水平',
      sleep: '睡眠质量',
      social: '社交联系',
      notes: '附加说明',
      saveToday: '保存今天的情绪',
      howFeeling: '您今天感觉如何？',
      moodSaved: '情绪记录保存成功！'
    },
    voice: {
      startRecording: '开始语音录制',
      stopRecording: '停止录制',
      analyzing: '正在分析您的语音...',
      emotionDetected: '检测到情绪：{{emotion}}',
      speakNow: '现在说话...',
      voiceNotSupported: '此浏览器不支持语音识别',
      microphoneError: '无法访问麦克风。请检查权限。'
    }
  },
  ja: {
    common: {
      loading: '読み込み中...',
      save: '保存',
      cancel: 'キャンセル',
      continue: '続ける',
      back: '戻る',
      next: '次へ',
      submit: '送信',
      search: '検索',
      filter: 'フィルター',
      close: '閉じる',
      menu: 'メニュー',
      settings: '設定',
      profile: 'プロフィール',
      logout: 'ログアウト',
      login: 'ログイン',
      signup: 'サインアップ',
      welcome: 'ようこそ',
      hello: 'こんにちは',
      today: '今日',
      yesterday: '昨日',
      week: '週',
      month: '月',
      year: '年'
    },
    navigation: {
      home: 'ホーム',
      chat: 'AIサポート',
      mood: 'ムードトラッカー',
      survey: 'ウェルネス調査',
      resources: 'リソース',
      forum: 'フォーラム',
      booking: 'セッション予約',
      dashboard: 'ダッシュボード'
    },
    chat: {
      title: 'AI メンタルヘルスサポート',
      subtitle: '感情的な健康のための思いやりのあるデジタルコンパニオン',
      placeholder: '心に浮かんでいることを共有してください...',
      voicePrompt: '話すにはクリックするか、メッセージを入力してください',
      listening: '聞いています...',
      processing: 'あなたの声を処理しています...',
      emotionDetected: 'あなたが{{emotion}}を感じているのが聞こえます',
      rememberYesterday: '昨日あなたが{{mood}}を感じていたことを覚えています。今日はいかがですか？',
      supportiveResponse: 'これを乗り越えるためにここにいます。',
      crisis: 'これはサポート的なAIアシスタントです。危機的状況では、緊急サービスに連絡してください。'
    },
    accessibility: {
      welcomeMessage: '{{name}}アクセシビリティアシスタントへようこそ。音声コマンドでこのメンタルヘルスプラットフォームをナビゲートし、使用するのをお手伝いします。'
    },
    mood: {
      title: '日々のムードトラッカー',
      subtitle: '感情的な健康を追跡し、パターンを特定します',
      overall: '全体的なムード',
      energy: 'エネルギーレベル',
      stress: 'ストレスレベル',
      sleep: '睡眠の質',
      social: 'ソーシャルコネクション',
      notes: '追加のメモ',
      saveToday: '今日のムードを保存',
      howFeeling: '今日はどのような気分ですか？',
      moodSaved: 'ムードエントリーが正常に保存されました！'
    },
    voice: {
      startRecording: '音声録音を開始',
      stopRecording: '録音を停止',
      analyzing: 'あなたの声を分析しています...',
      emotionDetected: '感情が検出されました：{{emotion}}',
      speakNow: '今話してください...',
      voiceNotSupported: 'このブラウザでは音声認識がサポートされていません',
      microphoneError: 'マイクにアクセスできませんでした。権限を確認してください。'
    }
  },
  ar: {
    common: {
      loading: 'جاري التحميل...',
      save: 'حفظ',
      cancel: 'إلغاء',
      continue: 'متابعة',
      back: 'رجوع',
      next: 'التالي',
      submit: 'إرسال',
      search: 'بحث',
      filter: 'تصفية',
      close: 'إغلاق',
      menu: 'القائمة',
      settings: 'الإعدادات',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      welcome: 'مرحباً',
      hello: 'أهلاً',
      today: 'اليوم',
      yesterday: 'أمس',
      week: 'أسبوع',
      month: 'شهر',
      year: 'سنة'
    },
    navigation: {
      home: 'الرئيسية',
      chat: 'دعم الذكاء الاصطناعي',
      mood: 'متتبع المزاج',
      survey: 'استطلاع الصحة',
      resources: 'الموارد',
      forum: 'المنتدى',
      booking: 'حجز جلسة',
      dashboard: 'لوحة القيادة'
    },
    chat: {
      title: 'دعم الصحة النفسية بالذكاء الاصطناعي',
      subtitle: 'رفيقك الرقمي الرحيم للصحة العاطفية',
      placeholder: 'شارك ما يدور في ذهنك...',
      voicePrompt: 'انقر للتحدث أو اكتب رسالتك',
      listening: 'استمع...',
      processing: 'معالجة صوتك...',
      emotionDetected: 'أستطيع أن أسمع أنك تشعر بـ{{emotion}}',
      rememberYesterday: 'أتذكر أنك شعرت بـ{{mood}} أمس. كيف حالك اليوم؟',
      supportiveResponse: 'أنا هنا لدعمك خلال هذا.',
      crisis: 'هذا مساعد ذكي داعم. في حالات الطوارئ، يرجى الاتصال بخدمات الطوارئ.'
    },
    accessibility: {
      welcomeMessage: 'مرحباً بك في مساعد إمكانية الوصول {{name}}. أنا هنا لمساعدتك في التنقل واستخدام منصة الصحة النفسية هذه باستخدام الأوامر الصوتية.'
    },
    mood: {
      title: 'متتبع المزاج اليومي',
      subtitle: 'تتبع صحتك العاطفية وحدد الأنماط',
      overall: 'المزاج العام',
      energy: 'مستوى الطاقة',
      stress: 'مستوى التوتر',
      sleep: 'جودة النوم',
      social: 'التواصل الاجتماعي',
      notes: 'ملاحظات إضافية',
      saveToday: 'حفظ مزاج اليوم',
      howFeeling: 'كيف تشعر اليوم؟',
      moodSaved: 'تم حفظ إدخال المزاج بنجاح!'
    },
    voice: {
      startRecording: 'بدء تسجيل الصوت',
      stopRecording: 'إيقاف التسجيل',
      analyzing: 'تحليل صوتك...',
      emotionDetected: 'تم اكتشاف المشاعر: {{emotion}}',
      speakNow: 'تحدث الآن...',
      voiceNotSupported: 'التعرف على الصوت غير مدعوم في هذا المتصفح',
      microphoneError: 'لا يمكن الوصول إلى الميكروفون. يرجى التحقق من الأذونات.'
    }
  },
  ru: {
    common: {
      loading: 'Загрузка...',
      save: 'Сохранить',
      cancel: 'Отмена',
      continue: 'Продолжить',
      back: 'Назад',
      next: 'Далее',
      submit: 'Отправить',
      search: 'Поиск',
      filter: 'Фильтр',
      close: 'Закрыть',
      menu: 'Меню',
      settings: 'Настройки',
      profile: 'Профиль',
      logout: 'Выход',
      login: 'Вход',
      signup: 'Регистрация',
      welcome: 'Добро пожаловать',
      hello: 'Привет',
      today: 'Сегодня',
      yesterday: 'Вчера',
      week: 'Неделя',
      month: 'Месяц',
      year: 'Год'
    },
    navigation: {
      home: 'Главная',
      chat: 'ИИ поддержка',
      mood: 'Трекер настроения',
      survey: 'Опрос благополучия',
      resources: 'Ресурсы',
      forum: 'Форум',
      booking: 'Забронировать сеанс',
      dashboard: 'Панель управления'
    },
    chat: {
      title: 'ИИ поддержка психического здоровья',
      subtitle: 'Ваш сострадательный цифровой компаньон для эмоционального благополучия',
      placeholder: 'Поделитесь тем, что у вас на уме...',
      voicePrompt: 'Нажмите, чтобы говорить, или введите ваше сообщение',
      listening: 'Слушаю...',
      processing: 'Обработка вашего голоса...',
      emotionDetected: 'Я слышу, что вы чувствуете {{emotion}}',
      rememberYesterday: 'Я помню, что вчера вы чувствовали {{mood}}. Как дела сегодня?',
      supportiveResponse: 'Я здесь, чтобы поддержать вас в этом.',
      crisis: 'Это поддерживающий ИИ-помощник. В кризисных ситуациях обращайтесь в службы экстренной помощи.'
    },
    accessibility: {
      welcomeMessage: 'Добро пожаловать в Помощник доступности {{name}}. Я здесь, чтобы помочь вам навигировать и использовать эту платформу психического здоровья с помощью голосовых команд.'
    },
    mood: {
      title: 'Ежедневный трекер настроения',
      subtitle: 'Отслеживайте ваше эмоциональное благополучие и выявляйте закономерности',
      overall: 'Общее настроение',
      energy: 'Уровень энергии',
      stress: 'Уровень стресса',
      sleep: 'Качество сна',
      social: 'Социальная связь',
      notes: 'Дополнительные заметки',
      saveToday: 'Сохранить настроение сегодня',
      howFeeling: 'Как вы себя чувствуете сегодня?',
      moodSaved: 'Запись настроения успешно сохранена!'
    },
    voice: {
      startRecording: 'Начать запись голоса',
      stopRecording: 'Остановить запись',
      analyzing: 'Анализ вашего голоса...',
      emotionDetected: 'Обнаружена эмоция: {{emotion}}',
      speakNow: 'Говорите сейчас...',
      voiceNotSupported: 'Распознавание речи не поддерживается в этом браузере',
      microphoneError: 'Не удалось получить доступ к микрофону. Проверьте разрешения.'
    }
  }
};

// RTL languages
const rtlLanguages: SupportedLanguage[] = ['ar'];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Auto-detect user's language
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    const savedLang = localStorage.getItem('selectedLanguage') as SupportedLanguage;
    
    if (savedLang && supportedLanguages.some(lang => lang.code === savedLang)) {
      setCurrentLanguage(savedLang);
    } else if (supportedLanguages.some(lang => lang.code === browserLang)) {
      setCurrentLanguage(browserLang);
    }
  }, []);

  useEffect(() => {
    setIsRTL(rtlLanguages.includes(currentLanguage));
    document.documentElement.dir = rtlLanguages.includes(currentLanguage) ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== 'string') {
      // Fallback to English
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
      }
    }

    if (typeof value !== 'string') {
      return key; // Return key if translation not found
    }

    // Replace parameters
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, param: string) => {
        return params[param] || match;
      });
    }

    return value;
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    isRTL,
    supportedLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}