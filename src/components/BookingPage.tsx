import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Calendar } from './ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin,
  Video,
  Phone,
  Star,
  CheckCircle,
  AlertCircle,
  Users,
  GraduationCap,
  Heart,
  Brain,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';

interface Counselor {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  rating: number;
  reviews: number;
  experience: string;
  avatar?: string;
  availability: 'high' | 'medium' | 'low';
  sessionTypes: ('in-person' | 'video' | 'phone')[];
  bio: string;
  nextAvailable: Date;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Appointment {
  id: string;
  counselorId: string;
  date: Date;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  notes: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export function BookingPage() {
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionType, setSessionType] = useState<'in-person' | 'video' | 'phone'>('video');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [filterSpecialization, setFilterSpecialization] = useState('all');

  const counselors: Counselor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Mitchell',
      title: 'Licensed Clinical Psychologist',
      specializations: ['Anxiety', 'Depression', 'Academic Stress'],
      rating: 4.9,
      reviews: 127,
      experience: '8 years',
      availability: 'high',
      sessionTypes: ['in-person', 'video', 'phone'],
      bio: 'Specialized in cognitive behavioral therapy with extensive experience helping students navigate academic pressures and mental health challenges.',
      nextAvailable: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      title: 'Licensed Professional Counselor',
      specializations: ['Stress Management', 'Relationship Issues', 'Life Transitions'],
      rating: 4.8,
      reviews: 89,
      experience: '12 years',
      availability: 'medium',
      sessionTypes: ['video', 'phone'],
      bio: 'Focuses on solution-focused therapy and mindfulness-based approaches to help students develop healthy coping strategies.',
      nextAvailable: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      title: 'Clinical Social Worker',
      specializations: ['Trauma', 'PTSD', 'Social Anxiety'],
      rating: 4.7,
      reviews: 156,
      experience: '10 years',
      availability: 'low',
      sessionTypes: ['in-person', 'video'],
      bio: 'Specializes in trauma-informed care and evidence-based treatments for anxiety disorders, particularly in young adult populations.',
      nextAvailable: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      title: 'Psychiatrist',
      specializations: ['Medication Management', 'Bipolar Disorder', 'ADHD'],
      rating: 4.9,
      reviews: 203,
      experience: '15 years',
      availability: 'medium',
      sessionTypes: ['in-person', 'video'],
      bio: 'Board-certified psychiatrist with expertise in psychopharmacology and integrated treatment approaches for complex mental health conditions.',
      nextAvailable: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  ];

  const timeSlots: TimeSlot[] = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '12:00 PM', available: true },
    { time: '01:00 PM', available: false },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: false },
    { time: '05:00 PM', available: true },
  ];

  const specializations = ['all', 'Anxiety', 'Depression', 'Academic Stress', 'Stress Management', 'Relationship Issues', 'Trauma', 'PTSD', 'Social Anxiety', 'Medication Management', 'Bipolar Disorder', 'ADHD'];

  const filteredCounselors = counselors.filter(counselor => {
    if (filterSpecialization === 'all') return true;
    return counselor.specializations.includes(filterSpecialization);
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'high': return 'Available Soon';
      case 'medium': return 'Limited Availability';
      case 'low': return 'Booking Full';
      default: return 'Unknown';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person': return <MapPin className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const handleBookAppointment = () => {
    if (selectedCounselor && selectedDate && selectedTime) {
      // In a real app, this would make an API call
      alert('Appointment booked successfully! You will receive a confirmation email shortly.');
      setShowBookingForm(false);
      setSelectedCounselor(null);
      setSelectedTime('');
      setAppointmentNotes('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-gray-800">Book Counseling Session</h1>
              <p className="text-gray-600">Connect with licensed mental health professionals</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Important Notice */}
      <Card className="bg-blue-50 border border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-800 mb-1">Important Information</p>
              <p className="text-blue-700">
                All counselors are licensed professionals. Sessions are confidential and covered by student health services. 
                For crisis situations, please contact emergency services or call 988.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter by specialization:</span>
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec === 'all' ? 'All Specializations' : spec}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {!showBookingForm ? (
        /* Counselor Selection */
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCounselors.map((counselor) => (
            <Card key={counselor.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Counselor Header */}
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                        {counselor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-800">{counselor.name}</h3>
                      <p className="text-gray-600 text-sm">{counselor.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{counselor.rating}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{counselor.reviews} reviews</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{counselor.experience} experience</span>
                      </div>
                    </div>
                    <Badge className={getAvailabilityColor(counselor.availability)}>
                      {getAvailabilityText(counselor.availability)}
                    </Badge>
                  </div>
                  
                  {/* Specializations */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Specializations:</p>
                    <div className="flex flex-wrap gap-1">
                      {counselor.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {counselor.bio}
                  </p>
                  
                  {/* Session Types */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Available session types:</p>
                    <div className="flex space-x-2">
                      {counselor.sessionTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <span className="mr-1">{getSessionTypeIcon(type)}</span>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Next Available */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      Next available: {counselor.nextAvailable.toLocaleDateString()}
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedCounselor(counselor.id);
                        setShowBookingForm(true);
                      }}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                    >
                      Book Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Booking Form */
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Selected Counselor Info */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Booking With</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const counselor = counselors.find(c => c.id === selectedCounselor);
                  if (!counselor) return null;
                  
                  return (
                    <>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {counselor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-gray-800">{counselor.name}</h4>
                          <p className="text-sm text-gray-600">{counselor.title}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Specializations:</p>
                        <div className="flex flex-wrap gap-1">
                          {counselor.specializations.map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {selectedDate && selectedTime && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-green-800 text-sm mb-1">Selected Appointment</p>
                          <div className="space-y-1 text-green-700 text-sm">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{selectedDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{selectedTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {getSessionTypeIcon(sessionType)}
                              <span>{sessionType.charAt(0).toUpperCase() + sessionType.slice(1).replace('-', ' ')}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Type Selection */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Select Session Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {(['in-person', 'video', 'phone'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSessionType(type)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        sessionType === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {getSessionTypeIcon(type)}
                        <span className="text-sm capitalize">
                          {type.replace('-', ' ')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Date Selection */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date < new Date(Date.now() + 24 * 60 * 60 * 1000)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            {/* Time Selection */}
            {selectedDate && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Select Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 border-2 rounded-lg text-center transition-all ${
                          selectedTime === slot.time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : slot.available
                            ? 'border-gray-200 hover:border-gray-300'
                            : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Additional Notes */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Additional Information (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  placeholder="Please share any specific topics you'd like to discuss or any additional information that might be helpful for your session..."
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This information is confidential and will only be shared with your counselor.
                </p>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1"
                  >
                    Back to Counselors
                  </Button>
                  <Button
                    onClick={handleBookAppointment}
                    disabled={!selectedTime}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}