import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { listBookings } from '../api';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Search, Filter, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

type BookingRow = {
  id: string;
  bookingId: string;
  service: string;
  user: string;
  provider: string;
  date: string;
  time: string;
  status: string;
  amount: number;
};

export default function AdminBookings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listBookings()
      .then((list) => {
        const mapped: BookingRow[] = (list || []).map((b: { id?: string; doctor_id?: string; patient?: string; slot?: string; status?: string; [k: string]: unknown }) => {
          const slot = (b.slot ?? '').toString();
          const [datePart, timePart] = slot.split(' ');
          return {
            id: (b.id ?? '').toString(),
            bookingId: (b.id ?? '').toString(),
            service: b.doctor_id ? 'Doctor Consultation' : 'Service',
            user: (b.patient ?? '—').toString(),
            provider: (b as { provider?: string }).provider ?? 'Doctor',
            date: datePart ?? '—',
            time: timePart ?? '—',
            status: (b.status ?? 'Pending').toString(),
            amount: typeof (b as { amount?: number }).amount === 'number' ? (b as { amount: number }).amount : 0,
          };
        });
        setBookings(mapped);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

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

          {loading && <p className="text-sm text-gray-500 mb-4">Loading bookings…</p>}
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
