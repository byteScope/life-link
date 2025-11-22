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
import { Search, Filter, Star, CheckCircle, XCircle } from 'lucide-react';

export default function AdminProviders() {
  const [searchQuery, setSearchQuery] = useState('');

  const providers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      category: 'Doctor',
      specialty: 'General Physician',
      rating: 4.8,
      reviews: 245,
      status: 'Verified',
      bookings: 342,
    },
    {
      id: 2,
      name: 'CareNurse Services',
      category: 'Home Nursing',
      specialty: 'Home Care',
      rating: 4.9,
      reviews: 189,
      status: 'Verified',
      bookings: 256,
    },
    {
      id: 3,
      name: 'MediLab Diagnostics',
      category: 'Lab Tests',
      specialty: 'Diagnostics',
      rating: 4.7,
      reviews: 312,
      status: 'Verified',
      bookings: 428,
    },
    {
      id: 4,
      name: 'Dr. Michael Chen',
      category: 'Doctor',
      specialty: 'Cardiologist',
      rating: 4.9,
      reviews: 428,
      status: 'Pending',
      bookings: 0,
    },
  ];

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-gray-900 mb-2">Providers Management</h1>
              <p className="text-gray-600">Manage healthcare service providers</p>
            </div>
            <Button className="rounded-xl" style={{ backgroundColor: '#1BC47D' }}>
              Add Provider
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8 border-0 rounded-2xl">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search providers by name or specialty..."
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

          {/* Providers Table */}
          <Card className="border-0 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div>
                        <p className="text-gray-900">{provider.name}</p>
                        <p className="text-sm text-gray-500">{provider.specialty}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="rounded-full"
                        style={{ backgroundColor: '#1BC47D' }}
                      >
                        {provider.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{provider.rating}</span>
                        <span className="text-sm text-gray-500">({provider.reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{provider.bookings}</p>
                    </TableCell>
                    <TableCell>
                      {provider.status === 'Verified' ? (
                        <Badge
                          className="rounded-full"
                          style={{ backgroundColor: '#1BC47D' }}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          className="rounded-full"
                          style={{ backgroundColor: '#FFA500' }}
                        >
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          View
                        </Button>
                        {provider.status === 'Pending' && (
                          <>
                            <Button
                              size="sm"
                              className="rounded-lg"
                              style={{ backgroundColor: '#1BC47D' }}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg text-[#FF3E30]"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
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
