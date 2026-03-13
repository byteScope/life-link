import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Heart, Phone, Mail, Loader2 } from 'lucide-react';
import {
  normalizeBDPhone,
  isValidBDPhoneInput,
  sendOtp,
  verifyOtp,
  setAuthStorage,
  updateProfile,
  setOnboardingDone,
  getStoredUser,
  AUTH_USER_KEY,
} from '../api/auth';
import PatientOnboardingForm from './PatientOnboardingForm';
import type { PatientFormData } from './PatientOnboardingForm';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
  setIsAdmin?: (value: boolean) => void;
}

/** Safe redirect paths after login (avoid open redirect) */
const ALLOWED_FROM_PATHS = ['/doctors', '/profile', '/services', '/service', '/emergency', '/blood-request', '/chat', '/payments', '/'];

export default function Login({ setIsAuthenticated, setIsAdmin }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (() => {
    const p = new URLSearchParams(location.search).get('from');
    if (!p || !p.startsWith('/')) return null;
    const path = p.split('?')[0];
    return ALLOWED_FROM_PATHS.some((allowed) => path === allowed || (allowed !== '/' && path.startsWith(allowed))) ? p : null;
  })();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [sendOtpHint, setSendOtpHint] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setPhoneError('');
  };

  const handleSendOtp = async () => {
    setSendOtpHint('');
    if (loginMethod === 'phone') {
      const normalized = normalizeBDPhone(phone);
      if (!normalized || !isValidBDPhoneInput(phone)) {
        setPhoneError('Enter a valid Bangladesh mobile number (e.g. 01XXX-XXXXXX)');
        return;
      }
      setPhoneError('');
      setSendingOtp(true);
      try {
        await sendOtp(normalized, false);
        setShowOtp(true);
      } catch {
        setSendOtpHint('Could not send OTP. For demo, enter 123456.');
        setShowOtp(true);
      } finally {
        setSendingOtp(false);
      }
    } else {
      const trimmed = email.trim();
      if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setEmailError('Enter a valid email address');
        return;
      }
      setEmailError('');
      setSendingOtp(true);
      try {
        await sendOtp(trimmed, true);
        setShowOtp(true);
      } catch {
        setSendOtpHint('Could not send OTP. For demo, enter 123456.');
        setShowOtp(true);
      } finally {
        setSendingOtp(false);
      }
    }
  };

  const displayPhoneForOtp = () => {
    const n = normalizeBDPhone(phone);
    if (n) return `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
    return phone || 'your number';
  };

  const getPhoneOrEmail = () => (loginMethod === 'phone' ? normalizeBDPhone(phone) : email.trim());

  const handleLogin = async () => {
    const value = getPhoneOrEmail();
    if (!value) return;
    setOtpError('');
    setVerifying(true);
    try {
      const res = await verifyOtp(value, loginMethod === 'email', otp.trim());
      setAuthStorage(res.token, res.user, res.self_patient ?? null);
      setIsAuthenticated(true);
      if (setIsAdmin) setIsAdmin(false);
      const hasSelfPatient = res.self_patient != null;
      if (hasSelfPatient && from) {
        navigate(from, { replace: true });
      } else if (hasSelfPatient) {
        navigate('/');
      } else {
        setPendingFrom(from);
        setShowProfileModal(true);
      }
    } catch (e) {
      setOtpError(e instanceof Error ? e.message : 'Invalid OTP. Use 123456 for demo.');
    } finally {
      setVerifying(false);
    }
  };

  const handleProfileSubmit = async (data: PatientFormData) => {
    setProfileSaving(true);
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
      try {
        const stored = getStoredUser();
        if (stored) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ ...stored, ...profileData }));
        }
      } catch {
        // ignore
      }
    } finally {
      setProfileSaving(false);
    }
    setOnboardingDone();
    const target = pendingFrom ?? '/';
    setShowProfileModal(false);
    setPendingFrom(null);
    navigate(target, { replace: true });
  };

  const storedUser = getStoredUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1F6FB2] to-[#1BC47D] rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-[#1F6FB2] mb-2">LifeLink</h1>
          <p className="text-gray-600">Your Healthcare Partner</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Login</h2>

          <div className="space-y-6">
            {/* Login Method Toggle */}
            <div className="flex gap-2">
              <Button
                variant={loginMethod === 'phone' ? 'default' : 'outline'}
                onClick={() => { setLoginMethod('phone'); setPhoneError(''); setEmailError(''); }}
                className="flex-1 rounded-xl"
                style={loginMethod === 'phone' ? { backgroundColor: '#1F6FB2' } : {}}
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </Button>
              <Button
                variant={loginMethod === 'email' ? 'default' : 'outline'}
                onClick={() => { setLoginMethod('email'); setPhoneError(''); setEmailError(''); }}
                className="flex-1 rounded-xl"
                style={loginMethod === 'email' ? { backgroundColor: '#1F6FB2' } : {}}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>

            {/* Phone/Email Input */}
            {!showOtp && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{loginMethod === 'phone' ? 'Mobile number (Bangladesh)' : 'Email Address'}</Label>
                  {loginMethod === 'phone' ? (
                    <div className="flex rounded-xl border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      <span className="inline-flex items-center px-3 text-muted-foreground border-r border-input bg-muted/50 text-sm">
                        +880
                      </span>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="01XXX-XXXXXX"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        maxLength={14}
                        aria-invalid={!!phoneError}
                      />
                    </div>
                  ) : (
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                      className="rounded-xl"
                      aria-invalid={!!emailError}
                    />
                  )}
                  {(phoneError || emailError) && (
                    <p className="text-sm text-red-600" role="alert">{phoneError || emailError}</p>
                  )}
                </div>
                <Button
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="w-full rounded-xl"
                  style={{ backgroundColor: '#1F6FB2' }}
                >
                  {sendingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
                {sendOtpHint && (
                  <p className="text-sm text-amber-600">{sendOtpHint}</p>
                )}
              </div>
            )}

            {/* OTP Input */}
            {showOtp && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Enter OTP (6 digits)</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError(''); }}
                    maxLength={6}
                    className="rounded-xl text-center tracking-widest text-lg"
                    aria-invalid={!!otpError}
                  />
                  <p className="text-sm text-gray-500">
                    OTP sent to {loginMethod === 'phone' ? displayPhoneForOtp() : email}
                  </p>
                  {otpError && (
                    <p className="text-sm text-red-600" role="alert">{otpError}</p>
                  )}
                </div>
                <Button
                  onClick={handleLogin}
                  disabled={verifying || otp.length < 6}
                  className="w-full rounded-xl"
                  style={{ backgroundColor: '#1F6FB2' }}
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    'Verify & Login'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { setShowOtp(false); setOtp(''); setOtpError(''); setSendOtpHint(''); }}
                  disabled={verifying}
                  className="w-full rounded-xl"
                >
                  Change {loginMethod === 'phone' ? 'Phone' : 'Email'}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>

      <Dialog open={showProfileModal} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Complete your profile</DialogTitle>
          </DialogHeader>
          <PatientOnboardingForm
            isSelf
            initialPhone={typeof storedUser?.phone === 'string' ? storedUser.phone : ''}
            initialEmail={typeof storedUser?.email === 'string' ? storedUser.email : ''}
            title=""
            submitLabel="Continue"
            onSubmit={handleProfileSubmit}
            loading={profileSaving}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
