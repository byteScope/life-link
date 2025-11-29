import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import ServiceBookingWizard from './ServiceBookingWizard';
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
  Activity,
  Home as HomeIcon,
  Baby,
  PawPrint,
  TestTube,
  UserCheck,
  Pill,
  ShoppingCart,
  Headphones,
  Wind,
  Heart,
  CheckCircle,
  Shield,
  Edit2,
  Calendar as CalendarIcon,
  X,
} from 'lucide-react';
import { format, parse } from 'date-fns';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function ServiceListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return searchParams.get('category') || 'all';
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardInitialStep, setWizardInitialStep] = useState(1);

  // Get booking details from URL params
  const bookingCategory = searchParams.get('category');
  const bookingType = searchParams.get('type');
  const bookingLocation = searchParams.get('location');
  const bookingDates = searchParams.get('dates')?.split(',').filter(Boolean) || [];
  const bookingTimes = searchParams.get('times')?.split(',').filter(Boolean) || [];
  const bookingDuration = searchParams.get('duration');
  const hasBookingDetails = bookingCategory && bookingDates.length > 0;

  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const handleAuthenticate = (phone: string, firstName: string, lastName: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Get care type label
  const getCareTypeLabel = (type: string, category: string) => {
    const options: Record<string, Record<string, string>> = {
      physiotherapy: {
        'home-visit': 'Home visit',
        'clinic': 'Clinic visit',
        'online': 'Online consultation',
      },
      caregiver: {
        'elderly-care': 'Elderly care',
        'disabled-care': 'Disabled adult care',
        'hospital-attendant': 'Hospital attendant',
      },
      babysitter: {
        'recurring': 'Recurring babysitter',
        'one-time': 'One-time sitter',
        'full-time': 'Full-time nanny',
      },
    };
    return options[category]?.[type] || type;
  };

  // Get duration label
  const getDurationLabel = (duration: string) => {
    const options: Record<string, string> = {
      '30': '30 minutes',
      '60': '60 minutes',
      '90': '90 minutes',
    };
    return options[duration] || duration;
  };

  // Update URL params
  const updateBookingParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Map fields to wizard steps
  const getStepForField = (field: 'dates' | 'times' | 'duration' | 'location' | 'type'): number => {
    // Step 1: Dates, Step 2: Care Type, Step 3: Time, Step 4: Duration, Step 5: Location
    const stepMap: Record<string, number> = {
      'dates': 1,
      'type': 2,
      'times': 3,
      'duration': 4,
      'location': 5,
    };
    return stepMap[field] || 1;
  };

  // Handle edit booking - opens wizard at step 1
  const handleEditBooking = () => {
    if (bookingCategory) {
      setWizardInitialStep(1);
      setWizardOpen(true);
    }
  };

  // Handle edit specific field - opens wizard at appropriate step
  const handleEditField = (field: 'dates' | 'times' | 'duration' | 'location' | 'type') => {
    if (bookingCategory) {
      const step = getStepForField(field);
      setWizardInitialStep(step);
      setWizardOpen(true);
    }
  };

  const categories = [
    { value: 'all', label: 'All Services', icon: Heart },
    { value: 'physiotherapy', label: 'Physiotherapy', icon: Activity },
    { value: 'caregiver', label: 'Caregiver', icon: HomeIcon },
    { value: 'babysitter', label: 'Babysitter', icon: Baby },
    { value: 'pet-care', label: 'Pet Care', icon: PawPrint },
    { value: 'sample-collection', label: 'Sample Collection', icon: TestTube },
    { value: 'nurse', label: 'Nurse at Home', icon: UserCheck },
    { value: 'pharmacy', label: 'Pharmacy Delivery', icon: Pill },
    { value: 'equipment', label: 'Medical Equipment', icon: ShoppingCart },
    { value: 'post-surgery', label: 'Post-Surgery Care', icon: Heart },
    { value: 'mental-health', label: 'Mental Health', icon: Headphones },
    { value: 'oxygen', label: 'Oxygen Rental', icon: Wind },
  ];

  const services = [
    // Physiotherapy
    {
      id: 1,
      title: 'Home Physiotherapy Session',
      provider: 'Sarah Ahmed, Licensed Physiotherapist',
      category: 'physiotherapy',
      rating: 4.8,
      reviews: 245,
      price: 60,
      duration: '45-60 min',
      location: '2.5 km away',
      availability: 'Available Today',
      experience: '10 years experience',
      verified: true,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    },
    {
      id: 2,
      title: 'Physiotherapy - Sports Injury',
      provider: 'Dr. Rahman Khan',
      category: 'physiotherapy',
      rating: 4.9,
      reviews: 189,
      price: 75,
      duration: '60 min',
      location: '3.2 km away',
      availability: 'Available Now',
      experience: '12 years experience',
      verified: true,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    },
    // Caregiver
    {
      id: 3,
      title: 'Elderly Care Specialist',
      provider: 'Fatima Begum',
      category: 'caregiver',
      rating: 4.9,
      reviews: 312,
      price: 45,
      duration: '8 hours/day',
      location: '1.8 km away',
      availability: 'Available Today',
      experience: '8 years experience',
      verified: true,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56',
    },
    {
      id: 4,
      title: 'Disabled Adult Care',
      provider: 'Ayesha Rahman',
      category: 'caregiver',
      rating: 4.7,
      reviews: 156,
      price: 50,
      duration: 'Full-time',
      location: '2.1 km away',
      availability: 'Available Now',
      experience: '6 years experience',
      verified: true,
      image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289',
    },
    // Babysitter
    {
      id: 5,
      title: 'Experienced Nanny',
      provider: 'Rashida Akter',
      category: 'babysitter',
      rating: 4.9,
      reviews: 428,
      price: 35,
      duration: 'Per hour',
      location: '1.5 km away',
      availability: 'Available Today',
      experience: '7 years experience',
      verified: true,
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309',
    },
    {
      id: 6,
      title: 'Newborn Care Specialist',
      provider: 'Taslima Khan',
      category: 'babysitter',
      rating: 4.8,
      reviews: 289,
      price: 40,
      duration: 'Per hour',
      location: '2.8 km away',
      availability: 'Available Now',
      experience: '10 years experience',
      verified: true,
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9',
    },
    // Pet Care
    {
      id: 7,
      title: 'Pet Boarding Service',
      provider: 'PetCare Plus',
      category: 'pet-care',
      rating: 4.7,
      reviews: 156,
      price: 25,
      duration: 'Per day',
      location: '3.5 km away',
      availability: 'Available Today',
      experience: '5 years experience',
      verified: true,
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1',
    },
    {
      id: 8,
      title: 'Dog Walking Service',
      provider: 'Happy Paws',
      category: 'pet-care',
      rating: 4.6,
      reviews: 203,
      price: 15,
      duration: '30 min walk',
      location: '1.2 km away',
      availability: 'Available Now',
      experience: '3 years experience',
      verified: true,
      image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea',
    },
    // Sample Collection
    {
      id: 9,
      title: 'Home Blood Test Collection',
      provider: 'MediLab Express',
      category: 'sample-collection',
      rating: 4.8,
      reviews: 892,
      price: 10,
      duration: '15 min',
      location: '2.0 km away',
      availability: 'Available Today',
      experience: 'Partner with Popular Diagnostic',
      verified: true,
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67',
    },
    // Nurse at Home
    {
      id: 10,
      title: 'Registered Nurse - Home Visit',
      provider: 'NurseCare Services',
      category: 'nurse',
      rating: 4.9,
      reviews: 445,
      price: 55,
      duration: '4-8 hours',
      location: '2.3 km away',
      availability: 'Available Now',
      experience: '15 years experience',
      verified: true,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
    },
    // Pharmacy
    {
      id: 11,
      title: 'Medicine Delivery',
      provider: 'QuickMed Pharmacy',
      category: 'pharmacy',
      rating: 4.5,
      reviews: 1203,
      price: 5,
      duration: '30-60 min',
      location: '1.0 km away',
      availability: 'Available Now',
      experience: '24/7 Service',
      verified: true,
      image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831',
    },
    // Medical Equipment
    {
      id: 12,
      title: 'Oxygen Cylinder Rental',
      provider: 'MedEquip Rentals',
      category: 'equipment',
      rating: 4.7,
      reviews: 234,
      price: 30,
      duration: 'Per day',
      location: '3.0 km away',
      availability: 'Available Today',
      experience: 'Emergency delivery available',
      verified: true,
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074',
    },
    {
      id: 13,
      title: 'Wheelchair Rental',
      provider: 'MedEquip Rentals',
      category: 'equipment',
      rating: 4.6,
      reviews: 189,
      price: 20,
      duration: 'Per day',
      location: '3.0 km away',
      availability: 'Available Now',
      experience: 'Multiple sizes available',
      verified: true,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56',
    },
    // Post-Surgery Care
    {
      id: 14,
      title: 'Post-Surgery Recovery Care',
      provider: 'RecoveryCare Specialists',
      category: 'post-surgery',
      rating: 4.8,
      reviews: 178,
      price: 65,
      duration: 'Daily visits',
      location: '2.7 km away',
      availability: 'Available Today',
      experience: 'Specialized in post-op care',
      verified: true,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    },
    // Mental Health
    {
      id: 15,
      title: 'Mental Health Support',
      provider: 'MindCare Counseling',
      category: 'mental-health',
      rating: 4.9,
      reviews: 312,
      price: 50,
      duration: '60 min session',
      location: '4.2 km away',
      availability: 'Available Today',
      experience: 'Licensed therapists',
      verified: true,
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    },
    // Oxygen Rental
    {
      id: 16,
      title: 'Oxygen Concentrator Rental',
      provider: 'Oxygen Solutions',
      category: 'oxygen',
      rating: 4.8,
      reviews: 267,
      price: 40,
      duration: 'Per day',
      location: '2.5 km away',
      availability: 'Available Now',
      experience: '24/7 Emergency service',
      verified: true,
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074',
    },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Trusted Healthcare Providers</h1>
          <p className="text-gray-600 text-lg">Connect with verified caregivers, healthcare professionals, and service providers in your area</p>
        </div>

        {/* Booking Summary - Editable */}
        {hasBookingDetails && (
          <Card className="mb-8 p-6 rounded-2xl border-2 border-[#1BC47D]/20" style={{ backgroundColor: '#F0FDF4' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#1BC47D]" />
                Your Booking Details
              </h2>
              <Button
                onClick={handleEditBooking}
                variant="outline"
                className="rounded-xl border-[#1BC47D] text-[#1BC47D] hover:bg-[#1BC47D] hover:text-white"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit All
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Service Category */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1BC47D]/10 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-[#1BC47D]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Service</p>
                  <p className="font-semibold text-gray-900 capitalize">{bookingCategory}</p>
                </div>
              </div>

              {/* Care Type */}
              {bookingType && (
                <div 
                  className="flex items-start gap-3 cursor-pointer hover:bg-[#1BC47D]/5 p-2 rounded-lg transition-colors -m-2"
                  onClick={() => handleEditField('type')}
                  title="Click to edit care type"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1BC47D]/10 flex items-center justify-center flex-shrink-0">
                    <HomeIcon className="w-5 h-5 text-[#1BC47D]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-gray-500">Care Type</p>
                      <Edit2 className="w-3 h-3 text-gray-400" />
                    </div>
                    <p className="font-semibold text-gray-900">{getCareTypeLabel(bookingType, bookingCategory || '')}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div 
                className="flex items-start gap-3 cursor-pointer hover:bg-[#1BC47D]/5 p-2 rounded-lg transition-colors -m-2"
                onClick={() => handleEditField('dates')}
                title="Click to edit dates"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1BC47D]/10 flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="w-5 h-5 text-[#1BC47D]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-gray-500">Dates ({bookingDates.length})</p>
                    <Edit2 className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {bookingDates.slice(0, 2).map((dateStr, idx) => {
                      try {
                        const date = parse(dateStr, 'yyyy-MM-dd', new Date());
                        return (
                          <Badge key={idx} className="bg-[#1BC47D] text-white text-xs">
                            {format(date, 'MMM d')}
                          </Badge>
                        );
                      } catch {
                        return null;
                      }
                    })}
                    {bookingDates.length > 2 && (
                      <Badge className="bg-gray-200 text-gray-700 text-xs">
                        +{bookingDates.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Times */}
              {bookingTimes.length > 0 && (
                <div 
                  className="flex items-start gap-3 cursor-pointer hover:bg-[#1BC47D]/5 p-2 rounded-lg transition-colors -m-2"
                  onClick={() => handleEditField('times')}
                  title="Click to edit times"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1BC47D]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#1BC47D]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-gray-500">Time</p>
                      <Edit2 className="w-3 h-3 text-gray-400" />
                    </div>
                    <p className="font-semibold text-gray-900">
                      {bookingTimes.length === 1 ? bookingTimes[0] : `${bookingTimes.length} different times`}
                    </p>
                  </div>
                </div>
              )}

              {/* Duration */}
              {bookingDuration && (
                <div 
                  className="flex items-start gap-3 cursor-pointer hover:bg-[#1BC47D]/5 p-2 rounded-lg transition-colors -m-2"
                  onClick={() => handleEditField('duration')}
                  title="Click to edit duration"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1BC47D]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#1BC47D]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-gray-500">Duration</p>
                      <Edit2 className="w-3 h-3 text-gray-400" />
                    </div>
                    <p className="font-semibold text-gray-900">{getDurationLabel(bookingDuration)}</p>
                  </div>
                </div>
              )}

              {/* Location */}
              {bookingLocation && (
                <div 
                  className="flex items-start gap-3 cursor-pointer hover:bg-[#1BC47D]/5 p-2 rounded-lg transition-colors -m-2"
                  onClick={() => handleEditField('location')}
                  title="Click to edit location"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1BC47D]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#1BC47D]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-gray-500">Location</p>
                      <Edit2 className="w-3 h-3 text-gray-400" />
                    </div>
                    <p className="font-semibold text-gray-900 truncate">{bookingLocation}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Filters Section */}
        <div className="rounded-2xl p-6 shadow-sm mb-8" style={{ backgroundColor: '#FFFFFF' }}>
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
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        {service.verified && (
                          <Shield className="w-4 h-4 text-[#1BC47D]" title="Verified Provider" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{service.provider}</p>
                      {service.experience && (
                        <p className="text-xs text-gray-500">{service.experience}</p>
                      )}
                    </div>
                    <Badge
                      className="rounded-full text-white"
                      style={{
                        backgroundColor:
                          service.availability === 'Available Now'
                            ? '#1BC47D'
                            : service.availability === 'Available Today'
                            ? '#1F6FB2'
                            : '#FF8C42',
                      }}
                    >
                      {service.availability}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{service.rating}</span>
                    <span className="text-sm text-gray-500">({service.reviews} reviews)</span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{service.location}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-[#1BC47D]">${service.price}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        {service.category === 'pet-care' && service.title.includes('Boarding') ? '/day' :
                         service.category === 'equipment' || service.category === 'oxygen' ? '/day' :
                         service.category === 'caregiver' && service.duration.includes('hour') ? '/hour' :
                         service.category === 'babysitter' ? '/hour' :
                         service.category === 'pharmacy' ? ' delivery fee' :
                         service.category === 'sample-collection' ? ' collection fee' : ''}
                      </span>
                    </div>
                    <Button className="rounded-xl" style={{ backgroundColor: '#1BC47D' }}>
                      Contact
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

      {/* Service Booking Wizard for editing */}
      {wizardOpen && bookingCategory && (
        <ServiceBookingWizard
          serviceTitle={categories.find(c => c.value === bookingCategory)?.label || 'Service'}
          serviceCategory={bookingCategory}
          isOpen={wizardOpen}
          onClose={() => setWizardOpen(false)}
          isAuthenticated={isAuthenticated}
          onAuthenticate={handleAuthenticate}
          initialValues={{
            careType: bookingType || undefined,
            dates: bookingDates.length > 0 ? bookingDates : undefined,
            times: bookingTimes.length > 0 ? bookingTimes : undefined,
            duration: bookingDuration || undefined,
            location: bookingLocation || undefined,
          }}
          initialStep={wizardInitialStep}
        />
      )}
    </div>
  );
}
