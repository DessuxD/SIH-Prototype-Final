import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Heart,
  Brain,
  Calendar,
  Download,
  Filter,
  Eye,
  UserCheck,
  Clock,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageRating: number;
  riskDistribution: { name: string; value: number; color: string }[];
  weeklyTrends: { week: string; users: number; sessions: number; mood: number }[];
  categoryUsage: { category: string; usage: number; growth: number }[];
  departmentStats: { department: string; students: number; riskLevel: number }[];
}

export function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data - in a real app, this would come from your backend
  const dashboardData: DashboardData = {
    totalUsers: 2847,
    activeUsers: 1623,
    totalSessions: 5291,
    averageRating: 4.7,
    riskDistribution: [
      { name: 'Low Risk', value: 45, color: '#10b981' },
      { name: 'Moderate Risk', value: 35, color: '#f59e0b' },
      { name: 'High Risk', value: 15, color: '#ef4444' },
      { name: 'Critical Risk', value: 5, color: '#dc2626' }
    ],
    weeklyTrends: [
      { week: 'Week 1', users: 1200, sessions: 890, mood: 6.2 },
      { week: 'Week 2', users: 1350, sessions: 1120, mood: 6.5 },
      { week: 'Week 3', users: 1580, sessions: 1340, mood: 6.1 },
      { week: 'Week 4', users: 1623, sessions: 1456, mood: 6.3 },
    ],
    categoryUsage: [
      { category: 'Mood Tracking', usage: 78, growth: 12 },
      { category: 'AI Chat Support', usage: 65, growth: 8 },
      { category: 'Peer Forum', usage: 52, growth: 15 },
      { category: 'Resource Hub', usage: 43, growth: 5 },
      { category: 'Counselor Sessions', usage: 28, growth: 22 },
      { category: 'Wellness Surveys', usage: 34, growth: -3 }
    ],
    departmentStats: [
      { department: 'Computer Science', students: 456, riskLevel: 62 },
      { department: 'Engineering', students: 523, riskLevel: 58 },
      { department: 'Business', students: 387, riskLevel: 45 },
      { department: 'Psychology', students: 234, riskLevel: 38 },
      { department: 'Medicine', students: 189, riskLevel: 71 },
      { department: 'Arts', students: 298, riskLevel: 42 }
    ]
  };

  const timeframes = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  const departments = [
    'all',
    'Computer Science',
    'Engineering',
    'Business',
    'Psychology',
    'Medicine',
    'Arts'
  ];

  const StatCard = ({ title, value, change, icon: Icon, trend }: {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">{title}</p>
            <p className="text-2xl text-gray-800">{value}</p>
            {change !== undefined && (
              <div className={`flex items-center space-x-1 text-xs mt-1 ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend === 'up' && <ArrowUp className="h-3 w-3" />}
                {trend === 'down' && <ArrowDown className="h-3 w-3" />}
                <span>{Math.abs(change)}% from last period</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            trend === 'up' ? 'bg-green-100' : 
            trend === 'down' ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <Icon className={`h-6 w-6 ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-blue-600'
            }`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-800">Analytics Dashboard</h1>
                <p className="text-gray-600">Mental health insights and platform analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {timeframes.map(timeframe => (
                  <option key={timeframe.id} value={timeframe.id}>
                    {timeframe.label}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Registered Users"
          value={dashboardData.totalUsers.toLocaleString()}
          change={15}
          trend="up"
          icon={Users}
        />
        <StatCard
          title="Active This Week"
          value={dashboardData.activeUsers.toLocaleString()}
          change={8}
          trend="up"
          icon={UserCheck}
        />
        <StatCard
          title="Total Sessions"
          value={dashboardData.totalSessions.toLocaleString()}
          change={23}
          trend="up"
          icon={Calendar}
        />
        <StatCard
          title="Average Rating"
          value={dashboardData.averageRating}
          change={2}
          trend="up"
          icon={Star}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wellness">Wellness Insights</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Trends Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Platform Usage Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Active Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Sessions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Mental Health Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={dashboardData.riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboardData.riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Mood Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dashboardData.weeklyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.3}
                      name="Average Mood (1-10)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wellness" className="space-y-6">
          {/* Wellness Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl text-gray-800 mb-1">6.3</div>
                <p className="text-gray-600 text-sm">Average Mood Score</p>
                <Badge className="bg-green-100 text-green-700 mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.2 this week
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl text-gray-800 mb-1">23%</div>
                <p className="text-gray-600 text-sm">High Risk Students</p>
                <Badge className="bg-red-100 text-red-700 mt-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Needs attention
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl text-gray-800 mb-1">4.2</div>
                <p className="text-gray-600 text-sm">Avg. Response Time (min)</p>
                <Badge className="bg-green-100 text-green-700 mt-2">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -30s improved
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>Priority Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="text-red-800 text-sm">15 students flagged for high anxiety levels</p>
                      <p className="text-red-600 text-xs">Computer Science Department</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                    Review
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-yellow-800 text-sm">Increased stress levels during exam period</p>
                      <p className="text-yellow-600 text-xs">Campus-wide trend</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700">
                    Monitor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          {/* Feature Usage */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Feature Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.categoryUsage.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{category.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{category.usage}%</span>
                        <Badge className={`text-xs ${
                          category.growth > 0 
                            ? 'bg-green-100 text-green-700' 
                            : category.growth < 0 
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {category.growth > 0 ? '+' : ''}{category.growth}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={category.usage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage by Time */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Daily Usage Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { hour: '6AM', usage: 12 },
                  { hour: '9AM', usage: 45 },
                  { hour: '12PM', usage: 78 },
                  { hour: '3PM', usage: 92 },
                  { hour: '6PM', usage: 85 },
                  { hour: '9PM', usage: 67 },
                  { hour: '12AM', usage: 34 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          {/* Department Filter */}
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filter by department:</span>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Department Stats */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Department Mental Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.departmentStats.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-gray-800">{dept.department}</h4>
                        <Badge className={`${
                          dept.riskLevel > 60 ? 'bg-red-100 text-red-700' :
                          dept.riskLevel > 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {dept.riskLevel > 60 ? 'High Risk' :
                           dept.riskLevel > 40 ? 'Moderate Risk' : 'Low Risk'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>{dept.students} students enrolled</span>
                        <span>Risk Level: {dept.riskLevel}%</span>
                      </div>
                      <Progress value={dept.riskLevel} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}