import { useState } from 'react';
import Header from './Header';
import { createBloodRequest, searchBloodDonors, type BloodDonor } from '../api';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Droplet,
  MapPin,
  Phone,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  Navigation,
} from 'lucide-react';

export default function BloodRequest() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [units, setUnits] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('');
  const [showResults, setShowResults] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'critical', label: 'Critical (Within 24 hours)', color: '#FF3E30' },
    { value: 'urgent', label: 'Urgent (Within 3 days)', color: '#FF8C42' },
    { value: 'normal', label: 'Normal (Within 1 week)', color: '#1BC47D' },
  ];

  const [donors, setDonors] = useState<Array<BloodDonor & { compatible?: boolean }>>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!bloodGroup || !units || !location || !urgency) {
      alert('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createBloodRequest({
        blood_group: bloodGroup,
        units,
        location,
        urgency,
      });
      const list = await searchBloodDonors({ blood_group: bloodGroup, location });
      setDonors(
        list.map((d) => ({
          ...d,
          bloodGroup: d.blood_group ?? (d as { bloodGroup?: string }).bloodGroup ?? '',
          compatible: (d.blood_group ?? '').replace(/[+-]/g, '') === bloodGroup.replace(/[+-]/g, ''),
          lastDonation: (d as { lastDonation?: string }).lastDonation ?? '—',
          donations: (d as { donations?: number }).donations ?? 0,
        }))
      );
      setShowResults(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF8C42] to-[#FF3E30] text-white rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Droplet className="w-6 h-6" fill="white" />
            </div>
            <div>
              <h1 className="text-white">Blood Request</h1>
              <p className="text-white/90">Find blood donors near you</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Request Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8 border-0 rounded-2xl">
              <h2 className="text-gray-900 mb-6">Blood Request Details</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Blood Group *</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {bloodGroups.map((group) => (
                      <Button
                        key={group}
                        variant={bloodGroup === group ? 'default' : 'outline'}
                        onClick={() => setBloodGroup(group)}
                        className="rounded-xl"
                        style={
                          bloodGroup === group
                            ? { backgroundColor: '#FF8C42' }
                            : {}
                        }
                      >
                        {group}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Units Required *</Label>
                  <Input
                    type="number"
                    placeholder="Enter number of units"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    min="1"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location *</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter your location"
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
                </div>

                <div className="space-y-2">
                  <Label>Urgency Level *</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: level.color }}
                            />
                            {level.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {submitError && (
                  <p className="text-sm text-red-600">{submitError}</p>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full rounded-xl"
                  size="lg"
                  style={{ backgroundColor: '#FF8C42' }}
                >
                  <Droplet className="w-5 h-5 mr-2" />
                  {submitting ? 'Searching…' : 'Find Donors'}
                </Button>
              </div>
            </Card>

            {/* Matching Donors */}
            {showResults && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-gray-900">Matching Donors</h2>
                  <Badge className="rounded-full" style={{ backgroundColor: '#1BC47D' }}>
                    {donors.filter((d) => d.compatible).length} Compatible
                  </Badge>
                </div>

                {donors.map((donor, idx) => (
                  <Card
                    key={donor.id ?? `donor-${idx}`}
                    className={`p-6 rounded-2xl border-2 ${
                      donor.compatible
                        ? 'border-[#1BC47D] bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C42] to-[#FF3E30] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="mb-1">{donor.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Droplet className="w-4 h-4 text-[#FF8C42]" />
                              {donor.bloodGroup}
                            </div>
                            <div className="flex items-center gap-1">
                              <Navigation className="w-4 h-4" />
                              {donor.location}
                            </div>
                          </div>
                        </div>
                      </div>
                      {donor.compatible && (
                        <Badge className="rounded-full" style={{ backgroundColor: '#1BC47D' }}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Compatible
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Last: {donor.lastDonation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Droplet className="w-4 h-4" />
                        <span>{donor.donations} donations</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 rounded-xl"
                        style={{ backgroundColor: '#1F6FB2' }}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Donor
                      </Button>
                      <Button variant="outline" className="flex-1 rounded-xl">
                        View Profile
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-0 rounded-2xl mb-6 bg-orange-50">
              <h3 className="text-gray-900 mb-4">Blood Donation Facts</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#FF8C42] flex-shrink-0 mt-0.5" />
                  <span>One blood donation can save up to 3 lives</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#FF8C42] flex-shrink-0 mt-0.5" />
                  <span>Every 2 seconds someone needs blood</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#FF8C42] flex-shrink-0 mt-0.5" />
                  <span>You can donate blood every 56 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#FF8C42] flex-shrink-0 mt-0.5" />
                  <span>Type O- is the universal donor blood type</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-0 rounded-2xl">
              <h3 className="text-gray-900 mb-4">Blood Compatibility</h3>
              <div className="space-y-3">
                {bloodGroups.map((group) => (
                  <div key={group} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-[#FF8C42]" />
                      <span>{group}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="rounded-lg">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
