import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { listBookings, clearAuthStorage } from '../api';
import { getProfile, updateProfile, getStoredUser, AUTH_USER_KEY, type UserProfile, type UpdateProfileBody } from '../api/auth';
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

/** Format date from API (YYYY-MM-DD or ISO string) for input[type=date]. */
function toDateValue(v: string | undefined | null): string {
  if (!v) return '';
  const d = v.split('T')[0];
  return d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '';
}

export default function Profile() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [bookingHistory, setBookingHistory] = useState<Array<{
    id: string;
    service: string;
    provider: string;
    date: string;
    time: string;
    status: string;
    amount: number;
  }>>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    setProfileLoading(true);
    setProfileError(null);
    getProfile()
      .then((data) => setProfile(data))
      .catch(() => {
        const stored = getStoredUser();
        if (stored) setProfile(stored as UserProfile);
        else setProfileError('Could not load profile');
      })
      .finally(() => setProfileLoading(false));
  }, []);

  useEffect(() => {
    setBookingsLoading(true);
    listBookings()
      .then((list) => {
        const mapped = (list || []).map((b: { id?: string; doctor_id?: string; provider_id?: string; patient?: string; provider?: string; slot?: string; status?: string; [k: string]: unknown }) => {
          const slot = (b.slot ?? '').toString();
          const [datePart, timePart] = slot.split(' ');
          return {
            id: (b.id ?? '').toString(),
            service: b.doctor_id ? 'Doctor Consultation' : 'Service',
            provider: (b as { provider?: string }).provider ?? (b.doctor_id ? 'Doctor' : 'Provider'),
            date: datePart ?? '—',
            time: timePart ?? '—',
            status: (b.status ?? 'Pending').toString(),
            amount: typeof (b as { amount?: number }).amount === 'number' ? (b as { amount: number }).amount : 0,
          };
        });
        setBookingHistory(mapped);
      })
      .catch(() => setBookingHistory([]))
      .finally(() => setBookingsLoading(false));
  }, []);

  const handleLogout = () => {
    clearAuthStorage();
    localStorage.removeItem('lifelink_admin');
    window.dispatchEvent(new Event('lifelink_logout'));
    navigate('/login');
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim();
    const gender = (form.querySelector('[name="gender"]') as HTMLSelectElement | HTMLInputElement)?.value?.trim();
    const date_of_birth = (form.querySelector('[name="date_of_birth"]') as HTMLInputElement)?.value?.trim();
    const state = (form.querySelector('[name="state"]') as HTMLInputElement)?.value?.trim();
    const blood_group = (form.querySelector('[name="blood_group"]') as HTMLInputElement)?.value?.trim();
    const emergency_contact_number = (form.querySelector('[name="emergency_contact_number"]') as HTMLInputElement)?.value?.trim();
    if (!name || !gender) {
      setProfileError('Name and gender are required');
      return;
    }
    setSaving(true);
    setProfileError(null);
    try {
      const body: UpdateProfileBody = { name, gender, date_of_birth: date_of_birth || undefined, address: state || undefined, state: state || undefined, blood_group: blood_group || undefined, emergency_contact_number: emergency_contact_number || undefined };
      const updated = await updateProfile(body);
      setProfile(updated);
      const stored = getStoredUser();
      if (stored) {
        try {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ ...stored, ...updated }));
        } catch {
          // ignore
        }
      }
      setEditMode(false);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const userInfo = {
    name: profile?.name ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
    address: profile?.state ?? '',
    dateOfBirth: toDateValue(profile?.date_of_birth),
    bloodGroup: profile?.blood_group ?? '',
    emergencyContact: profile?.emergency_contact_number ?? '',
  };

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
          {profileLoading && <p className="text-sm text-gray-500 mb-4">Loading profile…</p>}
          {profileError && <p className="text-sm text-red-600 mb-4" role="alert">{profileError}</p>}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#1F6FB2] to-[#1BC47D] rounded-2xl flex items-center justify-center text-white flex-shrink-0">
              <User className="w-12 h-12" />
            </div>
            <div className="flex-1">
              <h1 className="text-gray-900 mb-2">{userInfo.name || 'Profile'}</h1>
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
            <div className="flex gap-2">
              <Button
                onClick={() => setEditMode(!editMode)}
                className="rounded-xl"
                style={{ backgroundColor: '#1F6FB2' }}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
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
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input
                      id="profile-name"
                      name="name"
                      type="text"
                      defaultValue={userInfo.name}
                      disabled={!editMode}
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-gender">Gender</Label>
                    <select
                      id="profile-gender"
                      name="gender"
                      defaultValue={profile?.gender ?? 'other'}
                      disabled={!editMode}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non_binary">Non-binary</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={userInfo.email}
                      disabled
                      className="rounded-xl bg-gray-50"
                      title="From login; update not supported here"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      value={userInfo.phone}
                      disabled
                      className="rounded-xl bg-gray-50"
                      title="From login"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-dob">Date of Birth</Label>
                    <Input
                      id="profile-dob"
                      name="date_of_birth"
                      type="date"
                      defaultValue={userInfo.dateOfBirth}
                      disabled={!editMode}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-blood">Blood Group</Label>
                    <Input
                      id="profile-blood"
                      name="blood_group"
                      type="text"
                      defaultValue={userInfo.bloodGroup}
                      disabled={!editMode}
                      placeholder="e.g. O+"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-emergency">Emergency Contact</Label>
                    <Input
                      id="profile-emergency"
                      name="emergency_contact_number"
                      type="tel"
                      defaultValue={userInfo.emergencyContact}
                      disabled={!editMode}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="profile-state">State / Address</Label>
                    <Input
                      id="profile-state"
                      name="state"
                      type="text"
                      defaultValue={userInfo.address}
                      disabled={!editMode}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                {editMode && (
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl"
                      style={{ backgroundColor: '#1BC47D' }}
                    >
                      {saving ? 'Saving…' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditMode(false)}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </Card>
          </TabsContent>

          {/* Booking History */}
          <TabsContent value="bookings">
            <Card className="p-6 border-0 rounded-2xl">
              <h2 className="text-gray-900 mb-6">Booking History</h2>
              {bookingsLoading && <p className="text-sm text-gray-500 mb-4">Loading bookings…</p>}
              <div className="space-y-4">
                {bookingHistory.length === 0 && !bookingsLoading && (
                  <p className="text-gray-500">No bookings yet. Book a doctor from the Doctors page.</p>
                )}
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
