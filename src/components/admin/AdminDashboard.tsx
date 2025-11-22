import AdminSidebar from './AdminSidebar';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Users,
  Activity,
  DollarSign,
  TrendingUp,
  Ambulance,
  Droplet,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Users',
      value: '12,458',
      change: '+12.5%',
      icon: Users,
      color: '#1F6FB2',
    },
    {
      label: 'Active Bookings',
      value: '342',
      change: '+8.2%',
      icon: Calendar,
      color: '#1BC47D',
    },
    {
      label: 'Emergency Requests',
      value: '28',
      change: '-5.4%',
      icon: Ambulance,
      color: '#FF3E30',
    },
    {
      label: 'Revenue',
      value: '$45,890',
      change: '+18.7%',
      icon: DollarSign,
      color: '#9B4DFF',
    },
  ];

  const recentBookings = [
    {
      id: 1,
      service: 'Doctor Consultation',
      user: 'John Smith',
      provider: 'Dr. Sarah Johnson',
      date: 'Nov 22, 2025',
      status: 'Confirmed',
      amount: 50,
    },
    {
      id: 2,
      service: 'Lab Test',
      user: 'Emily Davis',
      provider: 'MediLab Center',
      date: 'Nov 22, 2025',
      status: 'Pending',
      amount: 35,
    },
    {
      id: 3,
      service: 'Home Nursing',
      user: 'Michael Brown',
      provider: 'CareNurse Services',
      date: 'Nov 21, 2025',
      status: 'Completed',
      amount: 80,
    },
  ];

  const emergencies = [
    {
      id: 1,
      type: 'Ambulance',
      user: 'Alice Johnson',
      location: '123 Main St, NY',
      status: 'In Progress',
      time: '5 mins ago',
    },
    {
      id: 2,
      type: 'Medical Help',
      user: 'Bob Wilson',
      location: '456 Oak Ave, NY',
      status: 'Dispatched',
      time: '12 mins ago',
    },
  ];

  const bloodRequests = [
    {
      id: 1,
      user: 'Sarah Miller',
      bloodGroup: 'O+',
      units: 2,
      urgency: 'Critical',
      location: '2.5 km away',
    },
    {
      id: 2,
      user: 'David Lee',
      bloodGroup: 'AB-',
      units: 1,
      urgency: 'Urgent',
      location: '5.1 km away',
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
      case 'In Progress':
        return '#FF8C42';
      case 'Dispatched':
        return '#1BC47D';
      default:
        return '#6B7280';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return '#FF3E30';
      case 'Urgent':
        return '#FF8C42';
      default:
        return '#FFA500';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back, Admin</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 border-0 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <Badge
                    className="rounded-full"
                    style={{
                      backgroundColor: stat.change.startsWith('+')
                        ? '#1BC47D'
                        : '#FF3E30',
                    }}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-gray-900">{stat.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Bookings */}
            <Card className="p-6 border-0 rounded-2xl">
              <h2 className="text-gray-900 mb-6">Recent Bookings</h2>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-gray-900 mb-1">{booking.service}</p>
                        <p className="text-sm text-gray-600">{booking.user} → {booking.provider}</p>
                      </div>
                      <Badge
                        className="rounded-full"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>{booking.date}</span>
                      <span className="text-[#1BC47D]">${booking.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Active Emergencies */}
            <Card className="p-6 border-0 rounded-2xl">
              <h2 className="text-gray-900 mb-6">Active Emergencies</h2>
              <div className="space-y-4">
                {emergencies.map((emergency) => (
                  <div
                    key={emergency.id}
                    className="p-4 bg-red-50 rounded-xl border-l-4 border-[#FF3E30]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Ambulance className="w-4 h-4 text-[#FF3E30]" />
                          <p className="text-gray-900">{emergency.type}</p>
                        </div>
                        <p className="text-sm text-gray-600">{emergency.user}</p>
                        <p className="text-sm text-gray-600">{emergency.location}</p>
                      </div>
                      <Badge
                        className="rounded-full"
                        style={{ backgroundColor: getStatusColor(emergency.status) }}
                      >
                        {emergency.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{emergency.time}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Blood Requests */}
          <Card className="p-6 border-0 rounded-2xl">
            <h2 className="text-gray-900 mb-6">Pending Blood Requests</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {bloodRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 bg-orange-50 rounded-xl border-l-4 border-[#FF8C42]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Droplet className="w-4 h-4 text-[#FF8C42]" />
                        <p className="text-gray-900">{request.bloodGroup}</p>
                        <span className="text-sm text-gray-600">• {request.units} units</span>
                      </div>
                      <p className="text-sm text-gray-600">{request.user}</p>
                      <p className="text-sm text-gray-600">{request.location}</p>
                    </div>
                    <Badge
                      className="rounded-full"
                      style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                    >
                      {request.urgency}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
