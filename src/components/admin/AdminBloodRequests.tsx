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
import { Search, Filter, Droplet, MapPin, Clock, Users } from 'lucide-react';

export default function AdminBloodRequests() {
  const [searchQuery, setSearchQuery] = useState('');

  const bloodRequests = [
    {
      id: 1,
      requestId: 'BR-001',
      user: 'Sarah Miller',
      bloodGroup: 'O+',
      units: 2,
      urgency: 'Critical',
      location: '2.5 km away',
      phone: '+1 (555) 111-2222',
      status: 'Matched',
      donors: 3,
      time: '10 mins ago',
    },
    {
      id: 2,
      requestId: 'BR-002',
      user: 'David Lee',
      bloodGroup: 'AB-',
      units: 1,
      urgency: 'Urgent',
      location: '5.1 km away',
      phone: '+1 (555) 333-4444',
      status: 'Searching',
      donors: 1,
      time: '25 mins ago',
    },
    {
      id: 3,
      requestId: 'BR-003',
      user: 'Lisa Wang',
      bloodGroup: 'A+',
      units: 3,
      urgency: 'Normal',
      location: '3.8 km away',
      phone: '+1 (555) 555-6666',
      status: 'Completed',
      donors: 5,
      time: '2 hours ago',
    },
    {
      id: 4,
      requestId: 'BR-004',
      user: 'James Brown',
      bloodGroup: 'B+',
      units: 1,
      urgency: 'Urgent',
      location: '1.2 km away',
      phone: '+1 (555) 777-8888',
      status: 'Matched',
      donors: 2,
      time: '5 mins ago',
    },
  ];

  const filteredRequests = bloodRequests.filter(
    (request) =>
      request.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return '#FF3E30';
      case 'Urgent':
        return '#FF8C42';
      case 'Normal':
        return '#1BC47D';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Searching':
        return '#FFA500';
      case 'Matched':
        return '#1BC47D';
      case 'Completed':
        return '#1F6FB2';
      default:
        return '#6B7280';
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
              <h1 className="text-gray-900 mb-2">Blood Requests Management</h1>
              <p className="text-gray-600">Manage blood donation requests</p>
            </div>
            <Button className="rounded-xl" style={{ backgroundColor: '#FF8C42' }}>
              <Droplet className="w-4 h-4 mr-2" />
              Donor Database
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="p-6 border-0 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Active Requests</p>
              <p className="text-[#FF8C42]">
                {bloodRequests.filter((r) => r.status !== 'Completed').length}
              </p>
            </Card>
            <Card className="p-6 border-0 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Critical</p>
              <p className="text-[#FF3E30]">
                {bloodRequests.filter((r) => r.urgency === 'Critical').length}
              </p>
            </Card>
            <Card className="p-6 border-0 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Matched</p>
              <p className="text-[#1BC47D]">
                {bloodRequests.filter((r) => r.status === 'Matched').length}
              </p>
            </Card>
            <Card className="p-6 border-0 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Completed Today</p>
              <p className="text-[#1F6FB2]">
                {bloodRequests.filter((r) => r.status === 'Completed').length}
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
                  placeholder="Search blood requests..."
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

          {/* Blood Requests Table */}
          <Card className="border-0 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Donors</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <p className="text-gray-900">{request.requestId}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900">{request.user}</p>
                        <p className="text-xs text-gray-500">{request.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-[#FF8C42]" />
                        <span>{request.bloodGroup}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{request.units}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="rounded-full"
                        style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                      >
                        {request.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{request.donors}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="rounded-full"
                        style={{ backgroundColor: getStatusColor(request.status) }}
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{request.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          View
                        </Button>
                        {request.status === 'Searching' && (
                          <Button
                            size="sm"
                            className="rounded-lg"
                            style={{ backgroundColor: '#FF8C42' }}
                          >
                            Find Donors
                          </Button>
                        )}
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
