import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import ServiceBookingWizard from './ServiceBookingWizard';
import {
  Ambulance,
  Droplet,
  MessageCircle,
  Heart,
  Clock,
  Shield,
  Star,
  TrendingUp,
  Users,
  Activity,
  Home as HomeIcon,
  Baby,
  PawPrint,
  TestTube,
  Pill,
  Wind,
  ShoppingCart,
  Headphones,
  UserCheck,
  CheckCircle,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function Home() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{ title: string; category: string } | null>(null);
  // Check if user is authenticated (you can use localStorage or context)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const handleServiceClick = (e: React.MouseEvent, service: { title: string; path: string }) => {
    e.preventDefault();
    // Extract category from path
    const category = service.path.split('category=')[1]?.split('&')[0] || service.path.split('/')[1];
    setSelectedService({ title: service.title, category });
    setWizardOpen(true);
  };

  const handleAuthenticate = (phone: string, firstName: string, lastName: string) => {
    // Handle authentication - you can integrate with your auth system
    console.log('Authenticating:', { phone, firstName, lastName });
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    // In a real app, you'd call your authentication API here
  };
  const quickAccessTiles = [
    {
      title: 'Book a Doctor',
      description: 'In-person or video consultation',
      icon: Calendar,
      color: '#1BC47D',
      path: '/doctors',
    },
    {
      title: 'Blood Request',
      description: 'Find donors near you',
      icon: Droplet,
      color: '#FF8C42',
      path: '/blood-request',
    },
    {
      title: 'Symptom Check',
      description: 'Chat and we’ll suggest the right doctors',
      icon: MessageCircle,
      color: '#9B4DFF',
      path: '/symptom-check',
    },
  ];

  const services = [
    {
      title: 'Physiotherapy',
      description: 'On-demand physiotherapist at home',
      icon: Activity,
      color: '#9B4DFF',
      path: '/services?category=physiotherapy',
    },
    {
      title: 'Caregiver',
      description: 'Elderly & disabled care services',
      icon: HomeIcon,
      color: '#1F6FB2',
      path: '/services?category=caregiver',
    },
    {
      title: 'Babysitter',
      description: 'Verified babysitters & nannies',
      icon: Baby,
      color: '#FF8C42',
      path: '/services?category=babysitter',
    },
    {
      title: 'Pet Care',
      description: 'Pet boarding, sitting & walking',
      icon: PawPrint,
      color: '#1BC47D',
      path: '/services?category=pet-care',
    },
    {
      title: 'Sample Collection',
      description: 'Home test sample collection',
      icon: TestTube,
      color: '#FF3E30',
      path: '/services?category=sample-collection',
    },
    {
      title: 'Nurse at Home',
      description: 'Professional nursing care',
      icon: UserCheck,
      color: '#1BC47D',
      path: '/services?category=nurse',
    },
    {
      title: 'Pharmacy Delivery',
      description: 'Medicine delivery service',
      icon: Pill,
      color: '#9B4DFF',
      path: '/services?category=pharmacy',
    },
    {
      title: 'Medical Equipment',
      description: 'Rent oxygen, wheelchair & more',
      icon: ShoppingCart,
      color: '#1F6FB2',
      path: '/services?category=equipment',
    },
    {
      title: 'Post-Surgery Care',
      description: 'Recovery & rehabilitation support',
      icon: Heart,
      color: '#FF8C42',
      path: '/services?category=post-surgery',
    },
    {
      title: 'Mental Health',
      description: '24/7 mental health support',
      icon: Headphones,
      color: '#9B4DFF',
      path: '/services?category=mental-health',
    },
    {
      title: 'Oxygen Rental',
      description: 'Oxygen cylinder delivery',
      icon: Wind,
      color: '#1BC47D',
      path: '/services?category=oxygen',
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


  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
      <Header />

      <main>
        {/* Hero Section - Keep as is */}
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

        {/* Quick Access Tiles - Positioned below hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickAccessTiles.map((tile) => (
              <Link key={tile.title} to={tile.path}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0 rounded-2xl shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${tile.color}15` }}
                  >
                    <tile.icon className="w-6 h-6" style={{ color: tile.color }} />
                  </div>
                  <h3 className="mb-1 font-semibold text-gray-900">{tile.title}</h3>
                  <p className="text-sm text-gray-600">{tile.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Services Section - Cream background, Care.com style */}
        <section className="py-16" style={{ backgroundColor: '#FAF9F6' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Connecting families with quality, local healthcare</h2>
              <p className="text-gray-600 text-lg">Find trusted caregivers, healthcare professionals, and emergency services in your area</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  onClick={(e) => handleServiceClick(e, service)}
                >
                  <Card className={`p-4 hover:shadow-md transition-all duration-300 cursor-pointer border rounded-2xl bg-white h-48 flex flex-col group overflow-hidden ${
                    index === 2 ? 'border-gray-300 shadow-sm' : 'border-gray-200'
                  }`}>
                    {/* Title with Arrow at Top */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{service.title}</h3>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#1BC47D] group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    {/* Illustration/Icon at Bottom - More illustration-like */}
                    <div className="flex-1 flex items-end justify-center relative">
                      <div 
                        className="absolute inset-0 opacity-5"
                        style={{ backgroundColor: service.color }}
                      ></div>
                      <div className="relative z-10">
                        <service.icon 
                          className="w-24 h-24 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
                          style={{ 
                            color: service.color,
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                          }} 
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Cream background */}
        <section className="py-12" style={{ backgroundColor: '#FAF9F6' }}>
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
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Section - Care.com style */}
        <section className="py-16" style={{ backgroundColor: '#FAF9F6' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side - Images */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {/* Top Image */}
                  <div className="relative rounded-2xl overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56"
                      alt="Leading the way"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#1BC47D] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      Leading the way
                    </div>
                  </div>
                  {/* Bottom Image - Offset */}
                  <div className="relative rounded-2xl overflow-hidden mt-8">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
                      alt="with LifeLink Protect"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#1BC47D] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      with LifeLink Protect™
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Safety is at the heart of our community
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#1BC47D] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      All healthcare providers on LifeLink start with a required background check
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#1BC47D] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      Monitored bookings, messages and a 24/7 safety hotline
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#1BC47D] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      Tips and resources to help you make safer hiring choices
                    </p>
                  </div>
                </div>
                <Button
                  className="rounded-xl"
                  style={{ backgroundColor: '#1BC47D' }}
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Light blue background like Care.com membership section */}
        <section className="bg-[#F0F7FF] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">More than access. It's support for every step.</h2>
              <p className="text-gray-600 text-lg">Plans start at $12.99/mo</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="p-8 text-center rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
                  <div className="w-16 h-16 rounded-2xl bg-[#1BC47D] flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button
                size="lg"
                className="rounded-xl"
                style={{ backgroundColor: '#1BC47D' }}
              >
                See plans & pricing
              </Button>
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

      {/* Service Booking Wizard */}
      {selectedService && (
        <ServiceBookingWizard
          serviceTitle={selectedService.title}
          serviceCategory={selectedService.category}
          isOpen={wizardOpen}
          onClose={() => {
            setWizardOpen(false);
            setSelectedService(null);
          }}
          isAuthenticated={isAuthenticated}
          onAuthenticate={handleAuthenticate}
        />
      )}
    </div>
  );
}
