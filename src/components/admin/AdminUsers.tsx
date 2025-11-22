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
import { Search, Filter, MoreVertical, UserCheck, UserX } from 'lucide-react';

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      bloodGroup: 'O+',
      joinDate: 'Jan 15, 2025',
      status: 'Active',
      bookings: 12,
    },
    {
      id: 2,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 234-5678',
      bloodGroup: 'A+',
      joinDate: 'Feb 20, 2025',
      status: 'Active',
      bookings: 8,
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+1 (555) 345-6789',
      bloodGroup: 'B+',
      joinDate: 'Mar 10, 2025',
      status: 'Inactive',
      bookings: 5,
    },
    {
      id: 4,
      name: 'Sarah Miller',
      email: 'sarah.miller@email.com',
      phone: '+1 (555) 456-7890',
      bloodGroup: 'AB+',
      joinDate: 'Apr 5, 2025',
      status: 'Active',
      bookings: 15,
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-gray-900 mb-2">Users Management</h1>
              <p className="text-gray-600">Manage all registered users</p>
            </div>
            <Button className="rounded-xl" style={{ backgroundColor: '#1F6FB2' }}>
              Export Data
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8 border-0 rounded-2xl">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search users by name or email..."
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

          {/* Users Table */}
          <Card className="border-0 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="rounded-full"
                        style={{ backgroundColor: '#FF8C42' }}
                      >
                        {user.bloodGroup}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{user.joinDate}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{user.bookings}</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="rounded-full"
                        style={{
                          backgroundColor:
                            user.status === 'Active' ? '#1BC47D' : '#6B7280',
                        }}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          View
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-lg">
                          <MoreVertical className="w-4 h-4" />
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
