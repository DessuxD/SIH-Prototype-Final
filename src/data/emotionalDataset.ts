export interface EmotionalEntry {
  id: number;
  category: string;
  userInput: string;
  botResponse: string;
  copingStrategy: string;
  emotionTags: string[];
  severityLevel: 'low' | 'moderate' | 'high' | 'crisis';
  supportType: 'validation' | 'guidance' | 'intervention' | 'encouragement';
}

export const emotionalDataset: EmotionalEntry[] = [
  // Academic & Study Stress (1-50)
  { id: 1, category: "Academic Stress", userInput: "I can't handle the pressure", botResponse: "That pressure sounds overwhelming. You're not alone in feeling this way.", copingStrategy: "Break tasks into smaller, manageable steps.", emotionTags: ["overwhelmed", "pressure", "stress"], severityLevel: "moderate", supportType: "validation" },
  { id: 2, category: "Academic Stress", userInput: "I'm failing everything", botResponse: "That must feel devastating. One grade doesn't define your worth or potential.", copingStrategy: "Focus on learning from mistakes rather than perfect grades.", emotionTags: ["failure", "academic", "despair"], severityLevel: "high", supportType: "encouragement" },
  { id: 3, category: "Academic Stress", userInput: "I'm behind on everything", botResponse: "Being behind feels stressful, but you can catch up step by step.", copingStrategy: "Prioritize the most important tasks first.", emotionTags: ["behind", "overwhelmed", "academic"], severityLevel: "moderate", supportType: "guidance" },
  { id: 4, category: "Academic Stress", userInput: "I don't understand anything", botResponse: "That confusion is frustrating. Learning takes time, and it's okay to ask for help.", copingStrategy: "Reach out to teachers, tutors, or study groups.", emotionTags: ["confusion", "academic", "frustrated"], severityLevel: "moderate", supportType: "guidance" },
  { id: 5, category: "Academic Stress", userInput: "I'm scared of exams", botResponse: "Exam anxiety is common and very real. Your fear doesn't mean you'll fail.", copingStrategy: "Practice relaxation techniques before studying.", emotionTags: ["anxiety", "exams", "fear"], severityLevel: "moderate", supportType: "validation" },

  // Social Anxiety (51-100)
  { id: 51, category: "Social Anxiety", userInput: "I'm too scared to speak up in class", botResponse: "That anxiety is real, but your voice deserves to be heard.", copingStrategy: "Start by participating in smaller group discussions.", emotionTags: ["anxiety", "social", "fear"], severityLevel: "moderate", supportType: "encouragement" },
  { id: 52, category: "Social Anxiety", userInput: "Everyone will laugh at me", botResponse: "That fear feels huge, but most people are focused on themselves.", copingStrategy: "Challenge these thoughts with evidence.", emotionTags: ["fear", "judgment", "social"], severityLevel: "moderate", supportType: "guidance" },
  { id: 53, category: "Social Anxiety", userInput: "I have no friends", botResponse: "Loneliness hurts deeply. Meaningful connections can still be built.", copingStrategy: "Join activities that align with your interests.", emotionTags: ["loneliness", "isolation", "social"], severityLevel: "high", supportType: "guidance" },
  { id: 54, category: "Social Anxiety", userInput: "I feel awkward around people", botResponse: "That awkwardness is more common than you think. Most people feel this sometimes.", copingStrategy: "Practice self-compassion during social moments.", emotionTags: ["awkward", "social", "insecurity"], severityLevel: "moderate", supportType: "validation" },
  { id: 55, category: "Social Anxiety", userInput: "I avoid social situations", botResponse: "Avoidance feels safe but can increase anxiety over time.", copingStrategy: "Start with very small, low-pressure social interactions.", emotionTags: ["avoidance", "social", "anxiety"], severityLevel: "moderate", supportType: "guidance" },

  // Depression & Low Mood (101-150)
  { id: 101, category: "Depression", userInput: "I feel empty inside", botResponse: "That emptiness is painful. You're not broken, even when you feel hollow.", copingStrategy: "Engage in small activities that once brought joy.", emotionTags: ["emptiness", "depression", "numb"], severityLevel: "high", supportType: "validation" },
  { id: 102, category: "Depression", userInput: "Nothing makes me happy anymore", botResponse: "That loss of joy is hard. Depression can steal pleasure, but it can return.", copingStrategy: "Try gentle activities without pressure to feel happy.", emotionTags: ["anhedonia", "depression", "loss"], severityLevel: "high", supportType: "validation" },
  { id: 103, category: "Depression", userInput: "I sleep all the time", botResponse: "Sleep can become an escape when emotions feel heavy.", copingStrategy: "Try setting small daily goals to create structure.", emotionTags: ["fatigue", "depression", "avoidance"], severityLevel: "moderate", supportType: "guidance" },
  { id: 104, category: "Depression", userInput: "I can't get out of bed", botResponse: "That heaviness is real. Even sitting up counts as progress.", copingStrategy: "Celebrate the smallest movements forward.", emotionTags: ["fatigue", "depression", "immobilized"], severityLevel: "high", supportType: "encouragement" },
  { id: 105, category: "Depression", userInput: "Life feels meaningless", botResponse: "That existential pain is deep. Meaning can be found even in small moments.", copingStrategy: "Look for tiny purposes in daily acts of kindness.", emotionTags: ["meaninglessness", "existential", "depression"], severityLevel: "high", supportType: "guidance" },

  // Family Issues (151-200)
  { id: 151, category: "Family Issues", userInput: "My parents don't understand me", botResponse: "That disconnect with family can feel isolating. Your feelings are still valid.", copingStrategy: "Try expressing your needs clearly and calmly.", emotionTags: ["misunderstood", "family", "isolation"], severityLevel: "moderate", supportType: "validation" },
  { id: 152, category: "Family Issues", userInput: "There's constant fighting at home", botResponse: "Living in conflict is exhausting and stressful. You deserve peace.", copingStrategy: "Create a quiet space for yourself when possible.", emotionTags: ["conflict", "family", "stress"], severityLevel: "moderate", supportType: "guidance" },
  { id: 153, category: "Family Issues", userInput: "I feel like a disappointment", botResponse: "That's a heavy burden to carry. Your worth isn't measured by others' expectations.", copingStrategy: "Focus on your own values and goals.", emotionTags: ["disappointment", "shame", "family"], severityLevel: "moderate", supportType: "encouragement" },
  { id: 154, category: "Family Issues", userInput: "My family expects too much", botResponse: "Those high expectations can feel crushing. You're enough as you are.", copingStrategy: "Set realistic boundaries about what you can handle.", emotionTags: ["pressure", "expectations", "family"], severityLevel: "moderate", supportType: "validation" },
  { id: 155, category: "Family Issues", userInput: "I don't feel loved at home", botResponse: "That absence of love hurts deeply. You deserve to feel valued and cared for.", copingStrategy: "Seek support from other caring relationships.", emotionTags: ["unloved", "family", "rejection"], severityLevel: "high", supportType: "validation" },

  // Self-Esteem Issues (201-250)
  { id: 201, category: "Self-Esteem", userInput: "I hate how I look", botResponse: "That self-criticism is painful. Your worth goes far beyond appearance.", copingStrategy: "Practice appreciating what your body does for you.", emotionTags: ["body-image", "self-hatred", "appearance"], severityLevel: "moderate", supportType: "validation" },
  { id: 202, category: "Self-Esteem", userInput: "I'm not good at anything", botResponse: "That feeling hurts, but everyone has unique strengths waiting to be discovered.", copingStrategy: "Keep a list of small accomplishments daily.", emotionTags: ["inadequacy", "self-worth", "comparison"], severityLevel: "moderate", supportType: "encouragement" },
  { id: 203, category: "Self-Esteem", userInput: "I compare myself to others constantly", botResponse: "Comparison can be a thief of joy. Your journey is uniquely yours.", copingStrategy: "Limit social media exposure when feeling vulnerable.", emotionTags: ["comparison", "inadequacy", "social-media"], severityLevel: "moderate", supportType: "guidance" },
  { id: 204, category: "Self-Esteem", userInput: "I feel so stupid", botResponse: "Intelligence comes in many forms. One struggle doesn't define your capabilities.", copingStrategy: "Celebrate different types of intelligence you possess.", emotionTags: ["inadequacy", "intelligence", "self-doubt"], severityLevel: "moderate", supportType: "encouragement" },
  { id: 205, category: "Self-Esteem", userInput: "Nobody likes me", botResponse: "That loneliness is hard, but your perception might be colored by pain.", copingStrategy: "Look for evidence of people who do care about you.", emotionTags: ["rejection", "loneliness", "self-worth"], severityLevel: "moderate", supportType: "guidance" },

  // Guilt & Regret (251-255)
  { id: 251, category: "Guilt & Regret", userInput: "I can't forgive myself", botResponse: "That self-blame is heavy. Forgiveness is a gift you deserve too.", copingStrategy: "Write yourself an apology letter.", emotionTags: ["guilt", "self-blame", "forgiveness"], severityLevel: "moderate", supportType: "validation" },
  { id: 252, category: "Guilt & Regret", userInput: "I regret everything I've done", botResponse: "Regret can weigh like chains. Growth often comes from mistakes.", copingStrategy: "Turn regret into lessons learned.", emotionTags: ["regret", "self-blame", "despair"], severityLevel: "moderate", supportType: "guidance" },
  { id: 253, category: "Guilt & Regret", userInput: "I feel guilty for things I couldn't control", botResponse: "That guilt isn't fair to you. Not everything is your responsibility.", copingStrategy: "List what was outside your control.", emotionTags: ["guilt", "control", "responsibility"], severityLevel: "moderate", supportType: "validation" },
  { id: 254, category: "Guilt & Regret", userInput: "I hurt someone I love", botResponse: "That must sting deeply. Owning it is the first step to healing.", copingStrategy: "Reach out with a sincere apology if possible.", emotionTags: ["guilt", "hurt", "relationships"], severityLevel: "moderate", supportType: "guidance" },
  { id: 255, category: "Guilt & Regret", userInput: "I regret not trying harder", botResponse: "That's tough. But you can always start fresh from today.", copingStrategy: "Take one new action toward effort.", emotionTags: ["regret", "effort", "self-improvement"], severityLevel: "moderate", supportType: "encouragement" },

  // Fear & Worry (256-260)
  { id: 256, category: "Fear & Worry", userInput: "I'm scared of the future", botResponse: "That uncertainty can feel overwhelming. You don't have to face it all at once.", copingStrategy: "Focus on just today's step.", emotionTags: ["fear", "uncertainty", "future"], severityLevel: "moderate", supportType: "guidance" },
  { id: 257, category: "Fear & Worry", userInput: "I worry about everything", botResponse: "That constant worry is draining. Want me to share calming techniques?", copingStrategy: "Try scheduling 'worry time' to contain it.", emotionTags: ["worry", "anxiety", "overwhelmed"], severityLevel: "moderate", supportType: "guidance" },
  { id: 258, category: "Fear & Worry", userInput: "I'm afraid I'll lose people I love", botResponse: "That fear comes from deep love. Cherishing moments helps ease it.", copingStrategy: "Spend quality time with loved ones.", emotionTags: ["fear", "loss", "love"], severityLevel: "moderate", supportType: "validation" },
  { id: 259, category: "Fear & Worry", userInput: "I'm scared to take risks", botResponse: "Fear is natural—it means you care. Small risks build courage.", copingStrategy: "Start with a low-stakes risk.", emotionTags: ["fear", "risk", "courage"], severityLevel: "moderate", supportType: "encouragement" },
  { id: 260, category: "Fear & Worry", userInput: "I worry I'll never be enough", botResponse: "That fear hurts. But your worth isn't measured by perfection.", copingStrategy: "Practice affirmations of self-worth.", emotionTags: ["inadequacy", "worry", "self-worth"], severityLevel: "moderate", supportType: "validation" },

  // Motivation & Energy (261-265)
  { id: 261, category: "Motivation & Energy", userInput: "I have no motivation", botResponse: "That lack of drive can be discouraging. Small steps still count.", copingStrategy: "Break tasks into micro-goals.", emotionTags: ["unmotivated", "fatigue", "apathy"], severityLevel: "moderate", supportType: "guidance" },
  { id: 262, category: "Motivation & Energy", userInput: "I can't get out of bed", botResponse: "That heaviness is tough. Even sitting up is a win today.", copingStrategy: "Celebrate the tiniest progress.", emotionTags: ["fatigue", "depression", "immobilized"], severityLevel: "high", supportType: "encouragement" },
  { id: 263, category: "Motivation & Energy", userInput: "I feel too tired to try", botResponse: "That exhaustion is real. Rest is part of progress too.", copingStrategy: "Balance effort with recovery.", emotionTags: ["exhaustion", "fatigue", "overwhelmed"], severityLevel: "moderate", supportType: "validation" },
  { id: 264, category: "Motivation & Energy", userInput: "I start things but never finish", botResponse: "That's frustrating, but starting means you're trying.", copingStrategy: "Set smaller, finishable milestones.", emotionTags: ["procrastination", "incomplete", "frustration"], severityLevel: "moderate", supportType: "guidance" },
  { id: 265, category: "Motivation & Energy", userInput: "I can't focus on anything", botResponse: "That scattered feeling is common under stress.", copingStrategy: "Use a timer for short focus bursts.", emotionTags: ["unfocused", "scattered", "stress"], severityLevel: "moderate", supportType: "guidance" },

  // Crisis Situations (High Priority)
  { id: 300, category: "Crisis", userInput: "I want to give up", botResponse: "That despair is real, but you've made it this far. You matter.", copingStrategy: "Focus on just the next step, not the whole road.", emotionTags: ["suicidal", "despair", "hopelessness"], severityLevel: "crisis", supportType: "intervention" },
  { id: 301, category: "Crisis", userInput: "I don't think I can survive this", botResponse: "That fear is valid. But you've survived 100% of your hard days so far. You're stronger than you know.", copingStrategy: "Hold on for today only. Reach out for immediate support.", emotionTags: ["suicidal", "survival", "crisis"], severityLevel: "crisis", supportType: "intervention" },
  { id: 302, category: "Crisis", userInput: "I'm ready to quit everything", botResponse: "That pain is heavy. But you still matter. Please reach out for help.", copingStrategy: "Contact a crisis hotline or trusted person immediately.", emotionTags: ["suicidal", "despair", "pain"], severityLevel: "crisis", supportType: "intervention" },
  { id: 303, category: "Crisis", userInput: "Nothing will ever get better", botResponse: "That hopelessness is heavy. But change is always possible, even when it doesn't feel like it.", copingStrategy: "Look back at times things improved before.", emotionTags: ["hopelessness", "despair", "stuck"], severityLevel: "crisis", supportType: "intervention" },
  { id: 304, category: "Crisis", userInput: "I see no way out", botResponse: "That's a scary place to be. You're not alone. There are people who want to help.", copingStrategy: "Reach out to a support hotline or friend immediately.", emotionTags: ["trapped", "hopelessness", "crisis"], severityLevel: "crisis", supportType: "intervention" },

  // Hope & Encouragement (321-325)
  { id: 321, category: "Hope & Encouragement", userInput: "I want to give up", botResponse: "That despair is real, but you've made it this far.", copingStrategy: "Focus on just the next step, not the whole road.", emotionTags: ["despair", "perseverance", "hope"], severityLevel: "high", supportType: "encouragement" },
  { id: 322, category: "Hope & Encouragement", userInput: "I feel too weak", botResponse: "Your strength shows even in reaching out.", copingStrategy: "Recall past challenges you survived.", emotionTags: ["weakness", "strength", "resilience"], severityLevel: "moderate", supportType: "encouragement" },
  { id: 323, category: "Hope & Encouragement", userInput: "I can't keep going", botResponse: "That's tough, but you are stronger than you feel right now.", copingStrategy: "Break down life into one moment at a time.", emotionTags: ["exhaustion", "perseverance", "strength"], severityLevel: "high", supportType: "encouragement" },
  { id: 324, category: "Hope & Encouragement", userInput: "I don't think I can survive this", botResponse: "That fear is valid. But you've survived 100% of your hard days so far.", copingStrategy: "Hold on for today only.", emotionTags: ["survival", "fear", "resilience"], severityLevel: "crisis", supportType: "intervention" },
  { id: 325, category: "Hope & Encouragement", userInput: "I'm ready to quit everything", botResponse: "That pain is heavy. But you still matter.", copingStrategy: "Reach out to a trusted friend immediately.", emotionTags: ["despair", "quitting", "pain"], severityLevel: "crisis", supportType: "intervention" },

  // Self-Acceptance (336-340)
  { id: 336, category: "Self-Acceptance", userInput: "I don't like myself", botResponse: "That's tough. But you deserve to treat yourself with kindness.", copingStrategy: "Write down qualities you appreciate.", emotionTags: ["self-dislike", "self-worth", "acceptance"], severityLevel: "moderate", supportType: "validation" },
  { id: 337, category: "Self-Acceptance", userInput: "I wish I was someone else", botResponse: "That longing is painful. But your uniqueness matters.", copingStrategy: "Embrace one special trait of yours.", emotionTags: ["self-rejection", "identity", "uniqueness"], severityLevel: "moderate", supportType: "encouragement" },
  { id: 338, category: "Self-Acceptance", userInput: "I feel broken", botResponse: "That's a heavy feeling. But broken things can still shine.", copingStrategy: "Remember: healing makes strength visible.", emotionTags: ["broken", "healing", "strength"], severityLevel: "moderate", supportType: "validation" },
  { id: 339, category: "Self-Acceptance", userInput: "I can't accept myself", botResponse: "That's painful. But acceptance grows step by step.", copingStrategy: "Practice daily affirmations of acceptance.", emotionTags: ["self-rejection", "acceptance", "growth"], severityLevel: "moderate", supportType: "guidance" },
  { id: 340, category: "Self-Acceptance", userInput: "I feel incomplete", botResponse: "That emptiness must be hard. You are whole even in struggle.", copingStrategy: "List what makes you feel grounded.", emotionTags: ["incomplete", "wholeness", "emptiness"], severityLevel: "moderate", supportType: "validation" },

  // Healing & Growth (346-350)
  { id: 346, category: "Healing & Growth", userInput: "I don't think I'll ever heal", botResponse: "That fear is heavy. But healing often takes longer than we hope.", copingStrategy: "Notice tiny signs of progress.", emotionTags: ["healing", "doubt", "progress"], severityLevel: "moderate", supportType: "encouragement" },
  { id: 347, category: "Healing & Growth", userInput: "I feel stuck in the past", botResponse: "That's tough. Healing is possible even while remembering.", copingStrategy: "Practice mindfulness to stay present.", emotionTags: ["stuck", "past", "mindfulness"], severityLevel: "moderate", supportType: "guidance" },
  { id: 348, category: "Healing & Growth", userInput: "I keep reopening old wounds", botResponse: "That pain is real. Healing isn't always linear.", copingStrategy: "Allow yourself to step back when needed.", emotionTags: ["wounds", "healing", "setbacks"], severityLevel: "moderate", supportType: "validation" },
  { id: 349, category: "Healing & Growth", userInput: "I'll never get over this", botResponse: "That thought is heavy. But time often softens the sharp edges.", copingStrategy: "Give yourself patience and support.", emotionTags: ["stuck", "time", "healing"], severityLevel: "moderate", supportType: "encouragement" },
  { id: 350, category: "Healing & Growth", userInput: "I'm trying, but it still hurts", botResponse: "That's valid. Healing and pain can coexist.", copingStrategy: "Celebrate progress even if pain remains.", emotionTags: ["healing", "pain", "progress"], severityLevel: "moderate", supportType: "validation" }
];

// Helper functions for emotion analysis
export const getEmotionCategories = (): string[] => {
  return [...new Set(emotionalDataset.map(entry => entry.category))];
};

export const getEmotionTags = (): string[] => {
  return [...new Set(emotionalDataset.flatMap(entry => entry.emotionTags))];
};

export const findSimilarEntries = (userInput: string, maxResults: number = 5): EmotionalEntry[] => {
  const inputLower = userInput.toLowerCase();
  const words = inputLower.split(' ').filter(word => word.length > 2);
  
  const scored = emotionalDataset.map(entry => {
    let score = 0;
    const entryText = entry.userInput.toLowerCase();
    
    // Exact phrase matches get highest score
    if (entryText.includes(inputLower)) {
      score += 10;
    }
    
    // Word matches
    words.forEach(word => {
      if (entryText.includes(word)) {
        score += 3;
      }
      // Tag matches
      entry.emotionTags.forEach(tag => {
        if (tag.includes(word) || word.includes(tag)) {
          score += 2;
        }
      });
    });
    
    return { entry, score };
  });
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.entry);
};

export const getCrisisEntries = (): EmotionalEntry[] => {
  return emotionalDataset.filter(entry => entry.severityLevel === 'crisis');
};

export const getEntriesByCategory = (category: string): EmotionalEntry[] => {
  return emotionalDataset.filter(entry => entry.category === category);
};

export const getEntriesBySeverity = (severity: EmotionalEntry['severityLevel']): EmotionalEntry[] => {
  return emotionalDataset.filter(entry => entry.severityLevel === severity);
};