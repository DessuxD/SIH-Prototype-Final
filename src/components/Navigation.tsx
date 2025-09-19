import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { LanguageSelector } from './LanguageSelector';
import { 
  Home, 
  MessageCircle, 
  Heart, 
  ClipboardList, 
  BookOpen, 
  Users, 
  Calendar,
  BarChart3,
  Menu,
  User,
  LogIn,
  UserPlus,
  Globe
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { PageType, AuthModalType } from '../App';

interface NavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onShowAuth: (type: AuthModalType) => void;
}

export function Navigation({ currentPage, onNavigate, onShowAuth }: NavigationProps) {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const publicNavItems = [
    { id: 'home' as PageType, label: t('navigation.home'), icon: Home },
    { id: 'resources' as PageType, label: t('navigation.resources'), icon: BookOpen },
  ];

  const authenticatedNavItems = [
    { id: 'home' as PageType, label: t('navigation.home'), icon: Home },
    { id: 'chat' as PageType, label: t('navigation.chat'), icon: MessageCircle },
    { id: 'mood' as PageType, label: t('navigation.mood'), icon: Heart },
    { id: 'survey' as PageType, label: t('navigation.survey'), icon: ClipboardList },
    { id: 'resources' as PageType, label: t('navigation.resources'), icon: BookOpen },
    { id: 'forum' as PageType, label: t('navigation.forum'), icon: Users },
    { id: 'booking' as PageType, label: t('navigation.booking'), icon: Calendar },
    { id: 'dashboard' as PageType, label: t('navigation.dashboard'), icon: BarChart3 },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  const NavContent = () => (
    <div className="flex flex-col space-y-2 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={currentPage === item.id ? "default" : "ghost"}
            onClick={() => onNavigate(item.id)}
            className={`justify-start h-12 ${
              currentPage === item.id 
                ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm" 
                : "hover:bg-blue-50/50 text-gray-600 hover:text-blue-600"
            }`}
          >
            <Icon className="mr-3 h-5 w-5" />
            {item.label}
          </Button>
        );
      })}
      
      {/* Mobile Auth Section */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        {isAuthenticated ? (
          <div className="space-y-2">
            <Button
              variant={currentPage === 'profile' ? "default" : "ghost"}
              onClick={() => onNavigate('profile')}
              className={`justify-start h-12 w-full ${
                currentPage === 'profile'
                  ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm" 
                  : "hover:bg-blue-50/50 text-gray-600 hover:text-blue-600"
              }`}
            >
              <Avatar className="w-5 h-5 mr-3">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  {user?.firstName[0]}{user?.lastName[0]}
                </AvatarFallback>
              </Avatar>
              Profile
            </Button>
            <div className="px-4 py-2">
              <p className="text-sm text-gray-600">Signed in as</p>
              <p className="text-sm text-gray-800">{user?.firstName} {user?.lastName}</p>
              <Badge variant="secondary" className="bg-green-100 text-green-700 mt-1">
                {user?.year} Student
              </Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => onShowAuth('login')}
              className="justify-start h-12 w-full hover:bg-blue-50/50 text-gray-600 hover:text-blue-600"
            >
              <LogIn className="mr-3 h-5 w-5" />
              Sign In
            </Button>
            <Button
              onClick={() => onShowAuth('signup')}
              className="justify-start h-12 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <UserPlus className="mr-3 h-5 w-5" />
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl text-gray-800">MindSupport</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    onClick={() => onNavigate(item.id)}
                    className={`h-10 px-4 ${
                      currentPage === item.id 
                        ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700" 
                        : "hover:bg-blue-50/50 text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
              
              {/* Language Selector */}
              <div className="ml-2">
                <LanguageSelector compact={true} showLocationDetection={false} />
              </div>
              
              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  <Button
                    variant={currentPage === 'profile' ? "default" : "ghost"}
                    onClick={() => onNavigate('profile')}
                    className={`h-10 px-3 ${
                      currentPage === 'profile'
                        ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700" 
                        : "hover:bg-blue-50/50 text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {user?.firstName[0]}{user?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    Profile
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={() => onShowAuth('login')}
                    className="h-10 px-4 hover:bg-blue-50/50 text-gray-600 hover:text-blue-600"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  <Button
                    onClick={() => onShowAuth('signup')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-10 px-4"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xl text-gray-800">MindSupport</span>
                  </div>
                  <NavContent />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}