import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  ClipboardList, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle,
  AlertTriangle,
  Heart,
  Brain,
  Moon,
  Users,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: string;
  text: string;
  options: string[];
  category: 'anxiety' | 'depression' | 'stress' | 'sleep' | 'social';
}

interface SurveyResponse {
  questionId: string;
  answer: number;
}

export function SurveyModule() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'survey' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  const questions: Question[] = [
    {
      id: '1',
      text: 'Over the last 2 weeks, how often have you felt nervous, anxious, or on edge?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
      category: 'anxiety'
    },
    {
      id: '2',
      text: 'How often have you had trouble relaxing?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
      category: 'anxiety'
    },
    {
      id: '3',
      text: 'Over the last 2 weeks, how often have you felt down, depressed, or hopeless?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
      category: 'depression'
    },
    {
      id: '4',
      text: 'How often have you had little interest or pleasure in doing things?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
      category: 'depression'
    },
    {
      id: '5',
      text: 'How often have you felt that you were unable to control important things in your life?',
      options: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
      category: 'stress'
    },
    {
      id: '6',
      text: 'How often have you felt confident about your ability to handle personal problems?',
      options: ['Very often', 'Fairly often', 'Sometimes', 'Almost never', 'Never'],
      category: 'stress'
    },
    {
      id: '7',
      text: 'During the past month, how would you rate your sleep quality overall?',
      options: ['Very good', 'Fairly good', 'Fairly bad', 'Very bad'],
      category: 'sleep'
    },
    {
      id: '8',
      text: 'How often do you feel isolated from others?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
      category: 'social'
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
  };

  const handleNext = () => {
    if (currentAnswer) {
      const newResponse: SurveyResponse = {
        questionId: currentQuestion.id,
        answer: parseInt(currentAnswer)
      };
      
      setResponses(prev => [...prev.filter(r => r.questionId !== currentQuestion.id), newResponse]);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setCurrentAnswer('');
      } else {
        setCurrentStep('results');
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      const previousResponse = responses.find(r => r.questionId === questions[currentQuestionIndex - 1].id);
      setCurrentAnswer(previousResponse?.answer.toString() || '');
    }
  };

  const calculateCategoryScore = (category: string) => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const categoryResponses = responses.filter(r => 
      categoryQuestions.some(q => q.id === r.questionId)
    );
    
    if (categoryResponses.length === 0) return 0;
    
    const total = categoryResponses.reduce((sum, response) => sum + response.answer, 0);
    const maxPossible = categoryQuestions.length * (categoryQuestions[0].options.length - 1);
    
    return Math.round((total / maxPossible) * 100);
  };

  const getOverallRiskLevel = () => {
    const scores = {
      anxiety: calculateCategoryScore('anxiety'),
      depression: calculateCategoryScore('depression'),
      stress: calculateCategoryScore('stress'),
      sleep: calculateCategoryScore('sleep'),
      social: calculateCategoryScore('social')
    };
    
    const avgScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length;
    
    if (avgScore <= 25) return 'low';
    if (avgScore <= 50) return 'moderate';
    if (avgScore <= 75) return 'high';
    return 'very-high';
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'very-high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendations = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return [
          'Continue with your current self-care practices',
          'Regular exercise and good sleep hygiene',
          'Stay connected with friends and family',
          'Consider mindfulness or meditation practices'
        ];
      case 'moderate':
        return [
          'Focus on stress management techniques',
          'Consider talking to a counselor or therapist',
          'Maintain regular sleep and exercise routines',
          'Practice relaxation techniques daily',
          'Use our mood tracking feature regularly'
        ];
      case 'high':
        return [
          'Strongly recommend speaking with a mental health professional',
          'Consider scheduling a counseling session through our platform',
          'Reach out to trusted friends, family, or support groups',
          'Practice daily stress reduction techniques',
          'Monitor your mood closely and seek help if it worsens'
        ];
      case 'very-high':
        return [
          'Please consider seeking immediate professional help',
          'Contact a mental health crisis line if needed',
          'Schedule an appointment with a counselor as soon as possible',
          'Reach out to trusted support networks',
          'Do not hesitate to contact emergency services if you feel unsafe'
        ];
      default:
        return [];
    }
  };

  if (currentStep === 'intro') {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-800">Mental Wellness Assessment</CardTitle>
            <p className="text-gray-600">
              A brief, confidential assessment to help understand your current mental health and wellbeing
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 mb-2">What to Expect</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• 8 evidence-based questions</li>
                <li>• Takes approximately 3-5 minutes</li>
                <li>• Completely anonymous and confidential</li>
                <li>• Personalized recommendations based on your responses</li>
                <li>• No judgment - this is a safe space for honest reflection</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-yellow-800 text-sm">
                  <p className="mb-1">Important Disclaimer</p>
                  <p>This assessment is for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment. If you're experiencing a mental health crisis, please contact emergency services or a mental health crisis line immediately.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <Button
                onClick={() => setCurrentStep('survey')}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-6 text-lg"
              >
                Begin Assessment
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500">
                Your responses will be kept completely confidential
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'survey') {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Progress Header */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {Math.round(progress)}% Complete
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl text-gray-800 leading-relaxed">
                      {currentQuestion.text}
                    </h2>
                  </div>
                  
                  <RadioGroup value={currentAnswer} onValueChange={handleAnswerChange}>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div 
                          key={index} 
                          className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label 
                            htmlFor={`option-${index}`} 
                            className="flex-1 cursor-pointer text-gray-700"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!currentAnswer}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'results') {
    const riskLevel = getOverallRiskLevel();
    const recommendations = getRecommendations(riskLevel);
    
    const categoryScores = {
      anxiety: { score: calculateCategoryScore('anxiety'), icon: Brain, label: 'Anxiety' },
      depression: { score: calculateCategoryScore('depression'), icon: Heart, label: 'Depression' },
      stress: { score: calculateCategoryScore('stress'), icon: Activity, label: 'Stress' },
      sleep: { score: calculateCategoryScore('sleep'), icon: Moon, label: 'Sleep' },
      social: { score: calculateCategoryScore('social'), icon: Users, label: 'Social Connection' }
    };

    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Results Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl text-gray-800 mb-2">Assessment Complete</h1>
            <p className="text-gray-600">
              Thank you for taking the time to reflect on your mental wellness. Here are your personalized results.
            </p>
          </CardContent>
        </Card>

        {/* Overall Risk Level */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Overall Wellness Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-6 rounded-lg border-2 ${getRiskLevelColor(riskLevel)}`}>
              <div className="text-center">
                <div className="text-2xl mb-2 capitalize">{riskLevel.replace('-', ' ')} Risk</div>
                <p className="text-sm">
                  Based on your responses, this indicates your current wellness level across the assessed areas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Detailed Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(categoryScores).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-800">{category.label}</span>
                      </div>
                      <Badge variant="secondary">{category.score}%</Badge>
                    </div>
                    <Progress value={category.score} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-blue-800 text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg text-gray-800">What's Next?</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => {
                    setCurrentStep('intro');
                    setCurrentQuestionIndex(0);
                    setResponses([]);
                    setCurrentAnswer('');
                  }}
                  variant="outline"
                  className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  Take Assessment Again
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  View Resources
                </Button>
                {(riskLevel === 'high' || riskLevel === 'very-high') && (
                  <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
                    Book Counseling Session
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}