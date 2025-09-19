import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  BookOpen, 
  Search, 
  Heart, 
  Brain, 
  Moon, 
  Users, 
  Headphones,
  Video,
  Download,
  ExternalLink,
  Clock,
  Star,
  Filter,
  Play
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'tool' | 'exercise';
  category: 'anxiety' | 'depression' | 'stress' | 'sleep' | 'relationships' | 'general';
  duration?: string;
  rating: number;
  views: number;
  tags: string[];
  url?: string;
  thumbnail?: string;
}

export function ResourcesHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Understanding Anxiety: A Student\'s Guide',
      description: 'Comprehensive guide to recognizing, understanding, and managing anxiety symptoms in academic settings.',
      type: 'article',
      category: 'anxiety',
      duration: '8 min read',
      rating: 4.8,
      views: 2341,
      tags: ['anxiety', 'coping', 'academic stress'],
      url: '#'
    },
    {
      id: '2',
      title: 'Mindful Breathing for Stress Relief',
      description: 'A guided meditation session focusing on deep breathing techniques to reduce stress and promote relaxation.',
      type: 'audio',
      category: 'stress',
      duration: '10 min',
      rating: 4.9,
      views: 1876,
      tags: ['meditation', 'breathing', 'relaxation']
    },
    {
      id: '3',
      title: '5-Minute Depression Check-in Exercise',
      description: 'Quick daily exercise to help monitor mood and identify early signs of depression.',
      type: 'exercise',
      category: 'depression',
      duration: '5 min',
      rating: 4.7,
      views: 987,
      tags: ['depression', 'mood tracking', 'self-care']
    },
    {
      id: '4',
      title: 'Building Healthy Sleep Habits',
      description: 'Evidence-based strategies for improving sleep quality and establishing consistent sleep routines.',
      type: 'video',
      category: 'sleep',
      duration: '15 min',
      rating: 4.6,
      views: 3421,
      tags: ['sleep hygiene', 'insomnia', 'wellness']
    },
    {
      id: '5',
      title: 'Cognitive Behavioral Therapy Workbook',
      description: 'Interactive workbook with CBT exercises and worksheets for managing negative thought patterns.',
      type: 'tool',
      category: 'general',
      duration: 'Self-paced',
      rating: 4.9,
      views: 1534,
      tags: ['CBT', 'therapy', 'worksheets']
    },
    {
      id: '6',
      title: 'Social Connection in College',
      description: 'Tips and strategies for building meaningful relationships and combating loneliness in university.',
      type: 'article',
      category: 'relationships',
      duration: '6 min read',
      rating: 4.5,
      views: 892,
      tags: ['social skills', 'friendship', 'loneliness']
    },
    {
      id: '7',
      title: 'Progressive Muscle Relaxation',
      description: 'Guided audio session for systematic muscle relaxation to reduce physical tension and stress.',
      type: 'audio',
      category: 'stress',
      duration: '20 min',
      rating: 4.8,
      views: 2156,
      tags: ['relaxation', 'tension release', 'stress relief']
    },
    {
      id: '8',
      title: 'Recognizing Depression Warning Signs',
      description: 'Educational video about identifying early symptoms of depression and when to seek help.',
      type: 'video',
      category: 'depression',
      duration: '12 min',
      rating: 4.7,
      views: 1743,
      tags: ['depression', 'symptoms', 'mental health awareness']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories', icon: BookOpen },
    { id: 'anxiety', label: 'Anxiety', icon: Brain },
    { id: 'depression', label: 'Depression', icon: Heart },
    { id: 'stress', label: 'Stress', icon: Brain },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'relationships', label: 'Relationships', icon: Users },
    { id: 'general', label: 'General Wellness', icon: Star }
  ];

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'article', label: 'Articles' },
    { id: 'video', label: 'Videos' },
    { id: 'audio', label: 'Audio' },
    { id: 'tool', label: 'Tools' },
    { id: 'exercise', label: 'Exercises' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Headphones className="h-4 w-4" />;
      case 'tool': return <Download className="h-4 w-4" />;
      case 'exercise': return <Play className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-700';
      case 'video': return 'bg-red-100 text-red-700';
      case 'audio': return 'bg-green-100 text-green-700';
      case 'tool': return 'bg-purple-100 text-purple-700';
      case 'exercise': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const featuredResources = resources.filter(r => r.rating >= 4.8).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-gray-800">Mental Health Resources</h1>
              <p className="text-gray-600">Curated tools, articles, and exercises for your wellbeing journey</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search resources, topics, or keywords..."
                className="pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filters:</span>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Resource Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
                <CardContent className="p-0">
                  {/* Thumbnail/Header */}
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      {getTypeIcon(resource.type)}
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {/* Title and Type */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={`${getTypeColor(resource.type)} text-xs`}>
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{resource.duration}</span>
                        </div>
                      </div>
                      <h3 className="text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {resource.title}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {resource.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Stats and Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{resource.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{resource.views.toLocaleString()} views</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs px-3 py-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Access
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredResources.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-600 mb-2">No resources found</h3>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          {/* Featured Resources */}
          <div className="space-y-4">
            {featuredResources.map((resource, index) => (
              <Card key={resource.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                        {getTypeIcon(resource.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                              Featured
                            </Badge>
                            <Badge className={`${getTypeColor(resource.type)} text-xs`}>
                              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                            </Badge>
                          </div>
                          <h3 className="text-lg text-gray-800">{resource.title}</h3>
                        </div>
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm text-gray-600">{resource.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{resource.duration}</span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Access Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Help Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg text-gray-800">Need Immediate Support?</h3>
            <p className="text-gray-600 text-sm">
              If you're experiencing a mental health crisis, please don't hesitate to reach out for immediate help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                className="border-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                Crisis Hotline: 988
              </Button>
              <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white">
                Book Emergency Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}