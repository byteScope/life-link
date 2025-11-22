import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Star,
  MapPin,
  Clock,
  Shield,
  Award,
  CheckCircle,
  Calendar as CalendarIcon,
  ArrowLeft,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const service = {
    id: 1,
    title: 'General Physician Consultation',
    provider: 'Dr. Sarah Johnson',
    category: 'Doctor Consultation',
    rating: 4.8,
    reviews: 245,
    price: 50,
    duration: '30 min',
    location: '2.5 km away',
    availability: 'Available Today',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
    description:
      'Dr. Sarah Johnson is a highly experienced general physician with over 15 years of practice. She specializes in preventive care, chronic disease management, and general health consultations. Book an appointment for comprehensive health assessment and personalized treatment plans.',
    qualifications: [
      'MBBS, MD - Internal Medicine',
      'Board Certified Physician',
      '15+ Years Experience',
      'Member of American Medical Association',
    ],
    services: [
      'General Health Check-up',
      'Chronic Disease Management',
      'Preventive Care',
      'Health Counseling',
      'Prescription Management',
    ],
  };

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  const reviews = [
    {
      id: 1,
      name: 'John Smith',
      rating: 5,
      date: 'Nov 15, 2025',
      comment: 'Excellent doctor! Very professional and caring. Highly recommend.',
    },
    {
      id: 2,
      name: 'Emily Davis',
      rating: 5,
      date: 'Nov 10, 2025',
      comment: 'Dr. Johnson took the time to listen to all my concerns. Great experience!',
    },
    {
      id: 3,
      name: 'Michael Brown',
      rating: 4,
      date: 'Nov 5, 2025',
      comment: 'Very knowledgeable and helpful. The consultation was thorough.',
    },
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }
    setShowBookingDialog(true);
  };

  const confirmBooking = () => {
    setShowBookingDialog(false);
    navigate('/payments');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/services')}
          className="mb-6 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Image & Basic Info */}
            <Card className="overflow-hidden border-0 rounded-2xl">
              <ImageWithFallback
                src={service.image}
                alt={service.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge className="mb-2 rounded-full" style={{ backgroundColor: '#1BC47D' }}>
                      {service.category}
                    </Badge>
                    <h1 className="text-gray-900 mb-2">{service.title}</h1>
                    <h3 className="text-gray-700">{service.provider}</h3>
                  </div>
                  <Badge
                    className="rounded-full"
                    style={{ backgroundColor: '#1BC47D' }}
                  >
                    {service.availability}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span>{service.rating}</span>
                    <span className="text-gray-500">({service.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    {service.duration}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    {service.location}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-[#1BC47D]">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">Verified Provider</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#1BC47D]">
                    <Award className="w-5 h-5" />
                    <span className="text-sm">Top Rated</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs Section */}
            <Card className="border-0 rounded-2xl p-6">
              <Tabs defaultValue="about">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-4">
                  <div>
                    <h3 className="mb-3">About</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                  <div>
                    <h3 className="mb-3">Qualifications</h3>
                    <ul className="space-y-2">
                      {service.qualifications.map((qual, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-[#1BC47D] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="services">
                  <h3 className="mb-4">Services Offered</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.services.map((svc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl"
                      >
                        <CheckCircle className="w-5 h-5 text-[#1BC47D] flex-shrink-0" />
                        <span className="text-gray-700">{svc}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-4 border-b border-gray-200 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-gray-900">{review.name}</p>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 rounded-2xl p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[#1BC47D]">${service.price}</span>
                  <span className="text-sm text-gray-500">per consultation</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-xl border"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                <div>
                  <h3 className="mb-3">Select Time</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        className="rounded-xl"
                        style={
                          selectedTime === time
                            ? { backgroundColor: '#1F6FB2' }
                            : {}
                        }
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={handleBooking}
                      className="w-full rounded-xl"
                      size="lg"
                      style={{ backgroundColor: '#1BC47D' }}
                    >
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      Book Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>Confirm Booking</DialogTitle>
                      <DialogDescription>
                        Please review your booking details
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Service</p>
                        <p className="text-gray-900">{service.title}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Provider</p>
                        <p className="text-gray-900">{service.provider}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="text-gray-900">
                          {selectedDate?.toLocaleDateString()} at {selectedTime}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-[#1BC47D]">${service.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowBookingDialog(false)}
                        className="flex-1 rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={confirmBooking}
                        className="flex-1 rounded-xl"
                        style={{ backgroundColor: '#1BC47D' }}
                      >
                        Proceed to Payment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
