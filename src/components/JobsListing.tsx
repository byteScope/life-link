import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  Briefcase,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function JobsListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return searchParams.get('category') || 'all';
  });
  const [jobType, setJobType] = useState('all');

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const categories = [
    { value: 'all', label: 'All Jobs', icon: Briefcase },
    { value: 'physiotherapy', label: 'Physiotherapist', icon: Activity },
    { value: 'caregiver', label: 'Caregiver', icon: HomeIcon },
    { value: 'babysitter', label: 'Babysitter', icon: Baby },
    { value: 'pet-care', label: 'Pet Care', icon: PawPrint },
    { value: 'sample-collection', label: 'Sample Collection', icon: TestTube },
    { value: 'nurse', label: 'Nurse', icon: UserCheck },
    { value: 'pharmacy', label: 'Pharmacy Delivery', icon: Pill },
    { value: 'equipment', label: 'Medical Equipment', icon: ShoppingCart },
    { value: 'post-surgery', label: 'Post-Surgery Care', icon: HomeIcon },
    { value: 'mental-health', label: 'Mental Health', icon: Headphones },
    { value: 'oxygen', label: 'Oxygen Rental', icon: Wind },
  ];

  const jobs = [
    {
      id: 1,
      title: 'Physiotherapist Needed - Home Visits',
      category: 'physiotherapy',
      location: 'Dhanmondi, Dhaka',
      salary: '৳15,000 - ৳25,000',
      type: 'Part-time',
      posted: '2 days ago',
      description: 'Looking for experienced physiotherapist for home visit services. Flexible schedule.',
      requirements: 'BPT degree, 2+ years experience',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    },
    {
      id: 2,
      title: 'Elderly Care Provider - Full Time',
      category: 'caregiver',
      location: 'Gulshan, Dhaka',
      salary: '৳20,000 - ৳30,000',
      type: 'Full-time',
      posted: '1 day ago',
      description: 'Full-time caregiver needed for elderly patient. Must have experience with dementia care.',
      requirements: 'Experience with elderly care, compassionate',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56',
    },
    {
      id: 3,
      title: 'Babysitter - Evening Hours',
      category: 'babysitter',
      location: 'Banani, Dhaka',
      salary: '৳12,000 - ৳18,000',
      type: 'Part-time',
      posted: '3 days ago',
      description: 'Evening babysitter needed for 2 children (ages 5 and 8). Monday to Friday.',
      requirements: 'Experience with children, references required',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309',
    },
    {
      id: 4,
      title: 'Pet Care Provider - Dog Walking',
      category: 'pet-care',
      location: 'Uttara, Dhaka',
      salary: '৳8,000 - ৳12,000',
      type: 'Part-time',
      posted: '5 days ago',
      description: 'Dog walking and pet sitting services needed. Flexible hours.',
      requirements: 'Love for animals, reliable',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1',
    },
    {
      id: 5,
      title: 'Registered Nurse - Home Care',
      category: 'nurse',
      location: 'Mirpur, Dhaka',
      salary: '৳25,000 - ৳35,000',
      type: 'Full-time',
      posted: '1 day ago',
      description: 'Experienced nurse needed for post-surgery patient care at home.',
      requirements: 'BSc Nursing, 3+ years experience',
      image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289',
    },
    {
      id: 6,
      title: 'Pharmacy Delivery Driver',
      category: 'pharmacy',
      location: 'Mohakhali, Dhaka',
      salary: '৳10,000 - ৳15,000',
      type: 'Part-time',
      posted: '4 days ago',
      description: 'Delivery driver needed for pharmacy. Own vehicle preferred.',
      requirements: 'Valid driving license, reliable',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88',
    },
    {
      id: 7,
      title: 'Sample Collection Technician',
      category: 'sample-collection',
      location: 'Wari, Dhaka',
      salary: '৳18,000 - ৳22,000',
      type: 'Full-time',
      posted: '2 days ago',
      description: 'Medical sample collection technician needed. Training provided.',
      requirements: 'Science background preferred',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074',
    },
    {
      id: 8,
      title: 'Mental Health Counselor',
      category: 'mental-health',
      location: 'Dhanmondi, Dhaka',
      salary: '৳30,000 - ৳40,000',
      type: 'Part-time',
      posted: '6 days ago',
      description: 'Licensed mental health counselor for online and in-person sessions.',
      requirements: 'Masters in Psychology, license required',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesType = jobType === 'all' || job.type.toLowerCase() === jobType.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.icon || Briefcase;
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.label || category;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Find Jobs
          </h1>
          <p className="text-gray-600">
            Discover job opportunities in healthcare and caregiving services
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search jobs by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-full md:w-48 h-12 rounded-xl">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedCategory(category.value);
                    const newParams = new URLSearchParams(searchParams);
                    if (category.value === 'all') {
                      newParams.delete('category');
                    } else {
                      newParams.set('category', category.value);
                    }
                    setSearchParams(newParams);
                  }}
                  className="rounded-xl flex items-center gap-2"
                  style={
                    selectedCategory === category.value
                      ? { backgroundColor: '#1F6FB2' }
                      : {}
                  }
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const CategoryIcon = getCategoryIcon(job.category);
              return (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow border rounded-2xl bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#1F6FB2' }}
                      >
                        <CategoryIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Posted {job.posted}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Requirements:</p>
                    <p className="text-sm text-gray-700">{job.requirements}</p>
                  </div>

                  <Link to={`/job/${job.id}`}>
                    <Button className="w-full rounded-xl" style={{ backgroundColor: '#1F6FB2' }}>
                      View Details
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center border rounded-2xl bg-white">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later for new opportunities.
            </p>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}


