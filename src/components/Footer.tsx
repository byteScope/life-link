import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1F6FB2] to-[#1BC47D] rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-white">LifeLink</span>
            </div>
            <p className="text-sm">
              Your trusted partner for emergency and healthcare services. Available 24/7 to help you when you need it most.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[#1F6FB2] rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[#1F6FB2] rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[#1F6FB2] rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[#1F6FB2] rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[#1BC47D] transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-[#1BC47D] transition-colors">Services</Link></li>
              <li><Link to="/emergency" className="hover:text-[#1BC47D] transition-colors">Emergency</Link></li>
              <li><Link to="/blood-request" className="hover:text-[#1BC47D] transition-colors">Blood Request</Link></li>
              <li><Link to="/profile" className="hover:text-[#1BC47D] transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#1BC47D] transition-colors">Ambulance Service</a></li>
              <li><a href="#" className="hover:text-[#1BC47D] transition-colors">Doctor Consultation</a></li>
              <li><a href="#" className="hover:text-[#1BC47D] transition-colors">Home Nursing</a></li>
              <li><a href="#" className="hover:text-[#1BC47D] transition-colors">Lab Tests</a></li>
              <li><a href="#" className="hover:text-[#1BC47D] transition-colors">Medical Equipment</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Healthcare Plaza, Medical District, NY 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+15551234567" className="hover:text-[#1BC47D] transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:support@lifelink.com" className="hover:text-[#1BC47D] transition-colors">
                  support@lifelink.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {currentYear} LifeLink. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#1BC47D] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#1BC47D] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#1BC47D] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
