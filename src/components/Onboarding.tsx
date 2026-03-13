import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { setOnboardingDone, getStoredUser, updateProfile, AUTH_USER_KEY } from '../api/auth';
import PatientOnboardingForm from './PatientOnboardingForm';
import type { PatientFormData } from './PatientOnboardingForm';

/** Allowed redirect paths after completing profile (avoid open redirect) */
const ALLOWED_FROM_PATHS = ['/doctors', '/profile', '/services', '/service', '/emergency', '/blood-request', '/chat', '/payments', '/'];

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get('from');
  const from = (() => {
    if (!fromParam || !fromParam.startsWith('/')) return null;
    const path = fromParam.split('?')[0];
    return ALLOWED_FROM_PATHS.some((allowed) => path === allowed || (allowed !== '/' && path.startsWith(allowed))) ? fromParam : null;
  })();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const storedUser = getStoredUser();

  const handleSubmit = async (data: PatientFormData) => {
    setError('');
    setSaving(true);
    const name = data.name ?? [data.first_name, data.last_name].filter(Boolean).join(' ').trim();
    const address = data.address?.trim() || [data.address_line1, data.address_line2, data.state].filter(Boolean).join(', ').trim() || undefined;
    const profileData = {
      name: name || 'User',
      gender: data.gender || 'other',
      date_of_birth: data.date_of_birth || undefined,
      address: address || undefined,
    };
    try {
      const user = await updateProfile(profileData);
      try {
        const stored = getStoredUser();
        if (stored) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ ...stored, ...user }));
        }
      } catch {
        // ignore
      }
    } catch {
      // PUT /api/me/profile failed: save profile locally and continue
      try {
        const stored = getStoredUser();
        if (stored) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ ...stored, ...profileData }));
        }
      } catch {
        // ignore
      }
    } finally {
      setSaving(false);
    }
    setOnboardingDone();
    navigate(from ?? '/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1F6FB2] to-[#1BC47D] rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-[#1F6FB2] mb-2">Welcome to LifeLink</h1>
          <p className="text-gray-600">Complete your profile to get started</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          {error && <p className="text-sm text-red-600 mb-4" role="alert">{error}</p>}
          <PatientOnboardingForm
            isSelf
            initialPhone={typeof storedUser?.phone === 'string' ? storedUser.phone : ''}
            initialEmail={typeof storedUser?.email === 'string' ? storedUser.email : ''}
            title="Complete your profile"
            submitLabel="Continue"
            onSubmit={handleSubmit}
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
}
