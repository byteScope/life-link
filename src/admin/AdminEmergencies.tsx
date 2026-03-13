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
import { Search, Filter, Ambulance, AlertTriangle, MapPin, Clock } from 'lucide-react';

export default function AdminEmergencies() {
  const [searchQuery, setSearchQuery] = useState('');

  const emergencies = [
    {
      id: 1,
      requestId: 'ER-001',
      type: 'Ambulance',
      user: 'Alice Johnson',
      location: '123 Main St, NY',
      phone: '+1 (555) 111-2222',
      status: 'In Progress',
      priority: 'Critical',
      time: '5 mins ago',
    },
    {
      id: 2,
      requestId: 'ER-002',
      type: 'Medical Help',
      user: 'Bob Wilson',
      location: '456 Oak Ave, NY',
      phone: '+1 (555) 333-4444',
      status: 'Dispatched',
      priority: 'High',
      time: '12 mins ago',
    },
    {
      id: 3,
      requestId: 'ER-003',
      type: 'Fire Service',
      user: 'Carol Davis',
      location: '789 Pine Rd, NY',
      phone: '+1 (555) 555-6666',
      status: 'Resolved',
      priority: 'Critical',
      time: '1 hour ago',
    },
    {
      id: 4,
      requestId: 'ER-004',
      type: 'Ambulance',
      user: 'David Lee',
      location: '321 Elm St, NY',
      phone: '+1 (555) 777-8888',
      status: 'Pending',
      priority: 'Medium',
      time: '2 mins ago',
    },
  ];

  const filteredEmergencies = emergencies.filter(
    (emergency) =>
      emergency.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#FFA500';
      case 'Dispatched':
        return '#1BC47D';
      case 'In Progress':
        return '#FF8C42';
      case 'Resolved':
        return '#1F6FB2';
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return '#FF3E30';
      case 'High':
        return '#FF8C42';
      case 'Medium':
        return '#FFA500';
      default:
        return '#1BC47D';
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
              <h1 className="text-gray-900 mb-2">Emergency Management</h1>
              <p className="text-gray-600">Track and manage emergency requests</p>
            </div>
            <Button className="rounded-xl" style={{ backgroundColor: '#FF3E30' }}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              View Map
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="p-6 border-0 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Active Emergencies</p>
              <p className="text-[#FF3E30]">
                {emergencies.filter((e) => e.status === 'In Progress' || e.status === 'Pending').length}
              </p>
            </Card>
            <Card className="p-6 border-0 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Dispatched</p>
              <p className="text-[#1BC47D]">
                {emergencies.filter((e) => e.status === 'Dispatched').length}
              </p>
            </Card>
            <Card className="p-6 border-0 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Resolved Today</p>
              <p className="text-[#1F6FB2]">
                {emergencies.filter((e) => e.status === 'Resolved').length}
              </p>
            </Card>
            <Card className="p-6 border-0 rounded-2xl">
              <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
              <p className="text-gray-900">4.2 min</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8 border-0 rounded-2xl">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search emergency requests..."
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

          {/* Emergencies Table */}
          <Card className="border-0 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmergencies.map((emergency) => (
                  <TableRow key={emergency.id}>
                    <TableCell>
                      <p className="text-gray-900">{emergency.requestId}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Ambulance className="w-4 h-4 text-[#FF3E30]" />
                        <span className="text-sm">{emergency.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900">{emergency.user}</p>
                        <p className="text-xs text-gray-500">{emergency.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{emergency.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="rounded-full"
                        style={{ backgroundColor: getPriorityColor(emergency.priority) }}
                      >
                        {emergency.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="rounded-full"
                        style={{ backgroundColor: getStatusColor(emergency.status) }}
                      >
                        {emergency.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{emergency.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          View
                        </Button>
                        {emergency.status === 'Pending' && (
                          <Button
                            size="sm"
                            className="rounded-lg"
                            style={{ backgroundColor: '#1BC47D' }}
                          >
                            Assign
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
