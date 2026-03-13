import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  CreditCard,
  Wallet,
  Building,
  CheckCircle,
  ArrowLeft,
  Download,
  Shield,
} from 'lucide-react';

export default function Payments() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [paymentComplete, setPaymentComplete] = useState(false);

  const state = location.state as { service?: string; provider?: string; date?: string; time?: string; total?: number } | null;
  const bookingDetails = {
    service: state?.service ?? 'General Physician Consultation',
    provider: state?.provider ?? 'Dr. Sarah Johnson',
    date: state?.date ?? 'Nov 22, 2025',
    time: state?.time ?? '10:00 AM',
    subtotal: state?.total ? Math.round(state.total / 1.1) : 50,
    tax: state?.total ? Math.round(state.total - state.total / 1.1) : 5,
    total: state?.total ?? 55,
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      color: '#1F6FB2',
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      color: '#1BC47D',
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building,
      color: '#9B4DFF',
    },
  ];

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentComplete(true);
    }, 1500);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-8 text-center border-0 rounded-2xl">
            <div className="w-20 h-20 bg-[#1BC47D] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-[#1BC47D]" />
            </div>
            <h1 className="text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Your booking has been confirmed. You will receive a confirmation email shortly.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="text-gray-900">{bookingDetails.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="text-gray-900">{bookingDetails.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="text-gray-900">{bookingDetails.date} at {bookingDetails.time}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total Paid:</span>
                  <span className="text-[#1BC47D]">${bookingDetails.total}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/')}
                className="flex-1 rounded-xl"
                style={{ backgroundColor: '#1F6FB2' }}
              >
                Back to Home
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-0 rounded-2xl">
              <h2 className="text-gray-900 mb-6">Payment Method</h2>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-current shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={
                      selectedMethod === method.id
                        ? { borderColor: method.color }
                        : {}
                    }
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: `${method.color}15` }}
                    >
                      <method.icon className="w-6 h-6" style={{ color: method.color }} />
                    </div>
                    <p className="text-center text-sm text-gray-900">{method.name}</p>
                  </div>
                ))}
              </div>

              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Expiry Date</Label>
                      <Input type="text" placeholder="MM/YY" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input type="text" placeholder="123" maxLength={3} className="rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cardholder Name</Label>
                    <Input type="text" placeholder="John Smith" className="rounded-xl" />
                  </div>
                </div>
              )}

              {selectedMethod === 'wallet' && (
                <div className="py-8 text-center">
                  <Wallet className="w-16 h-16 text-[#1BC47D] mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Connect your digital wallet to proceed</p>
                  <Button className="rounded-xl" style={{ backgroundColor: '#1BC47D' }}>
                    Connect Wallet
                  </Button>
                </div>
              )}

              {selectedMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input type="text" placeholder="Enter account number" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Routing Number</Label>
                    <Input type="text" placeholder="Enter routing number" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Holder Name</Label>
                    <Input type="text" placeholder="John Smith" className="rounded-xl" />
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 border-0 rounded-2xl bg-blue-50">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-[#1F6FB2] flex-shrink-0" />
                <div>
                  <h3 className="text-gray-900 mb-2">Secure Payment</h3>
                  <p className="text-sm text-gray-600">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-0 rounded-2xl sticky top-24">
              <h2 className="text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-900 mb-1">{bookingDetails.service}</p>
                  <p className="text-sm text-gray-600">{bookingDetails.provider}</p>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>{bookingDetails.date}</p>
                  <p>{bookingDetails.time}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${bookingDetails.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${bookingDetails.tax}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#1BC47D]">${bookingDetails.total}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full rounded-xl"
                size="lg"
                style={{ backgroundColor: '#1F6FB2' }}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pay ${bookingDetails.total}
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
