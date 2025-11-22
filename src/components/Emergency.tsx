import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Ambulance,
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Radio,
  Navigation,
} from 'lucide-react';

export default function Emergency() {
  const [selectedService, setSelectedService] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [showTracker, setShowTracker] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'pending' | 'accepted' | 'arriving' | 'arrived'>('pending');

  const emergencyServices = [
    {
      id: 'ambulance',
      title: 'Ambulance',
      description: 'Emergency medical transportation',
      icon: Ambulance,
      color: '#FF3E30',
      phone: '911',
    },
    {
      id: 'medical',
      title: 'Medical Help',
      description: 'Immediate medical assistance',
      icon: AlertTriangle,
      color: '#FF3E30',
      phone: '911',
    },
    {
      id: 'fire',
      title: 'Fire Service',
      description: 'Fire emergency response',
      icon: AlertTriangle,
      color: '#FF8C42',
      phone: '911',
    },
    {
      id: 'police',
      title: 'Police',
      description: 'Police emergency response',
      icon: Phone,
      color: '#1F6FB2',
      phone: '911',
    },
  ];

  const handleEmergencyRequest = () => {
    if (!selectedService || !location) {
      alert('Please select a service and enter your location');
      return;
    }
    setShowTracker(true);
    
    // Simulate status updates
    setTimeout(() => setRequestStatus('accepted'), 2000);
    setTimeout(() => setRequestStatus('arriving'), 5000);
    setTimeout(() => setRequestStatus('arrived'), 10000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          alert('Unable to get location. Please enter manually.');
        }
      );
    }
  };

  const getStatusInfo = (status: typeof requestStatus) => {
    switch (status) {
      case 'pending':
        return { text: 'Request Pending', color: '#FFA500', icon: Clock };
      case 'accepted':
        return { text: 'Request Accepted', color: '#1BC47D', icon: CheckCircle };
      case 'arriving':
        return { text: 'On The Way', color: '#1F6FB2', icon: Navigation };
      case 'arrived':
        return { text: 'Arrived', color: '#1BC47D', icon: CheckCircle };
    }
  };

  const statusInfo = getStatusInfo(requestStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Banner */}
        <div className="bg-gradient-to-r from-[#FF3E30] to-[#FF8C42] text-white rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-white">Emergency Services</h1>
              <p className="text-white/90">Available 24/7 for immediate assistance</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-xl p-3">
            <Phone className="w-5 h-5" />
            <span>Emergency Hotline: 911</span>
          </div>
        </div>

        {/* Service Selection */}
        <div className="mb-8">
          <h2 className="text-gray-900 mb-4">Select Emergency Service</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {emergencyServices.map((service) => (
              <Card
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-6 cursor-pointer transition-all border-2 rounded-2xl ${
                  selectedService === service.id
                    ? 'border-current shadow-lg'
                    : 'border-transparent hover:shadow-md'
                }`}
                style={
                  selectedService === service.id
                    ? { borderColor: service.color }
                    : {}
                }
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${service.color}15` }}
                  >
                    <service.icon className="w-6 h-6" style={{ color: service.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1">{service.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" style={{ color: service.color }} />
                      <span style={{ color: service.color }}>{service.phone}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Location & Details Form */}
        <Card className="p-6 mb-8 border-0 rounded-2xl">
          <h2 className="text-gray-900 mb-6">Location & Details</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Your Location</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter your address or coordinates"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="rounded-xl"
                />
                <Button
                  onClick={getCurrentLocation}
                  variant="outline"
                  className="rounded-xl flex-shrink-0"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Use Current
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                We'll use this location to dispatch emergency services
              </p>
            </div>

            <div className="space-y-2">
              <Label>Additional Details (Optional)</Label>
              <Textarea
                placeholder="Describe the emergency situation..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="rounded-xl min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleEmergencyRequest}
              disabled={!selectedService || !location}
              className="w-full rounded-xl"
              size="lg"
              style={{ backgroundColor: '#FF3E30' }}
            >
              <Ambulance className="w-5 h-5 mr-2" />
              Request Emergency Service
            </Button>
          </div>
        </Card>

        {/* Safety Tips */}
        <Card className="p-6 border-0 rounded-2xl bg-blue-50 border-blue-200">
          <h3 className="text-gray-900 mb-4">Safety Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#1BC47D] flex-shrink-0 mt-0.5" />
              <span>Stay calm and provide accurate location information</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#1BC47D] flex-shrink-0 mt-0.5" />
              <span>Keep your phone charged and accessible</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#1BC47D] flex-shrink-0 mt-0.5" />
              <span>Follow any instructions from emergency responders</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#1BC47D] flex-shrink-0 mt-0.5" />
              <span>Don't hang up until told to do so</span>
            </li>
          </ul>
        </Card>

        {/* Status Tracker Dialog */}
        <Dialog open={showTracker} onOpenChange={setShowTracker}>
          <DialogContent className="rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle>Emergency Request Status</DialogTitle>
              <DialogDescription>
                Tracking your emergency service request
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6">
              {/* Status Badge */}
              <div className="flex justify-center mb-8">
                <Badge
                  className="px-6 py-3 text-base rounded-full"
                  style={{ backgroundColor: statusInfo.color }}
                >
                  <statusInfo.icon className="w-5 h-5 mr-2" />
                  {statusInfo.text}
                </Badge>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <div className={`flex gap-4 ${requestStatus !== 'pending' ? 'opacity-100' : 'opacity-50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${requestStatus !== 'pending' ? 'bg-[#1BC47D]' : 'bg-gray-300'}`}>
                    {requestStatus !== 'pending' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Radio className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900">Request Sent</p>
                    <p className="text-sm text-gray-500">Your emergency request has been sent</p>
                  </div>
                </div>

                <div className={`flex gap-4 ${requestStatus === 'accepted' || requestStatus === 'arriving' || requestStatus === 'arrived' ? 'opacity-100' : 'opacity-50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${requestStatus === 'accepted' || requestStatus === 'arriving' || requestStatus === 'arrived' ? 'bg-[#1BC47D]' : 'bg-gray-300'}`}>
                    {requestStatus === 'accepted' || requestStatus === 'arriving' || requestStatus === 'arrived' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Radio className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900">Request Accepted</p>
                    <p className="text-sm text-gray-500">Emergency services are being dispatched</p>
                  </div>
                </div>

                <div className={`flex gap-4 ${requestStatus === 'arriving' || requestStatus === 'arrived' ? 'opacity-100' : 'opacity-50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${requestStatus === 'arriving' || requestStatus === 'arrived' ? 'bg-[#1BC47D]' : 'bg-gray-300'}`}>
                    {requestStatus === 'arriving' || requestStatus === 'arrived' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Radio className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900">On The Way</p>
                    <p className="text-sm text-gray-500">ETA: 8-10 minutes</p>
                  </div>
                </div>

                <div className={`flex gap-4 ${requestStatus === 'arrived' ? 'opacity-100' : 'opacity-50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${requestStatus === 'arrived' ? 'bg-[#1BC47D]' : 'bg-gray-300'}`}>
                    {requestStatus === 'arrived' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Radio className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900">Arrived</p>
                    <p className="text-sm text-gray-500">Emergency services have arrived at your location</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">Need to speak with dispatch?</p>
                <Button
                  className="w-full rounded-xl"
                  style={{ backgroundColor: '#1F6FB2' }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Emergency Hotline
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}
