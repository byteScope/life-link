import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Heart, Phone, Mail } from 'lucide-react';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
}

export default function Login({ setIsAuthenticated, setIsAdmin }: LoginProps) {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [userType, setUserType] = useState<'user' | 'admin'>('user');

  const handleSendOtp = () => {
    setShowOtp(true);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    if (userType === 'admin') {
      setIsAdmin(true);
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

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
          <Tabs value={userType} onValueChange={(v) => setUserType(v as 'user' | 'admin')} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">User Login</TabsTrigger>
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-6">
            {/* Login Method Toggle */}
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

            {/* Phone/Email Input */}
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
                      placeholder="your@email.com"
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

            {/* OTP Input */}
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
                    OTP sent to {loginMethod === 'phone' ? phone : email}
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
            <p className="text-sm text-gray-500">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>

        {/* Quick Demo Access */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Quick Demo Access:</p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAuthenticated(true);
                navigate('/');
              }}
              className="rounded-xl"
            >
              User Demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAuthenticated(true);
                setIsAdmin(true);
                navigate('/admin');
              }}
              className="rounded-xl"
            >
              Admin Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
