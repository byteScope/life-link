import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Heart, Phone, Mail, Shield } from 'lucide-react';

interface AdminLoginProps {
  setIsAuthenticated: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
}

export default function AdminLogin({ setIsAuthenticated, setIsAdmin }: AdminLoginProps) {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const handleSendOtp = () => {
    setShowOtp(true);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsAdmin(true);
    localStorage.setItem('lifelink_authenticated', 'true');
    localStorage.setItem('lifelink_admin', 'true');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1F6FB2] to-[#1BC47D] rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-[#1F6FB2] mb-2">LifeLink Admin</h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Staff access only
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Admin Login</h2>

          <div className="space-y-6">
            <div className="flex gap-2">
              <Button
                variant={loginMethod === 'phone' ? 'default' : 'outline'}
                onClick={() => setLoginMethod('phone')}
                className="flex-1 rounded-xl"
                style={loginMethod === 'phone' ? { backgroundColor: '#1F6FB2' } : {}}
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </Button>
              <Button
                variant={loginMethod === 'email' ? 'default' : 'outline'}
                onClick={() => setLoginMethod('email')}
                className="flex-1 rounded-xl"
                style={loginMethod === 'email' ? { backgroundColor: '#1F6FB2' } : {}}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>

            {!showOtp && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}</Label>
                  {loginMethod === 'phone' ? (
                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-xl"
                    />
                  ) : (
                    <Input
                      type="email"
                      placeholder="admin@lifelink.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl"
                    />
                  )}
                </div>
                <Button
                  onClick={handleSendOtp}
                  className="w-full rounded-xl"
                  style={{ backgroundColor: '#1F6FB2' }}
                >
                  Send OTP
                </Button>
              </div>
            )}

            {showOtp && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Enter OTP</Label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="rounded-xl text-center tracking-widest"
                  />
                  <p className="text-sm text-gray-500">
                    OTP sent to {loginMethod === 'phone' ? phone || 'your phone' : email || 'your email'}
                  </p>
                </div>
                <Button
                  onClick={handleLogin}
                  className="w-full rounded-xl"
                  style={{ backgroundColor: '#1F6FB2' }}
                >
                  Verify & Login
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowOtp(false)}
                  className="w-full rounded-xl"
                >
                  Change {loginMethod === 'phone' ? 'Phone' : 'Email'}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-[#1F6FB2] hover:underline">
              ← Back to main site
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAuthenticated(true);
              setIsAdmin(true);
              localStorage.setItem('lifelink_authenticated', 'true');
              localStorage.setItem('lifelink_admin', 'true');
              navigate('/admin');
            }}
            className="rounded-xl"
          >
            Admin Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
