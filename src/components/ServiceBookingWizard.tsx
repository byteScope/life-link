import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Phone, User, Calendar as CalendarIcon, Clock, X, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

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
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedDateTimes, setSelectedDateTimes] = useState<Record<string, string>>({});
  const [useSameTime, setUseSameTime] = useState(true);
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState('');
  const [recurringWeeks, setRecurringWeeks] = useState(4);
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Reset state when wizard opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setWhenNeedCare('');
      setCareType('');
      setSelectedDates([]);
      setSelectedDateTimes({});
      setUseSameTime(true);
      setSelectedTime('');
      setSessionDuration('');
      setIsRecurring(false);
      setRecurringPattern('');
      setRecurringWeeks(4);
      setZipCode('');
      setCity('');
      setPhone('');
      setFirstName('');
      setLastName('');
    }
  }, [isOpen]);

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

  // Available time slots
  const timeSlots = [
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  ];

  const durationOptions = [
    { value: '30', label: '30 minutes', price: '$60' },
    { value: '60', label: '60 minutes', price: '$100' },
    { value: '90', label: '90 minutes', price: '$140' },
  ];

  const recurringOptions = [
    { value: 'weekly', label: 'Every week', description: 'Same day each week' },
    { value: 'bi-weekly', label: 'Every 2 weeks', description: 'Bi-weekly sessions' },
  ];

  const getTotalSteps = () => {
    // Step 1: When, Step 2: Care Type, Step 3: Dates, Step 4: Time, Step 5: Duration, Step 6: Location
    // Step 7-8: Auth (if not authenticated), Step 9: Review
    return isAuthenticated ? 6 : 8;
  };

  // Handle date selection (multi-select)
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const isSelected = selectedDates.some(d => format(d, 'yyyy-MM-dd') === dateStr);
    
    if (isSelected) {
      // Remove date
      setSelectedDates(selectedDates.filter(d => format(d, 'yyyy-MM-dd') !== dateStr));
      const newTimes = { ...selectedDateTimes };
      delete newTimes[dateStr];
      setSelectedDateTimes(newTimes);
    } else {
      // Add date
      setSelectedDates([...selectedDates, date].sort((a, b) => a.getTime() - b.getTime()));
      // If using same time, auto-assign the selected time
      if (useSameTime && selectedTime) {
        setSelectedDateTimes({ ...selectedDateTimes, [dateStr]: selectedTime });
      }
    }
  };

  // Generate recurring dates
  const generateRecurringDates = (startDate: Date, pattern: string, weeks: number) => {
    const dates: Date[] = [startDate];
    const interval = pattern === 'weekly' ? 7 : 14;
    
    for (let i = 1; i < weeks; i++) {
      const nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + (interval * i));
      dates.push(nextDate);
    }
    
    return dates;
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1 && !whenNeedCare) return;
    if (currentStep === 2 && !careType) return;
    if (currentStep === 3 && selectedDates.length === 0) return;
    if (currentStep === 4) {
      if (useSameTime && !selectedTime) return;
      if (!useSameTime) {
        const allDatesHaveTime = selectedDates.every(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          return selectedDateTimes[dateStr];
        });
        if (!allDatesHaveTime) return;
      }
    }
    if (currentStep === 5 && !sessionDuration) return;
    if (currentStep === 6 && !zipCode) return;
    if (!isAuthenticated) {
      if (currentStep === 7 && !phone) return;
      if (currentStep === 8 && (!firstName || !lastName)) return;
    }

    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the flow
      if (!isAuthenticated) {
        onAuthenticate(phone, firstName, lastName);
      }
      // Navigate to services with filters and booking data
      const datesParam = selectedDates.map(d => format(d, 'yyyy-MM-dd')).join(',');
      const timesParam = useSameTime 
        ? selectedTime 
        : selectedDates.map(d => selectedDateTimes[format(d, 'yyyy-MM-dd')]).join(',');
      navigate(`/services?category=${serviceCategory}&when=${whenNeedCare}&type=${careType}&zip=${zipCode}&dates=${datesParam}&times=${timesParam}&duration=${sessionDuration}`);
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
    } else if (currentStep === 5) {
      setSessionDuration(value);
    }
  };

  const removeDate = (dateToRemove: Date) => {
    const dateStr = format(dateToRemove, 'yyyy-MM-dd');
    setSelectedDates(selectedDates.filter(d => format(d, 'yyyy-MM-dd') !== dateStr));
    const newTimes = { ...selectedDateTimes };
    delete newTimes[dateStr];
    setSelectedDateTimes(newTimes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative my-8 max-h-[90vh] overflow-y-auto">
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

        {/* Step 3: Date Selection */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select your preferred dates</h2>
            <p className="text-gray-600 mb-4 text-sm">You can select multiple dates for your sessions</p>
            
            {/* Recurring Option (only for physiotherapy) */}
            {serviceCategory === 'physiotherapy' && (
              <Card className="p-4 mb-4 border-2 rounded-xl cursor-pointer transition-all"
                onClick={() => setIsRecurring(!isRecurring)}
                style={{ 
                  borderColor: isRecurring ? '#1BC47D' : '#E5E7EB',
                  backgroundColor: isRecurring ? '#F0FDF4' : 'white'
                }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5" style={{ color: isRecurring ? '#1BC47D' : '#6B7280' }} />
                    <div>
                      <div className="font-semibold text-gray-900">Recurring sessions</div>
                      <div className="text-sm text-gray-600">Book multiple sessions at once</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                </div>
              </Card>
            )}

            {/* Recurring Pattern Selection */}
            {isRecurring && serviceCategory === 'physiotherapy' && (
              <div className="mb-4 space-y-3">
                <Label className="text-gray-700 font-medium">How often?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {recurringOptions.map((option) => (
                    <Card
                      key={option.value}
                      onClick={() => setRecurringPattern(option.value)}
                      className={`p-3 cursor-pointer transition-all border-2 rounded-xl ${
                        recurringPattern === option.value
                          ? 'border-[#1BC47D] bg-[#F0FDF4]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 text-sm">{option.label}</div>
                      <div className="text-xs text-gray-600">{option.description}</div>
                    </Card>
                  ))}
                </div>
                {recurringPattern && (
                  <div className="mt-3">
                    <Label className="text-gray-700 font-medium mb-2 block">For how many weeks?</Label>
                    <Input
                      type="number"
                      min="2"
                      max="12"
                      value={recurringWeeks}
                      onChange={(e) => setRecurringWeeks(parseInt(e.target.value) || 4)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Date Input */}
            <div className="mb-4 space-y-3">
              <div>
                <Label className="text-gray-700 font-medium mb-2 block">Add a date</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => {
                      if (e.target.value) {
                        const newDate = new Date(e.target.value);
                        const dateStr = format(newDate, 'yyyy-MM-dd');
                        const isSelected = selectedDates.some(d => format(d, 'yyyy-MM-dd') === dateStr);
                        
                        if (!isSelected) {
                          if (isRecurring && recurringPattern) {
                            // Generate recurring dates
                            const generatedDates = generateRecurringDates(newDate, recurringPattern, recurringWeeks);
                            setSelectedDates([...selectedDates, ...generatedDates].sort((a, b) => a.getTime() - b.getTime()));
                            if (useSameTime && selectedTime) {
                              const times: Record<string, string> = {};
                              generatedDates.forEach(date => {
                                times[format(date, 'yyyy-MM-dd')] = selectedTime;
                              });
                              setSelectedDateTimes({ ...selectedDateTimes, ...times });
                            }
                          } else {
                            // Add single date
                            setSelectedDates([...selectedDates, newDate].sort((a, b) => a.getTime() - b.getTime()));
                            if (useSameTime && selectedTime) {
                              setSelectedDateTimes({ ...selectedDateTimes, [dateStr]: selectedTime });
                            }
                          }
                          e.target.value = ''; // Clear input after selection
                        }
                      }
                    }}
                    className="h-12 rounded-xl"
                    placeholder="Select date"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const dateStr = format(today, 'yyyy-MM-dd');
                      const isSelected = selectedDates.some(d => format(d, 'yyyy-MM-dd') === dateStr);
                      
                      if (!isSelected) {
                        if (isRecurring && recurringPattern) {
                          const generatedDates = generateRecurringDates(today, recurringPattern, recurringWeeks);
                          setSelectedDates([...selectedDates, ...generatedDates].sort((a, b) => a.getTime() - b.getTime()));
                          if (useSameTime && selectedTime) {
                            const times: Record<string, string> = {};
                            generatedDates.forEach(date => {
                              times[format(date, 'yyyy-MM-dd')] = selectedTime;
                            });
                            setSelectedDateTimes({ ...selectedDateTimes, ...times });
                          }
                        } else {
                          setSelectedDates([...selectedDates, today].sort((a, b) => a.getTime() - b.getTime()));
                          if (useSameTime && selectedTime) {
                            setSelectedDateTimes({ ...selectedDateTimes, [dateStr]: selectedTime });
                          }
                        }
                      }
                    }}
                    variant="outline"
                    className="h-12 rounded-xl"
                  >
                    Today
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Click "Today" or select a date to add it</p>
              </div>
            </div>

            {/* Selected Dates Chips */}
            {selectedDates.length > 0 && (
              <div className="mt-4">
                <Label className="text-gray-700 font-medium mb-2 block">Selected dates ({selectedDates.length})</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {selectedDates.map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    return (
                      <Badge
                        key={dateStr}
                        className="px-3 py-1.5 rounded-full bg-[#1BC47D] text-white flex items-center gap-2"
                      >
                        <CalendarIcon className="w-3 h-3" />
                        {format(date, 'MMM d, yyyy')}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDate(date);
                          }}
                          className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Time Selection */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select time slots</h2>
            <p className="text-gray-600 mb-4 text-sm">Choose preferred times for your sessions</p>

            {/* Same time for all or different times */}
            {selectedDates.length > 1 && (
              <Card className="p-4 mb-4 border-2 rounded-xl cursor-pointer transition-all"
                onClick={() => setUseSameTime(!useSameTime)}
                style={{ 
                  borderColor: useSameTime ? '#1BC47D' : '#E5E7EB',
                  backgroundColor: useSameTime ? '#F0FDF4' : 'white'
                }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Use same time for all dates</div>
                    <div className="text-sm text-gray-600">All sessions at the same time</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={useSameTime}
                    onChange={(e) => setUseSameTime(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                </div>
              </Card>
            )}

            {useSameTime ? (
              <div>
                <Label className="text-gray-700 font-medium mb-3 block">Select time for all sessions</Label>
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      onClick={() => {
                        setSelectedTime(time);
                        // Update all dates with this time
                        const times: Record<string, string> = {};
                        selectedDates.forEach(date => {
                          times[format(date, 'yyyy-MM-dd')] = time;
                        });
                        setSelectedDateTimes(times);
                      }}
                      className={`h-10 rounded-xl text-sm ${
                        selectedTime === time
                          ? 'bg-[#1BC47D] text-white border-[#1BC47D]'
                          : 'border-gray-200'
                      }`}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedDates.map((date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return (
                    <div key={dateStr} className="border rounded-xl p-4">
                      <Label className="text-gray-700 font-medium mb-3 block">
                        {format(date, 'EEEE, MMM d, yyyy')}
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            onClick={() => {
                              setSelectedDateTimes({ ...selectedDateTimes, [dateStr]: time });
                            }}
                            className={`h-10 rounded-xl text-sm ${
                              selectedDateTimes[dateStr] === time
                                ? 'bg-[#1BC47D] text-white border-[#1BC47D]'
                                : 'border-gray-200'
                            }`}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Session Duration */}
        {currentStep === 5 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Session duration</h2>
            <p className="text-gray-600 mb-6 text-sm">How long should each session be?</p>
            <div className="space-y-3">
              {durationOptions.map((option) => (
                <Card
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`p-4 cursor-pointer transition-all border-2 rounded-xl ${
                    sessionDuration === option.value
                      ? 'border-[#1BC47D] bg-[#F0FDF4]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                    </div>
                    <div className="font-bold text-[#1BC47D]">{option.price}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Where do you need care? */}
        {currentStep === 6 && (
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

        {/* Step 7: Mobile Number (if not authenticated) */}
        {currentStep === 7 && !isAuthenticated && (
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

        {/* Step 8: First Name & Last Name (if not authenticated) */}
        {currentStep === 8 && !isAuthenticated && (
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

        {/* Step 7/9: Review/Ready (if authenticated, show at step 7; if not, step 9) */}
        {((isAuthenticated && currentStep === 7) || (!isAuthenticated && currentStep === 9)) && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review your booking</h2>
            <div className="space-y-4 bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-semibold text-gray-900">{serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-semibold text-gray-900">
                  {getCareTypeOptions().find(opt => opt.value === careType)?.label || careType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sessions:</span>
                <span className="font-semibold text-gray-900">{selectedDates.length} session(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-900">
                  {durationOptions.find(opt => opt.value === sessionDuration)?.label || sessionDuration} min
                </span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="text-sm text-gray-600 mb-2">Selected dates:</div>
                <div className="space-y-1">
                  {selectedDates.map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const time = useSameTime ? selectedTime : selectedDateTimes[dateStr];
                    return (
                      <div key={dateStr} className="text-sm flex justify-between">
                        <span className="text-gray-700">{format(date, 'MMM d, yyyy')}</span>
                        <span className="text-gray-900 font-medium">{time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="text-gray-600 mt-4 text-sm">
              We'll show you available {serviceTitle.toLowerCase()} providers matching your preferences.
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
              (currentStep === 3 && selectedDates.length === 0) ||
              (currentStep === 4 && ((useSameTime && !selectedTime) || (!useSameTime && !selectedDates.every(date => selectedDateTimes[format(date, 'yyyy-MM-dd')])))) ||
              (currentStep === 5 && !sessionDuration) ||
              (currentStep === 6 && !zipCode) ||
              (currentStep === 7 && !isAuthenticated && !phone) ||
              (currentStep === 8 && !isAuthenticated && (!firstName || !lastName))
            }
          >
            {currentStep === getTotalSteps() ? 'Find Care' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}

