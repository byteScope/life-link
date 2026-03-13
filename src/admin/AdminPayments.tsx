import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
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
import { Search, Filter, CreditCard, TrendingUp, DollarSign, Download } from 'lucide-react';

export default function AdminPayments() {
  const [searchQuery, setSearchQuery] = useState('');

  const payments = [
    {
      id: 1,
      transactionId: 'TXN-001',
      user: 'John Smith',
      service: 'Doctor Consultation',
      amount: 50,
      method: 'Credit Card',
      status: 'Completed',
      date: 'Nov 21, 2025',
      time: '10:30 AM',
    },
    {
      id: 2,
      transactionId: 'TXN-002',
      user: 'Emily Davis',
      service: 'Lab Test',
      amount: 35,
      method: 'Digital Wallet',
      status: 'Pending',
      date: 'Nov 21, 2025',
      time: '11:45 AM',
    },
    {
      id: 3,
      transactionId: 'TXN-003',
      user: 'Michael Brown',
      service: 'Home Nursing',
      amount: 80,
      method: 'Bank Transfer',
      status: 'Completed',
      date: 'Nov 21, 2025',
      time: '2:15 PM',
    },
    {
      id: 4,
      transactionId: 'TXN-004',
      user: 'Sarah Miller',
      service: 'Physiotherapy',
      amount: 60,
      method: 'Credit Card',
      status: 'Failed',
      date: 'Nov 21, 2025',
      time: '3:20 PM',
    },
  ];

  const filteredPayments = payments.filter(
    (payment) =>
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#1BC47D';
      case 'Pending':
        return '#FFA500';
      case 'Failed':
        return '#FF3E30';
      default:
        return '#6B7280';
    }
  };

  const totalRevenue = payments
    .filter((p) => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-gray-900 mb-2">Payments & Transactions</h1>
              <p className="text-gray-600">Manage all payment transactions</p>
            </div>
            <Button className="rounded-xl" style={{ backgroundColor: '#9B4DFF' }}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="p-6 border-0 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#1BC47D] bg-opacity-10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#1BC47D]" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-gray-900">${totalRevenue.toLocaleString()}</p>
            </Card>
            <Card className="p-6 border-0 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#FFA500] bg-opacity-10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[#FFA500]" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
              <p className="text-gray-900">${pendingAmount}</p>
            </Card>
            <Card className="p-6 border-0 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#1F6FB2] bg-opacity-10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#1F6FB2]" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Transactions Today</p>
              <p className="text-gray-900">{payments.length}</p>
            </Card>
            <Card className="p-6 border-0 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#FF3E30] bg-opacity-10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[#FF3E30]" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Failed Payments</p>
              <p className="text-gray-900">
                {payments.filter((p) => p.status === 'Failed').length}
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
                  placeholder="Search transactions..."
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

          {/* Payments Table */}
          <Card className="border-0 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <p className="text-gray-900">{payment.transactionId}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900">{payment.user}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{payment.service}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-[#1BC47D]">${payment.amount}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{payment.method}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        <p>{payment.date}</p>
                        <p className="text-xs">{payment.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="rounded-full"
                        style={{ backgroundColor: getStatusColor(payment.status) }}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
