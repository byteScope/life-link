import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Heart,
  Bell,
  Lock,
  LogOut,
  Edit2,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function Profile() {
  const [editMode, setEditMode] = useState(false);

  const userInfo = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Healthcare Plaza, Medical District, NY 10001',
    dateOfBirth: '1985-06-15',
    bloodGroup: 'O+',
    emergencyContact: '+1 (555) 987-6543',
  };

  const bookingHistory = [
    {
      id: 1,
      service: 'Doctor Consultation',
      provider: 'Dr. Sarah Johnson',
      date: 'Nov 22, 2025',
      time: '10:00 AM',
      status: 'Confirmed',
      amount: 50,
    },
    {
      id: 2,
      service: 'Lab Test',
      provider: 'MediLab Center',
      date: 'Nov 23, 2025',
      time: '2:30 PM',
      status: 'Pending',
      amount: 35,
    },
    {
      id: 3,
      service: 'Home Nursing',
      provider: 'CareNurse Services',
      date: 'Nov 15, 2025',
      time: '9:00 AM',
      status: 'Completed',
      amount: 80,
    },
    {
      id: 4,
      service: 'Physiotherapy',
      provider: 'PhysioFit Center',
      date: 'Nov 10, 2025',
      time: '3:00 PM',
      status: 'Completed',
      amount: 60,
    },
  ];

  const medicalRecords = [
    {
      id: 1,
      title: 'Blood Test Results',
      date: 'Nov 15, 2025',
      type: 'Lab Report',
    },
    {
      id: 2,
      title: 'X-Ray Chest',
      date: 'Oct 20, 2025',
      type: 'Imaging',
    },
    {
      id: 3,
      title: 'Prescription - Dr. Johnson',
      date: 'Oct 5, 2025',
      type: 'Prescription',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return '#1BC47D';
      case 'Pending':
        return '#FFA500';
      case 'Completed':
        return '#1F6FB2';
      case 'Cancelled':
        return '#FF3E30';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return CheckCircle;
      case 'Pending':
        return Clock;
      case 'Completed':
        return CheckCircle;
      case 'Cancelled':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="p-6 mb-8 border-0 rounded-2xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#1F6FB2] to-[#1BC47D] rounded-2xl flex items-center justify-center text-white flex-shrink-0">
              <User className="w-12 h-12" />
            </div>
            <div className="flex-1">
              <h1 className="text-gray-900 mb-2">{userInfo.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {userInfo.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {userInfo.phone}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-[#FF8C42]" />
                  Blood Group: {userInfo.bloodGroup}
                </div>
              </div>
            </div>
            <Button
              onClick={() => setEditMode(!editMode)}
              className="rounded-xl"
              style={{ backgroundColor: '#1F6FB2' }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="medical">Medical Records</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card className="p-6 border-0 rounded-2xl">
              <h2 className="text-gray-900 mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    defaultValue={userInfo.name}
                    disabled={!editMode}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    defaultValue={userInfo.email}
                    disabled={!editMode}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    defaultValue={userInfo.phone}
                    disabled={!editMode}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    defaultValue={userInfo.dateOfBirth}
                    disabled={!editMode}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Input
                    type="text"
                    defaultValue={userInfo.bloodGroup}
                    disabled={!editMode}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact</Label>
                  <Input
                    type="tel"
                    defaultValue={userInfo.emergencyContact}
                    disabled={!editMode}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Input
                    type="text"
                    defaultValue={userInfo.address}
                    disabled={!editMode}
                    className="rounded-xl"
                  />
                </div>
              </div>
              {editMode && (
                <div className="flex gap-3 mt-6">
                  <Button
                    className="rounded-xl"
                    style={{ backgroundColor: '#1BC47D' }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(false)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Booking History */}
          <TabsContent value="bookings">
            <Card className="p-6 border-0 rounded-2xl">
              <h2 className="text-gray-900 mb-6">Booking History</h2>
              <div className="space-y-4">
                {bookingHistory.map((booking) => {
                  const StatusIcon = getStatusIcon(booking.status);
                  return (
                    <div
                      key={booking.id}
                      className="p-4 bg-gray-50 rounded-xl flex flex-col sm:flex-row justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="mb-1">{booking.service}</h3>
                            <p className="text-sm text-gray-600">{booking.provider}</p>
                          </div>
                          <Badge
                            className="rounded-full"
                            style={{ backgroundColor: getStatusColor(booking.status) }}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {booking.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="text-[#1BC47D]">${booking.amount}</p>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl">
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Medical Records */}
          <TabsContent value="medical">
            <Card className="p-6 border-0 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-900">Medical Records</h2>
                <Button className="rounded-xl" style={{ backgroundColor: '#1F6FB2' }}>
                  Upload Document
                </Button>
              </div>
              <div className="space-y-3">
                {medicalRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1F6FB2] bg-opacity-10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#1F6FB2]" />
                      </div>
                      <div>
                        <p className="text-gray-900">{record.title}</p>
                        <div className="flex gap-3 text-sm text-gray-600">
                          <span>{record.date}</span>
                          <span>•</span>
                          <span>{record.type}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="p-6 border-0 rounded-2xl">
                <h2 className="text-gray-900 mb-6">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-[#1F6FB2]" />
                      <div>
                        <p className="text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-600">Receive push notifications</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#1F6FB2]" />
                      <div>
                        <p className="text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive email updates</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-0 rounded-2xl">
                <h2 className="text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Lock className="w-5 h-5 mr-3" />
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl text-[#FF3E30] border-[#FF3E30] hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
