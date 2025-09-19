import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap,
  Calendar,
  Shield,
  Bell,
  Eye,
  Heart,
  Settings,
  Save,
  Edit,
  Camera,
  LogOut,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';

export function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  if (!user) return null;

  const handleSave = async () => {
    const result = await updateProfile(editData);
    if (result.success) {
      setIsEditing(false);
      // In a real app, show success toast
      alert('Profile updated successfully!');
    } else {
      alert(result.error || 'Failed to update profile');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferencesChange = (field: string, value: boolean) => {
    setEditData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const getInitials = () => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const calculateAge = () => {
    const birthDate = new Date(user.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getMembershipDuration = () => {
    const joinDate = new Date(user.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl text-gray-800">{user.firstName} {user.lastName}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <GraduationCap className="mr-1 h-3 w-3" />
                  {user.year} Student
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Member for {getMembershipDuration()}
                </Badge>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              <Button
                variant="outline"
                onClick={logout}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="academic">Academic Details</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-500" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={editData.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-800 p-2 bg-gray-50 rounded">{user.firstName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={editData.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-800 p-2 bg-gray-50 rounded">{user.lastName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-800">{user.email}</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Verified</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editData.phoneNumber || ''}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-800 p-2 bg-gray-50 rounded">{user.phoneNumber || 'Not provided'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-800">{new Date(user.dateOfBirth).toLocaleDateString()} ({calculateAge()} years old)</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {user.emergencyContact && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                  <h4 className="text-blue-800">Emergency Contact</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm text-blue-600">Name</Label>
                      {isEditing ? (
                        <Input
                          value={editData.emergencyContact?.name || ''}
                          onChange={(e) => handleInputChange('emergencyContact', {
                            ...editData.emergencyContact,
                            name: e.target.value
                          })}
                        />
                      ) : (
                        <p className="text-blue-800">{user.emergencyContact.name}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm text-blue-600">Phone</Label>
                      {isEditing ? (
                        <Input
                          value={editData.emergencyContact?.phone || ''}
                          onChange={(e) => handleInputChange('emergencyContact', {
                            ...editData.emergencyContact,
                            phone: e.target.value
                          })}
                        />
                      ) : (
                        <p className="text-blue-800">{user.emergencyContact.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm text-blue-600">Relationship</Label>
                      {isEditing ? (
                        <Select
                          value={editData.emergencyContact?.relationship || ''}
                          onValueChange={(value) => handleInputChange('emergencyContact', {
                            ...editData.emergencyContact,
                            relationship: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['Parent', 'Sibling', 'Spouse', 'Friend', 'Guardian', 'Other'].map((rel) => (
                              <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-blue-800">{user.emergencyContact.relationship}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Details */}
        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-purple-500" />
                <span>Academic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  {isEditing ? (
                    <Select
                      value={editData.university || ''}
                      onValueChange={(value) => handleInputChange('university', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['University of Technology', 'State University', 'Metropolitan College', 'National Institute of Technology', 'City University', 'Regional University'].map((uni) => (
                          <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-800 p-2 bg-gray-50 rounded">{user.university}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  {isEditing ? (
                    <Select
                      value={editData.department || ''}
                      onValueChange={(value) => handleInputChange('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['Computer Science', 'Engineering', 'Business Administration', 'Psychology', 'Medicine', 'Arts and Humanities', 'Natural Sciences', 'Social Sciences'].map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-800 p-2 bg-gray-50 rounded">{user.department}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Academic Year</Label>
                  {isEditing ? (
                    <Select
                      value={editData.year || ''}
                      onValueChange={(value) => handleInputChange('year', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'PhD'].map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-800 p-2 bg-gray-50 rounded">{user.year}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <p className="text-gray-800 p-2 bg-gray-50 rounded">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-purple-500 hover:bg-purple-600 text-white">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-green-500" />
                <span>Privacy & Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="text-gray-800">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive wellness reminders and updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={user.preferences.notifications}
                    onCheckedChange={(checked) => handlePreferencesChange('notifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="text-gray-800">Anonymous Mode</h4>
                      <p className="text-sm text-gray-600">Hide your identity in forum posts and discussions</p>
                    </div>
                  </div>
                  <Switch
                    checked={user.preferences.anonymousMode}
                    onCheckedChange={(checked) => handlePreferencesChange('anonymousMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="text-gray-800">Data Sharing for Research</h4>
                      <p className="text-sm text-gray-600">Help improve mental health services (anonymized data only)</p>
                    </div>
                  </div>
                  <Switch
                    checked={user.preferences.dataSharing}
                    onCheckedChange={(checked) => handlePreferencesChange('dataSharing', checked)}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-blue-800 mb-1">Your Privacy Matters</p>
                    <p className="text-blue-700">
                      All data is encrypted and stored securely. We never share personal information 
                      without your explicit consent. You can download or delete your data at any time.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-500" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Download My Data
                </Button>
                
                <Button 
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" 
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-gray-800 mb-2">Account Activity</h4>
                <p className="text-sm text-gray-600 mb-2">Last login: {new Date(user.lastLogin).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Account created: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Delete Account Confirmation */}
          {showDeleteConfirm && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-red-800 mb-2">Delete Account</h4>
                    <p className="text-red-700 mb-4">
                      This action cannot be undone. All your data including mood logs, chat history, 
                      and profile information will be permanently deleted.
                    </p>
                    <div className="flex space-x-3">
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          // In a real app, implement account deletion
                          alert('Account deletion would be implemented here');
                          setShowDeleteConfirm(false);
                        }}
                      >
                        Yes, Delete My Account
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}