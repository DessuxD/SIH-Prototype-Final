import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Heart, 
  Share, 
  Flag,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Clock,
  Eye,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    isAnonymous: boolean;
    avatar?: string;
  };
  category: string;
  timestamp: Date;
  likes: number;
  replies: number;
  views: number;
  tags: string[];
  isLiked: boolean;
}

interface Reply {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    isAnonymous: boolean;
  };
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

export function PeerForum() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Dealing with exam anxiety - anyone else struggling?',
      content: 'Finals are coming up and I\'m feeling overwhelmed. The pressure is getting to me and I can\'t seem to focus. How do you all manage exam stress?',
      author: { id: '1', name: 'Anonymous Student', isAnonymous: true },
      category: 'Academic Stress',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 15,
      replies: 8,
      views: 127,
      tags: ['anxiety', 'exams', 'stress'],
      isLiked: false
    },
    {
      id: '2',
      title: 'Small wins worth celebrating',
      content: 'Today I managed to get out of bed, shower, and attend my morning class. It might seem small but it\'s been hard lately. Just wanted to share this positive moment.',
      author: { id: '2', name: 'MorningSunrise', isAnonymous: false },
      category: 'Positive Moments',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 42,
      replies: 12,
      views: 203,
      tags: ['depression', 'self-care', 'wins'],
      isLiked: true
    },
    {
      id: '3',
      title: 'Struggling with social connections',
      content: 'I\'ve been at university for a semester now but I still feel like I don\'t have any real friends. Everyone seems to have their groups already. Any advice on making meaningful connections?',
      author: { id: '3', name: 'Anonymous Student', isAnonymous: true },
      category: 'Social Connections',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likes: 23,
      replies: 15,
      views: 189,
      tags: ['loneliness', 'friendship', 'social'],
      isLiked: false
    }
  ]);

  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    isAnonymous: true
  });

  const categories = [
    'Academic Stress',
    'Social Connections',
    'Mental Health',
    'Positive Moments',
    'Study Tips',
    'Life Advice',
    'Support Needed'
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (newPost.title && newPost.content && newPost.category) {
      const post: Post = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        author: {
          id: 'current-user',
          name: newPost.isAnonymous ? 'Anonymous Student' : 'You',
          isAnonymous: newPost.isAnonymous
        },
        category: newPost.category,
        timestamp: new Date(),
        likes: 0,
        replies: 0,
        views: 1,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isLiked: false
      };
      
      setPosts(prev => [post, ...prev]);
      setNewPost({ title: '', content: '', category: '', tags: '', isAnonymous: true });
      setShowNewPost(false);
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 24) {
      return `${Math.floor(diffHours / 24)}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-800">Peer Support Forum</h1>
                <p className="text-gray-600">Connect, share, and support each other anonymously</p>
              </div>
            </div>
            <Button
              onClick={() => setShowNewPost(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Community Guidelines */}
      <Card className="bg-blue-50 border border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Lock className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-800 mb-1">Safe Space Guidelines</p>
              <p className="text-blue-700">
                This is a supportive, anonymous community. Be kind, respectful, and supportive. 
                No medical advice, personal attacks, or harmful content. Report inappropriate posts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts, topics, or keywords..."
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg"
            >
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Create New Post</span>
                    <button
                      onClick={() => setShowNewPost(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">Title</label>
                    <Input
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="What's on your mind?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">Category</label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">Content</label>
                    <Textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your thoughts, experiences, or ask for support..."
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">Tags (optional)</label>
                    <Input
                      value={newPost.tags}
                      onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="anxiety, stress, help (comma-separated)"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={newPost.isAnonymous}
                      onChange={(e) => setNewPost(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-700">
                      Post anonymously
                    </label>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewPost(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      disabled={!newPost.title || !newPost.content || !newPost.category}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                    >
                      Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Post Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        {post.author.isAnonymous ? '?' : post.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-gray-800">{post.author.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{getTimeAgo(post.timestamp)}</span>
                        </div>
                      </div>
                      <h3 className="text-lg text-gray-800 mb-2">{post.title}</h3>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Post Content */}
                <div className="pl-13">
                  <p className="text-gray-700 leading-relaxed mb-3">{post.content}</p>
                  
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-1 text-sm transition-colors ${
                          post.isLiked 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button
                        onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.replies}</span>
                      </button>
                      
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Eye className="h-3 w-3" />
                      <span>{post.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredPosts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">No posts found</h3>
              <p className="text-gray-500 text-sm">
                Try adjusting your search or be the first to start a conversation!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}