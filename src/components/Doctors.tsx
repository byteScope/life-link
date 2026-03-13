import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Search,
  Star,
  Video,
  Building2,
  Calendar,
  Clock,
  ChevronRight,
  User,
  Users,
  Loader2,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { listDoctors, getPatientsMe, createPatient, createAppointment, patientDisplayName, type Doctor, type Patient } from '../api';
import { getStoredToken, getStoredUser, getStoredSelfPatient, setStoredSelfPatient } from '../api/auth';
import PatientOnboardingForm from './PatientOnboardingForm';
import type { PatientFormData } from './PatientOnboardingForm';

type ConsultType = 'in-person' | 'video';

const SPECIALIZATIONS = [
  'All',
  'General Practice',
  'Internal Medicine',
  'Pediatrics',
  'Cardiology',
  'Dermatology',
  'Mental Health',
];

/** Map API doctor to display shape; fallbacks for missing fields */
function toDisplayDoctor(d: Doctor): {
  id: string;
  name: string;
  spec: string;
  rating: number;
  reviews: number;
  initial: string;
  nextAvailable: string;
  inPerson: boolean;
  video: boolean;
} {
  const name = d.name ?? 'Doctor';
  const spec = (d.specialty ?? 'General Practice').trim();
  const nextSlot = (d as { next_slot?: string }).next_slot;
  return {
    id: d.id,
    name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
    spec,
    rating: typeof d.rating === 'number' ? d.rating : 4.5,
    reviews: typeof d.reviews === 'number' ? d.reviews : 0,
    initial: name.replace(/^Dr\.\s*/, '').charAt(0).toUpperCase() || 'D',
    nextAvailable: nextSlot ?? '—',
    inPerson: true,
    video: true,
  };
}

/** RFC3339 for POST /api/appointments */
function toSlotISO(date: Date, timeLabel: string): string {
  const [hourMin, period] = timeLabel.replace(/\s/g, '').match(/(\d+):(\d+)(AM|PM)/i)?.slice(1) ?? ['9', '0', 'AM'];
  let h = parseInt(hourMin, 10);
  const m = parseInt((timeLabel.match(/:(\d+)/) ?? [])[1] ?? '0', 10);
  if (period?.toUpperCase() === 'PM' && h !== 12) h += 12;
  if (period?.toUpperCase() === 'AM' && h === 12) h = 0;
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

/** Fallback when API fails or returns empty (e.g. backend not running) */
const FALLBACK_DOCTORS: ReturnType<typeof toDisplayDoctor>[] = [
  { id: 'd1', name: 'Dr. Sarah Chen', spec: 'General Practice', rating: 4.8, reviews: 342, initial: 'S', nextAvailable: 'Today', inPerson: true, video: true },
  { id: 'd2', name: 'Dr. James Wilson', spec: 'Internal Medicine', rating: 4.9, reviews: 520, initial: 'J', nextAvailable: 'Tomorrow', inPerson: true, video: true },
  { id: 'd3', name: 'Dr. Priya Sharma', spec: 'Pediatrics', rating: 4.7, reviews: 218, initial: 'P', nextAvailable: 'Today', inPerson: true, video: true },
  { id: 'd4', name: 'Dr. Michael Brown', spec: 'Cardiology', rating: 4.6, reviews: 189, initial: 'M', nextAvailable: 'Mar 6', inPerson: true, video: true },
  { id: 'd5', name: 'Dr. Emily Davis', spec: 'Dermatology', rating: 4.9, reviews: 412, initial: 'E', nextAvailable: 'Tomorrow', inPerson: true, video: true },
  { id: 'd6', name: 'Dr. David Lee', spec: 'Mental Health', rating: 4.8, reviews: 156, initial: 'D', nextAvailable: 'Today', inPerson: false, video: true },
];

export default function Doctors() {
  const navigate = useNavigate();
  const [consultType, setConsultType] = useState<ConsultType>('in-person');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [doctors, setDoctors] = useState<ReturnType<typeof toDisplayDoctor>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<ReturnType<typeof toDisplayDoctor> | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  // Booking flow: who → pick-patient (for "other") or patient-form or slot
  const [bookingStep, setBookingStep] = useState<'who' | 'pick-patient' | 'patient-form' | 'slot'>('who');
  const [forSelf, setForSelf] = useState<boolean | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [allPatientsList, setAllPatientsList] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [creatingPatient, setCreatingPatient] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setUsingFallback(false);
    if (import.meta.env.DEV) {
      console.log('[Doctors] Fetching doctors from API...');
    }
    listDoctors()
      .then((list) => {
        if (cancelled) return;
        if (import.meta.env.DEV) {
          console.log('[Doctors] API response:', Array.isArray(list) ? list.length : 0, 'doctors');
        }
        if (Array.isArray(list) && list.length > 0) {
          setDoctors(list.map(toDisplayDoctor));
        } else {
          setDoctors(FALLBACK_DOCTORS);
          setUsingFallback(true);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          if (import.meta.env.DEV) {
            console.warn('[Doctors] API failed:', e);
          }
          setError(e instanceof Error ? e.message : 'Failed to load doctors');
          setDoctors(FALLBACK_DOCTORS);
          setUsingFallback(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.spec.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpec = selectedSpec === 'All' || doc.spec.toLowerCase() === selectedSpec.toLowerCase();
      const matchesType = consultType === 'video' ? doc.video : doc.inPerson;
      return matchesSearch && matchesSpec && matchesType;
    });
  }, [doctors, searchQuery, selectedSpec, consultType]);

  const handleBookClick = (doctor: ReturnType<typeof toDisplayDoctor>) => {
    if (!getStoredToken()) {
      navigate('/login?from=' + encodeURIComponent('/doctors'));
      return;
    }
    setSelectedDoctor(doctor);
    setSelectedDate(null);
    setSelectedTime('');
    setBookingError(null);
    setBookingStep('who');
    setForSelf(null);
    setSelectedPatientId(null);
    setBookingOpen(true);
  };

  const handleWhoSelf = async () => {
    setBookingError(null);
    const selfFromStorage = getStoredSelfPatient();
    if (selfFromStorage?.id != null) {
      setSelectedPatientId(selfFromStorage.id as number);
      setBookingStep('slot');
      return;
    }
    setLoadingPatients(true);
    try {
      const list = await getPatientsMe(true);
      if (list && list.length > 0) {
        setSelectedPatientId(list[0].id);
        setBookingStep('slot');
      } else {
        setForSelf(true);
        setBookingStep('patient-form');
      }
    } catch (e) {
      setBookingError(e instanceof Error ? e.message : 'Failed to load your profile');
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleWhoOther = async () => {
    setForSelf(false);
    setBookingError(null);
    setLoadingPatients(true);
    try {
      const list = await getPatientsMe();
      setAllPatientsList(list ?? []);
      setBookingStep('pick-patient');
    } catch (e) {
      setBookingError(e instanceof Error ? e.message : 'Failed to load patients');
    } finally {
      setLoadingPatients(false);
    }
  };

  const handlePickPatient = (patientId: number) => {
    setSelectedPatientId(patientId);
    setBookingStep('slot');
  };

  const handleAddNewFamilyMember = () => {
    setBookingStep('patient-form');
  };

  const handlePatientSubmit = async (data: PatientFormData) => {
    setCreatingPatient(true);
    setBookingError(null);
    try {
      const created = await createPatient(data);
      if (forSelf) setStoredSelfPatient(created as { id: number; name?: string; is_self?: boolean; [key: string]: unknown });
      setSelectedPatientId(created.id);
      setBookingStep('slot');
    } catch (e) {
      setBookingError(e instanceof Error ? e.message : 'Failed to save patient');
      throw e;
    } finally {
      setCreatingPatient(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || selectedPatientId == null) {
      if (selectedPatientId == null) setBookingError('Please select who the appointment is for.');
      return;
    }
    setBookingSubmitting(true);
    setBookingError(null);
    try {
      const appointment = await createAppointment({
        patient_id: selectedPatientId,
        doctor_id: parseInt(selectedDoctor.id, 10) || undefined,
        appointment_datetime: toSlotISO(selectedDate, selectedTime),
        reason: `${consultType === 'video' ? 'Video' : 'In-person'} consultation`,
      });
      const bookingId = String((appointment as { id?: number }).id ?? '');
      setBookingOpen(false);
      setSelectedDoctor(null);
      setSelectedDate(null);
      setSelectedTime('');
      setSelectedPatientId(null);
      setBookingStep('who');
      navigate('/payments', {
        state: {
          bookingId,
          service: `Doctor consultation (${consultType === 'video' ? 'Video' : 'In-person'})`,
          provider: selectedDoctor.name,
          date: format(selectedDate, 'MMM d, yyyy'),
          time: selectedTime,
          total: consultType === 'video' ? 45 : 55,
        },
      });
    } catch (e) {
      setBookingError(e instanceof Error ? e.message : 'Booking failed');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const nextDays = [0, 1, 2, 3, 4].map((i) => addDays(new Date(), i));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Doctor</h1>
          <p className="text-gray-600 text-lg">Choose in-person visit or video consultation. Book an appointment with verified doctors.</p>
        </div>

        {/* Consult type toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setConsultType('in-person')}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              consultType === 'in-person'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            In-person visit
          </button>
          <button
            type="button"
            onClick={() => setConsultType('video')}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              consultType === 'video'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Video className="w-4 h-4" />
            Video consultation
          </button>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by doctor name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS.map((spec) => (
              <Button
                key={spec}
                variant={selectedSpec === spec ? 'default' : 'outline'}
                size="sm"
                className="rounded-xl"
                style={selectedSpec === spec ? { backgroundColor: '#1F6FB2' } : {}}
                onClick={() => setSelectedSpec(spec)}
              >
                {spec}
              </Button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-800 text-sm">
            {error} Showing sample list below. Start the life-link backend (port 8080) to load real doctors.
          </div>
        )}
        {usingFallback && !error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 text-amber-800 text-sm">
            No doctors from server. Showing sample list. Start the life-link backend (port 8080) to load real doctors.
          </div>
        )}
        {loading && (
          <div className="py-8 text-center text-gray-500">Loading doctors…</div>
        )}
        {/* Doctor cards */}
        {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <Card key={doc.id} className="p-6 rounded-2xl border bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#1F6FB2]/20 flex items-center justify-center text-[#1F6FB2] font-semibold text-lg">
                    {doc.initial}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.spec}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-medium">{doc.rating}</span>
                  <span className="text-gray-400">({doc.reviews})</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {doc.inPerson && (
                  <Badge variant="secondary" className="rounded-lg">
                    <Building2 className="w-3 h-3 mr-1" />
                    In-person
                  </Badge>
                )}
                {doc.video && (
                  <Badge variant="secondary" className="rounded-lg">
                    <Video className="w-3 h-3 mr-1" />
                    Video
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Next available: <span className="font-medium text-gray-900">{doc.nextAvailable}</span>
              </p>
              <Button
                className="w-full rounded-xl"
                style={{ backgroundColor: '#1BC47D' }}
                onClick={() => handleBookClick(doc)}
              >
                Book appointment
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>
          ))}
        </div>

        )}
        {!loading && filteredDoctors.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No doctors match your filters. Try changing consultation type or search.</p>
          </div>
        )}
      </main>

      <Footer />

      {/* Booking dialog */}
      <Dialog
        open={bookingOpen}
        onOpenChange={(open) => {
          setBookingOpen(open);
          if (!open) {
            setBookingStep('who');
            setForSelf(null);
            setSelectedPatientId(null);
            setAllPatientsList([]);
          }
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Book appointment</DialogTitle>
          </DialogHeader>
          {selectedDoctor && (
            <>
              {bookingStep === 'who' && (
                <div className="space-y-6">
                  <p className="text-gray-600">Who is this appointment for?</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto py-6 rounded-xl flex flex-col items-center gap-2"
                      onClick={handleWhoSelf}
                      disabled={loadingPatients}
                    >
                      {loadingPatients ? (
                        <Loader2 className="w-8 h-8 animate-spin text-[#1F6FB2]" />
                      ) : (
                        <User className="w-8 h-8 text-[#1F6FB2]" />
                      )}
                      <span className="font-medium">Myself</span>
                      <span className="text-xs text-gray-500">Use my profile</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto py-6 rounded-xl flex flex-col items-center gap-2"
                      onClick={handleWhoOther}
                      disabled={loadingPatients}
                    >
                      {loadingPatients ? (
                        <Loader2 className="w-8 h-8 animate-spin text-[#1F6FB2]" />
                      ) : (
                        <Users className="w-8 h-8 text-[#1F6FB2]" />
                      )}
                      <span className="font-medium">Someone else</span>
                      <span className="text-xs text-gray-500">Pick or add family member</span>
                    </Button>
                  </div>
                  {bookingError && <p className="text-sm text-red-600">{bookingError}</p>}
                </div>
              )}

              {bookingStep === 'pick-patient' && (
                <div className="space-y-6">
                  <p className="text-gray-600">Select a patient or add a new family member.</p>
                  {loadingPatients ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-8 h-8 animate-spin text-[#1F6FB2]" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {allPatientsList.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePickPatient(p.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#1F6FB2] hover:bg-[#1F6FB2]/5 text-left transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#1F6FB2]/20 flex items-center justify-center text-[#1F6FB2] font-semibold">
                            {patientDisplayName(p).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{patientDisplayName(p)}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddNewFamilyMember}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-300 hover:border-[#1F6FB2] text-gray-600 hover:text-[#1F6FB2] transition-colors"
                      >
                        <Users className="w-10 h-10 text-[#1F6FB2]" />
                        <span className="font-medium">Add new family member</span>
                      </button>
                    </div>
                  )}
                  <Button type="button" variant="outline" onClick={() => setBookingStep('who')} className="rounded-xl">
                    Back
                  </Button>
                  {bookingError && <p className="text-sm text-red-600">{bookingError}</p>}
                </div>
              )}

              {bookingStep === 'patient-form' && (
                <div className="max-h-[70vh] overflow-y-auto">
                  <PatientOnboardingForm
                    isSelf={forSelf ?? false}
                    title={forSelf ? 'Complete your profile' : 'Patient details'}
                    submitLabel="Continue to time slot"
                    initialPhone={forSelf ? (getStoredUser()?.phone as string) ?? '' : ''}
                    userId={getStoredUser() ? Number(getStoredUser()?.id) : undefined}
                    onSubmit={handlePatientSubmit}
                    onCancel={() => (forSelf ? setBookingStep('who') : setBookingStep('pick-patient'))}
                    loading={creatingPatient}
                  />
                  {bookingError && <p className="text-sm text-red-600 mt-2">{bookingError}</p>}
                </div>
              )}

              {bookingStep === 'slot' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-[#1F6FB2]/20 flex items-center justify-center text-[#1F6FB2] font-semibold">
                      {selectedDoctor.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedDoctor.name}</p>
                      <p className="text-sm text-gray-500">{selectedDoctor.spec}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {consultType === 'video' ? 'Video consultation' : 'In-person visit'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Select date
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {nextDays.map((day) => (
                        <button
                          key={day.toISOString()}
                          type="button"
                          onClick={() => setSelectedDate(day)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                            selectedDate?.toDateString() === day.toDateString()
                              ? 'bg-[#1F6FB2] text-white border-[#1F6FB2]'
                              : 'bg-white border-gray-200 hover:border-[#1F6FB2] text-gray-700'
                          }`}
                        >
                          {format(day, 'EEE, MMM d')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Select time
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 rounded-xl text-sm font-medium border transition-colors ${
                            selectedTime === slot
                              ? 'bg-[#1BC47D] text-white border-[#1BC47D]'
                              : 'bg-white border-gray-200 hover:border-[#1BC47D] text-gray-700'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {bookingError && (
                    <p className="text-sm text-red-600">{bookingError}</p>
                  )}
                  <Button
                    className="w-full rounded-xl"
                    style={{ backgroundColor: '#1BC47D' }}
                    disabled={!selectedDate || !selectedTime || selectedPatientId == null || bookingSubmitting}
                    onClick={handleConfirmBooking}
                  >
                    {bookingSubmitting ? 'Booking…' : 'Confirm & proceed to payment'}
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
