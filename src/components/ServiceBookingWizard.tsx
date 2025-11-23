import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { MapPin, Phone, User } from 'lucide-react';

interface ServiceBookingWizardProps {
  serviceTitle: string;
  serviceCategory: string;
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onAuthenticate: (phone: string, firstName: string, lastName: string) => void;
}

export default function ServiceBookingWizard({
  serviceTitle,
  serviceCategory,
  isOpen,
  onClose,
  isAuthenticated,
  onAuthenticate,
}: ServiceBookingWizardProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [whenNeedCare, setWhenNeedCare] = useState('');
  const [careType, setCareType] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  if (!isOpen) return null;

  const whenOptions = [
    { value: 'right-now', label: 'Right now' },
    { value: 'within-week', label: 'Within a week' },
    { value: '1-2-months', label: 'In 1-2 months' },
    { value: 'browsing', label: 'Just browsing' },
  ];

  const getCareTypeOptions = () => {
    const options: Record<string, Array<{ value: string; label: string; description: string }>> = {
      physiotherapy: [
        { value: 'home-visit', label: 'Home visit', description: 'Physiotherapist comes to your home' },
        { value: 'clinic', label: 'Clinic visit', description: 'Visit our partner clinics' },
        { value: 'online', label: 'Online consultation', description: 'Virtual physiotherapy sessions' },
      ],
      caregiver: [
        { value: 'elderly-care', label: 'Elderly care', description: 'Professional care for seniors' },
        { value: 'disabled-care', label: 'Disabled adult care', description: 'Specialized care services' },
        { value: 'hospital-attendant', label: 'Hospital attendant', description: 'In-hospital care support' },
      ],
      babysitter: [
        { value: 'recurring', label: 'Recurring babysitter', description: 'Regular hours, ongoing care, full or part-time' },
        { value: 'one-time', label: 'One-time sitter', description: 'Instantly book for events, occasional plans or backup care' },
        { value: 'full-time', label: 'Full-time nanny', description: 'Daily care and support' },
      ],
      'pet-care': [
        { value: 'boarding', label: 'Pet boarding', description: '3-10 days boarding service' },
        { value: 'sitting', label: 'Pet sitting', description: 'In-home pet care' },
        { value: 'walking', label: 'Dog walking', description: 'Regular dog walking service' },
      ],
    };
    return options[serviceCategory] || [
      { value: 'standard', label: 'Standard service', description: 'Book this service' },
    ];
  };

  const getTotalSteps = () => {
    return isAuthenticated ? 3 : 5;
  };

  const handleNext = () => {
    if (currentStep === 1 && !whenNeedCare) return;
    if (currentStep === 2 && !careType) return;
    if (currentStep === 3 && !zipCode) return;
    if (!isAuthenticated) {
      if (currentStep === 4 && !phone) return;
      if (currentStep === 5 && (!firstName || !lastName)) return;
    }

    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the flow
      if (!isAuthenticated) {
        onAuthenticate(phone, firstName, lastName);
      }
      // Navigate to services with filters
      navigate(`/services?category=${serviceCategory}&when=${whenNeedCare}&type=${careType}&zip=${zipCode}`);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOptionSelect = (value: string) => {
    if (currentStep === 1) {
      setWhenNeedCare(value);
    } else if (currentStep === 2) {
      setCareType(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of {getTotalSteps()}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / getTotalSteps()) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#1BC47D] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: When do you need care? */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">When do you need care?</h2>
            <div className="space-y-3">
              {whenOptions.map((option) => (
                <Card
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`p-4 cursor-pointer transition-all border-2 rounded-xl ${
                    whenNeedCare === option.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{option.label}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: What kind of care? */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What kind of care?</h2>
            <div className="space-y-3">
              {getCareTypeOptions().map((option) => (
                <Card
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`p-4 cursor-pointer transition-all border-2 rounded-xl ${
                    careType === option.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Where do you need care? */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Where do you need care?</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600 mb-2 block">ZIP code</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Enter ZIP code"
                    value={zipCode}
                    onChange={(e) => {
                      setZipCode(e.target.value);
                      // Simulate city detection
                      if (e.target.value.length === 5) {
                        setCity('Detected City, State');
                      }
                    }}
                    className="pl-10 h-12 rounded-xl"
                    maxLength={5}
                  />
                </div>
                {city && (
                  <p className="text-sm text-gray-500 mt-2">{city}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Mobile Number (if not authenticated) */}
        {currentStep === 4 && !isAuthenticated && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter your mobile number</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600 mb-2 block">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">We'll send you a verification code</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: First Name & Last Name (if not authenticated) */}
        {currentStep === 5 && !isAuthenticated && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600 mb-2 block">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-600 mb-2 block">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: If authenticated, show ready message */}
        {currentStep === 4 && isAuthenticated && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to find care?</h2>
            <p className="text-gray-600 mb-6">
              We'll show you available {serviceTitle.toLowerCase()} providers in your area.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 rounded-xl"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 rounded-xl"
            style={{ backgroundColor: '#1BC47D' }}
            disabled={
              (currentStep === 1 && !whenNeedCare) ||
              (currentStep === 2 && !careType) ||
              (currentStep === 3 && !zipCode) ||
              (currentStep === 4 && !isAuthenticated && !phone) ||
              (currentStep === 5 && !isAuthenticated && (!firstName || !lastName))
            }
          >
            {currentStep === getTotalSteps() ? 'Find Care' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}

