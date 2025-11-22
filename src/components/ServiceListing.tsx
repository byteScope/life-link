import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Stethoscope,
  Home,
  Activity,
  Pill,
  TestTube,
  Heart,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function ServiceListing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { value: 'all', label: 'All Services', icon: Heart },
    { value: 'doctor', label: 'Doctor Consultation', icon: Stethoscope },
    { value: 'home-nursing', label: 'Home Nursing', icon: Home },
    { value: 'lab-tests', label: 'Lab Tests', icon: TestTube },
    { value: 'physiotherapy', label: 'Physiotherapy', icon: Activity },
    { value: 'pharmacy', label: 'Pharmacy', icon: Pill },
  ];

  const services = [
    {
      id: 1,
      title: 'General Physician Consultation',
      provider: 'Dr. Sarah Johnson',
      category: 'doctor',
      rating: 4.8,
      reviews: 245,
      price: 50,
      duration: '30 min',
      location: '2.5 km away',
      availability: 'Available Today',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
    },
    {
      id: 2,
      title: 'Home Nursing Care',
      provider: 'CareNurse Services',
      category: 'home-nursing',
      rating: 4.9,
      reviews: 189,
      price: 80,
      duration: '2-4 hours',
      location: '1.8 km away',
      availability: 'Available Now',
      image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289',
    },
    {
      id: 3,
      title: 'Complete Blood Count (CBC)',
      provider: 'MediLab Diagnostics',
      category: 'lab-tests',
      rating: 4.7,
      reviews: 312,
      price: 35,
      duration: '15 min',
      location: '3.2 km away',
      availability: 'Available Today',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67',
    },
    {
      id: 4,
      title: 'Physiotherapy Session',
      provider: 'PhysioFit Center',
      category: 'physiotherapy',
      rating: 4.6,
      reviews: 156,
      price: 60,
      duration: '45 min',
      location: '4.1 km away',
      availability: 'Available Tomorrow',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    },
    {
      id: 5,
      title: 'Cardiologist Consultation',
      provider: 'Dr. Michael Chen',
      category: 'doctor',
      rating: 4.9,
      reviews: 428,
      price: 120,
      duration: '45 min',
      location: '5.5 km away',
      availability: 'Available Today',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d',
    },
    {
      id: 6,
      title: 'Medicine Delivery',
      provider: 'QuickMed Pharmacy',
      category: 'pharmacy',
      rating: 4.5,
      reviews: 892,
      price: 5,
      duration: '30-60 min',
      location: '1.2 km away',
      availability: 'Available Now',
      image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831',
    },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Healthcare Services</h1>
          <p className="text-gray-600">Browse and book from our wide range of healthcare services</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search services or providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="flex-1 rounded-xl"
                style={viewMode === 'grid' ? { backgroundColor: '#1BC47D' } : {}}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className="flex-1 rounded-xl"
                style={viewMode === 'list' ? { backgroundColor: '#1BC47D' } : {}}
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.value)}
              className="rounded-full"
              style={
                selectedCategory === cat.value
                  ? { backgroundColor: '#1BC47D' }
                  : {}
              }
            >
              <cat.icon className="w-4 h-4 mr-2" />
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}
          </p>
        </div>

        {/* Services Grid/List */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredServices.map((service) => (
            <Link key={service.id} to={`/service/${service.id}`}>
              <Card
                className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-0 rounded-2xl ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className={`w-full object-cover ${
                      viewMode === 'list' ? 'h-full' : 'h-48'
                    }`}
                  />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="mb-1">{service.title}</h3>
                      <p className="text-sm text-gray-600">{service.provider}</p>
                    </div>
                    <Badge
                      className="rounded-full"
                      style={{
                        backgroundColor:
                          service.availability === 'Available Now'
                            ? '#1BC47D'
                            : '#1F6FB2',
                      }}
                    >
                      {service.availability}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{service.rating}</span>
                    <span className="text-sm text-gray-500">({service.reviews})</span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {service.location}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[#1BC47D]">${service.price}</span>
                    </div>
                    <Button className="rounded-xl" style={{ backgroundColor: '#1F6FB2' }}>
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search query
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="rounded-xl"
              style={{ backgroundColor: '#1BC47D' }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
