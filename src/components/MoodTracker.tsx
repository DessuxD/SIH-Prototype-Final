import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { 
  Smile, 
  Frown, 
  Meh, 
  Heart,
  TrendingUp,
  Calendar,
  Save,
  Eye,
  Battery,
  Moon,
  Zap,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';

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

interface MoodData {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

export function MoodTracker() {
  const [currentMood, setCurrentMood] = useState<MoodData[]>([
    { label: 'Overall Mood', value: 5, icon: Heart, color: 'text-pink-500', description: 'How do you feel overall today?' },
    { label: 'Energy Level', value: 5, icon: Zap, color: 'text-yellow-500', description: 'How energetic do you feel?' },
    { label: 'Stress Level', value: 5, icon: Battery, color: 'text-red-500', description: 'How stressed are you feeling?' },
    { label: 'Sleep Quality', value: 5, icon: Moon, color: 'text-blue-500', description: 'How well did you sleep last night?' },
    { label: 'Social Connection', value: 5, icon: Users, color: 'text-green-500', description: 'How connected do you feel to others?' },
  ]);
  
  const [notes, setNotes] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load mood history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('moodHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
      setMoodHistory(parsed);
    }
  }, []);

  const updateMoodValue = (index: number, newValue: number[]) => {
    setCurrentMood(prev => prev.map((mood, i) => 
      i === index ? { ...mood, value: newValue[0] } : mood
    ));
  };

  const getMoodEmoji = (value: number) => {
    if (value <= 3) return <Frown className="h-6 w-6 text-red-500" />;
    if (value <= 7) return <Meh className="h-6 w-6 text-yellow-500" />;
    return <Smile className="h-6 w-6 text-green-500" />;
  };

  const getMoodColor = (value: number) => {
    if (value <= 3) return 'from-red-400 to-red-600';
    if (value <= 7) return 'from-yellow-400 to-yellow-600';
    return 'from-green-400 to-green-600';
  };

  const saveMoodEntry = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      overall: currentMood[0].value,
      energy: currentMood[1].value,
      stress: currentMood[2].value,
      sleep: currentMood[3].value,
      social: currentMood[4].value,
      notes,
    };

    const updatedHistory = [newEntry, ...moodHistory].slice(0, 30); // Keep last 30 entries
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    
    // Reset form
    setNotes('');
    
    // Show success message (could be replaced with a toast)
    alert('Mood entry saved successfully!');
  };

  const getAverageScore = () => {
    if (moodHistory.length === 0) return 0;
    const total = moodHistory.reduce((sum, entry) => sum + entry.overall, 0);
    return Math.round((total / moodHistory.length) * 10) / 10;
  };

  const getWeeklyTrend = () => {
    if (moodHistory.length < 2) return 'neutral';
    const recent = moodHistory.slice(0, 3).reduce((sum, entry) => sum + entry.overall, 0) / Math.min(3, moodHistory.length);
    const older = moodHistory.slice(-3).reduce((sum, entry) => sum + entry.overall, 0) / Math.min(3, moodHistory.length);
    
    if (recent > older + 0.5) return 'improving';
    if (recent < older - 0.5) return 'declining';
    return 'stable';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-gray-800">Daily Mood Tracker</h1>
              <p className="text-gray-600">Track your emotional wellbeing and identify patterns</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      {moodHistory.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-2xl mb-2">{getAverageScore()}/10</div>
              <p className="text-gray-600">Average Mood</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-2xl mb-2">{moodHistory.length}</div>
              <p className="text-gray-600">Entries Logged</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className={`h-5 w-5 ${
                  getWeeklyTrend() === 'improving' ? 'text-green-500' : 
                  getWeeklyTrend() === 'declining' ? 'text-red-500' : 'text-gray-500'
                }`} />
                <span className="text-2xl capitalize">{getWeeklyTrend()}</span>
              </div>
              <p className="text-gray-600">Weekly Trend</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mood Tracking */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>How are you feeling today?</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date().toLocaleDateString()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentMood.map((mood, index) => {
            const Icon = mood.icon;
            return (
              <motion.div
                key={mood.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${mood.color}`} />
                    <div>
                      <p className="text-gray-800">{mood.label}</p>
                      <p className="text-sm text-gray-500">{mood.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getMoodEmoji(mood.value)}
                    <Badge className={`bg-gradient-to-r ${getMoodColor(mood.value)} text-white`}>
                      {mood.value}/10
                    </Badge>
                  </div>
                </div>
                
                <Slider
                  value={[mood.value]}
                  onValueChange={(value) => updateMoodValue(index, value)}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </motion.div>
            );
          })}
          
          {/* Notes Section */}
          <div className="space-y-3">
            <label className="text-gray-800">Additional Notes (Optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything specific you'd like to remember about today? What influenced your mood?"
              className="min-h-[100px] resize-none"
            />
          </div>
          
          {/* Save Button */}
          <Button
            onClick={saveMoodEntry}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-6"
          >
            <Save className="mr-2 h-5 w-5" />
            Save Today's Mood
          </Button>
        </CardContent>
      </Card>

      {/* History Toggle */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setShowHistory(!showHistory)}
          className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <Eye className="mr-2 h-4 w-4" />
          {showHistory ? 'Hide' : 'View'} Mood History
        </Button>
      </div>

      {/* Mood History */}
      {showHistory && moodHistory.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Mood Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {moodHistory.map((entry) => (
                <div key={entry.id} className="border-l-4 border-purple-200 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-800">{entry.date.toLocaleDateString()}</p>
                    <div className="flex items-center space-x-2">
                      {getMoodEmoji(entry.overall)}
                      <Badge variant="secondary">{entry.overall}/10</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-2">
                    <span>Energy: {entry.energy}/10</span>
                    <span>Stress: {entry.stress}/10</span>
                    <span>Sleep: {entry.sleep}/10</span>
                    <span>Social: {entry.social}/10</span>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}