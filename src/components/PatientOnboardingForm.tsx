import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { CreatePatientBody } from '../api';

export interface PatientFormData extends CreatePatientBody {}

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
] as const;

interface PatientOnboardingFormProps {
  /** Pre-fill phone (e.g. for "for self") */
  initialPhone?: string;
  /** Pre-fill email */
  initialEmail?: string;
  /** User ID to link patient to (from JWT) */
  userId?: number;
  /** true = self (logged-in user); false = family/other. Sets is_self in payload. */
  isSelf?: boolean;
  /** Title above form */
  title?: string;
  submitLabel?: string;
  onSubmit: (data: PatientFormData) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export default function PatientOnboardingForm({
  initialPhone = '',
  initialEmail = '',
  userId,
  isSelf = false,
  title = 'Patient details',
  submitLabel = 'Continue',
  onSubmit,
  onCancel,
  loading = false,
}: PatientOnboardingFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [emailAddress, setEmailAddress] = useState(initialEmail);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [state, setState] = useState('');
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const nameVal = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ').trim();
    if (!nameVal || !gender) {
      setError('Name and gender are required.');
      return;
    }
    const addressVal = [addressLine1.trim(), addressLine2.trim(), state.trim()].filter(Boolean).join(', ').trim() || undefined;
    const data: PatientFormData = {
      name: nameVal,
      first_name: firstName.trim() || undefined,
      last_name: lastName.trim() || undefined,
      gender,
      is_self: isSelf,
      phone_number: phoneNumber.trim() || undefined,
      email_address: emailAddress.trim() || undefined,
      address: addressVal,
      address_line1: addressLine1.trim() || undefined,
      address_line2: addressLine2.trim() || undefined,
      state: state.trim() || undefined,
      country_id: countryId,
    };
    if (userId != null) data.user_id = userId;
    if (dateOfBirth.trim()) data.date_of_birth = dateOfBirth.trim();
    try {
      await onSubmit(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First name *</Label>
          <Input
            id="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last name *</Label>
          <Input
            id="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="rounded-xl"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Gender *</Label>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setGender(g.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                gender === g.value
                  ? 'bg-[#1F6FB2] text-white border-[#1F6FB2]'
                  : 'bg-white border-gray-200 hover:border-[#1F6FB2] text-gray-700'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="date_of_birth">Date of birth</Label>
        <Input
          id="date_of_birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone_number">Phone number</Label>
        <Input
          id="phone_number"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+880 1XXX-XXXXXX"
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email_address">Email</Label>
        <Input
          id="email_address"
          type="email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          placeholder="email@example.com"
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address_line1">Address line 1</Label>
        <Input
          id="address_line1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          placeholder="Street, area"
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address_line2">Address line 2</Label>
        <Input
          id="address_line2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          placeholder="Optional"
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">State / Division</Label>
        <Input
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="e.g. Dhaka"
          className="rounded-xl"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-xl flex-1"
          style={{ backgroundColor: '#1F6FB2' }}
        >
          {loading ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
