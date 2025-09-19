import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  Heart, 
  ClipboardList, 
  BookOpen, 
  Users, 
  Calendar,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
  LogIn,
  UserPlus,
  Brain
} from 'lucide-react';
import type { PageType } from '../App';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { isAuthenticated, user } = useAuth();

  const quickActions = [
    {
      id: 'chat' as PageType,
      title: 'Talk to AI Support',
      description: 'Get immediate emotional support and guidance',
      icon: MessageCircle,
      color: 'from-blue-400 to-blue-600',
      requiresAuth: true,
    },
    {
      id: 'mood' as PageType,
      title: 'Track Your Mood',
      description: 'Daily check-ins to monitor your emotional wellbeing',
      icon: Heart,
      color: 'from-pink-400 to-pink-600',
      requiresAuth: true,
    },
    {
      id: 'survey' as PageType,
      title: 'Wellness Assessment',
      description: 'Personalized mental health evaluation',
      icon: ClipboardList,
      color: 'from-purple-400 to-purple-600',
      requiresAuth: true,
    },
  ];

  const handleActionClick = (action: typeof quickActions[0]) => {
    if (action.requiresAuth && !isAuthenticated) {
      // Could show auth modal here - for now just navigate to resources
      onNavigate('resources');
    } else {
      onNavigate(action.id);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Anonymous & Safe',
      description: 'Your privacy is our priority. All interactions are confidential.',
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Access support whenever you need it, day or night.',
    },
    {
      icon: CheckCircle,
      title: 'Evidence-Based',
      description: 'Our resources are backed by mental health research.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Welcome Banner for Authenticated Users */}
      {isAuthenticated && (
        <section className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl text-gray-800">Welcome back, {user?.firstName}! 👋</h2>
                <p className="text-gray-600">Ready to continue your wellness journey?</p>
              </div>
              <Button
                onClick={() => onNavigate('mood')}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
              >
                <Heart className="mr-2 h-4 w-4" />
                Quick Mood Check
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl leading-tight text-gray-800">
                  Your Mental Health
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Matters</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  A comprehensive digital support system designed specifically for students in higher education. 
                  Get personalized mental health support, track your wellbeing, and connect with resources that help you thrive.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Button 
                      onClick={() => onNavigate('chat')}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg h-auto"
                    >
                      Start Chatting
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => onNavigate('mood')}
                      className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg h-auto"
                    >
                      Track Your Mood
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => onNavigate('resources')}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg h-auto"
                    >
                      Explore Resources
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {/* This would trigger auth modal */}}
                      className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg h-auto"
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      Sign Up Free
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-2xl transform rotate-3"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1655970580622-4a547789c850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMG1lZGl0YXRpb24lMjBzdHVkZW50JTIwd2VsbG5lc3N8ZW58MXx8fHwxNzU4MDI3NTA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Student practicing mindfulness"
                className="relative z-10 w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-800 mb-4">Get Started Today</h2>
            <p className="text-lg text-gray-600">Choose how you'd like to begin your mental wellness journey</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.id} 
                  className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
                  onClick={() => handleActionClick(action)}
                >
                  <CardContent className="p-8 text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl text-gray-800">{action.title}</h3>
                    <p className="text-gray-600">{action.description}</p>
                    {action.requiresAuth && !isAuthenticated && (
                      <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        Sign up required
                      </p>
                    )}
                    <ArrowRight className="h-5 w-5 mx-auto text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-800 mb-4">Why Choose MindSupport?</h2>
            <p className="text-lg text-gray-600">Built with students' unique needs in mind</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Resources CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl text-gray-800">Explore More Resources</h2>
          <p className="text-lg text-gray-600">
            Access our comprehensive library of mental health resources, connect with peers, 
            or schedule a session with professional counselors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Button 
              onClick={() => onNavigate('resources')}
              variant="outline"
              className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Browse Resources
            </Button>
            <Button 
              onClick={() => onNavigate('forum')}
              variant="outline"
              className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 px-6 py-3"
            >
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </Button>
            <Button 
              onClick={() => onNavigate('booking')}
              variant="outline"
              className="border-2 border-pink-200 text-pink-600 hover:bg-pink-50 px-6 py-3"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Session
            </Button>
            <Button 
              onClick={() => onNavigate('media-demo')}
              variant="outline"
              className="border-2 border-green-200 text-green-600 hover:bg-green-50 px-6 py-3"
            >
              <Brain className="mr-2 h-5 w-5" />
              Media Capabilities
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}