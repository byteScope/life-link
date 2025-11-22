import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  Ambulance,
  Stethoscope,
  Droplet,
  MessageCircle,
  Calendar,
  Heart,
  Clock,
  Shield,
  Star,
  TrendingUp,
  Users,
  Activity,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function Home() {
  const quickAccessTiles = [
    {
      title: 'Emergency',
      description: 'Ambulance, Fire, Medical Help',
      icon: Ambulance,
      color: '#FF3E30',
      path: '/emergency',
    },
    {
      title: 'Services',
      description: 'Browse healthcare services',
      icon: Stethoscope,
      color: '#1BC47D',
      path: '/services',
    },
    {
      title: 'Blood Request',
      description: 'Find donors near you',
      icon: Droplet,
      color: '#FF8C42',
      path: '/blood-request',
    },
    {
      title: 'Chat',
      description: 'Talk to providers',
      icon: MessageCircle,
      color: '#9B4DFF',
      path: '/chat',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users, color: '#1F6FB2' },
    { label: 'Services Completed', value: '200K+', icon: Activity, color: '#1BC47D' },
    { label: 'Average Rating', value: '4.8', icon: Star, color: '#FF8C42' },
    { label: 'Response Time', value: '<5min', icon: Clock, color: '#9B4DFF' },
  ];

  const features = [
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Round-the-clock emergency and healthcare services',
    },
    {
      icon: Shield,
      title: 'Verified Providers',
      description: 'All healthcare providers are thoroughly verified',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Tracking',
      description: 'Track your ambulance and service requests live',
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      service: 'Doctor Consultation',
      provider: 'Dr. Sarah Johnson',
      date: 'Nov 22, 2025',
      time: '10:00 AM',
      status: 'Confirmed',
    },
    {
      id: 2,
      service: 'Lab Test',
      provider: 'MediLab Center',
      date: 'Nov 23, 2025',
      time: '2:30 PM',
      status: 'Pending',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1F6FB2] to-[#1BC47D] text-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4 bg-white/20 hover:bg-white/30 border-0 rounded-full">
                  Your Healthcare Partner
                </Badge>
                <h1 className="text-white mb-4">
                  Emergency & Healthcare Services at Your Fingertips
                </h1>
                <p className="text-white/90 mb-6">
                  Access ambulance, medical help, blood requests, and healthcare services instantly. Available 24/7 for your safety and well-being.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/emergency">
                    <Button
                      size="lg"
                      className="rounded-xl"
                      style={{ backgroundColor: '#FF3E30' }}
                    >
                      <Ambulance className="w-5 h-5 mr-2" />
                      Emergency
                    </Button>
                  </Link>
                  <Link to="/services">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-xl bg-white hover:bg-gray-100 text-[#1F6FB2] border-0"
                    >
                      Browse Services
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309"
                  alt="Healthcare professionals"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Tiles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickAccessTiles.map((tile) => (
              <Link key={tile.title} to={tile.path}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0 rounded-2xl bg-white">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${tile.color}15` }}
                  >
                    <tile.icon className="w-6 h-6" style={{ color: tile.color }} />
                  </div>
                  <h3 className="mb-1">{tile.title}</h3>
                  <p className="text-sm text-gray-600">{tile.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                  </div>
                  <div className="text-gray-900 mb-1">{stat.value}</div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Bookings */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-900">Upcoming Bookings</h2>
            <Link to="/profile">
              <Button variant="ghost" className="rounded-xl">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="p-6 rounded-2xl border-0 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="mb-1">{booking.service}</h3>
                    <p className="text-sm text-gray-600">{booking.provider}</p>
                  </div>
                  <Badge
                    className="rounded-full"
                    style={{
                      backgroundColor:
                        booking.status === 'Confirmed' ? '#1BC47D' : '#FFA500',
                    }}
                  >
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {booking.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {booking.time}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 mb-4">Why Choose LifeLink?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide reliable, fast, and professional healthcare services with a focus on your safety and convenience.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="p-8 text-center rounded-2xl border-0 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1F6FB2] to-[#1BC47D] flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#1F6FB2] to-[#1BC47D] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Heart className="w-16 h-16 text-white mx-auto mb-4" fill="white" />
            <h2 className="text-white mb-4">Need Help Now?</h2>
            <p className="text-white/90 mb-6">
              Our emergency services are available 24/7. Don't hesitate to reach out when you need immediate assistance.
            </p>
            <Link to="/emergency">
              <Button
                size="lg"
                className="rounded-xl"
                style={{ backgroundColor: '#FF3E30' }}
              >
                <Ambulance className="w-5 h-5 mr-2" />
                Request Emergency Service
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
