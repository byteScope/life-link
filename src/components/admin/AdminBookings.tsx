import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Search, Filter, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AdminBookings() {
  const [searchQuery, setSearchQuery] = useState('');

  const bookings = [
    {
      id: 1,
      bookingId: 'BK-001',
      service: 'Doctor Consultation',
      user: 'John Smith',
      provider: 'Dr. Sarah Johnson',
      date: 'Nov 22, 2025',
      time: '10:00 AM',
      status: 'Confirmed',
      amount: 50,
    },
    {
      id: 2,
      bookingId: 'BK-002',
      service: 'Lab Test',
      user: 'Emily Davis',
      provider: 'MediLab Center',
      date: 'Nov 23, 2025',
      time: '2:30 PM',
      status: 'Pending',
      amount: 35,
    },
    {
      id: 3,
      bookingId: 'BK-003',
      service: 'Home Nursing',
      user: 'Michael Brown',
      provider: 'CareNurse Services',
      date: 'Nov 21, 2025',
      time: '9:00 AM',
      status: 'Completed',
      amount: 80,
    },
    {
      id: 4,
      bookingId: 'BK-004',
      service: 'Physiotherapy',
      user: 'Sarah Miller',
      provider: 'PhysioFit Center',
      date: 'Nov 20, 2025',
      time: '3:00 PM',
      status: 'Cancelled',
      amount: 60,
    },
  ];

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-gray-900 mb-2">Bookings Management</h1>
              <p className="text-gray-600">Manage all service bookings</p>
            </div>
            <Button className="rounded-xl" style={{ backgroundColor: '#1F6FB2' }}>
              Export Bookings
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="p-6 border-0 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
              <p className="text-gray-900">{bookings.length}</p>
            </Card>
            <Card className="p-6 border-0 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Confirmed</p>
              <p className="text-[#1BC47D]">
                {bookings.filter((b) => b.status === 'Confirmed').length}
              </p>
            </Card>
            <Card className="p-6 border-0 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-[#FFA500]">
                {bookings.filter((b) => b.status === 'Pending').length}
              </p>
            </Card>
            <Card className="p-6 border-0 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-[#1F6FB2]">
                {bookings.filter((b) => b.status === 'Completed').length}
              </p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8 border-0 rounded-2xl">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search bookings by ID, user, or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <Button variant="outline" className="rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </Card>

          {/* Bookings Table */}
          <Card className="border-0 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => {
                  const StatusIcon = getStatusIcon(booking.status);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <p className="text-gray-900">{booking.bookingId}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-900">{booking.service}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600">{booking.user}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600">{booking.provider}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.date}</span>
                          <span>•</span>
                          <span>{booking.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-[#1BC47D]">${booking.amount}</p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="rounded-full"
                          style={{ backgroundColor: getStatusColor(booking.status) }}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
