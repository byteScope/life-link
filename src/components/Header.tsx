import { Link, useLocation } from 'react-router-dom';
import { Heart, Bell, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/emergency', label: 'Emergency' },
    { path: '/blood-request', label: 'Blood Request' },
    { path: '/chat', label: 'Chat' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1F6FB2] to-[#1BC47D] rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-[#1F6FB2]">LifeLink</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Find Care - Direct Link */}
            <Link to="/services">
              <Button
                variant={location.pathname === '/services' ? 'default' : 'ghost'}
                className="rounded-xl"
                style={
                  location.pathname === '/services'
                    ? { backgroundColor: '#1F6FB2' }
                    : {}
                }
              >
                Find Care
              </Button>
            </Link>

            {/* Find Jobs - Direct Link */}
            <Link to="/jobs">
              <Button
                variant={location.pathname === '/jobs' ? 'default' : 'ghost'}
                className="rounded-xl"
                style={
                  location.pathname === '/jobs'
                    ? { backgroundColor: '#1F6FB2' }
                    : {}
                }
              >
                Find Jobs
              </Button>
            </Link>

            {/* Other Navigation Items */}
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  className="rounded-xl"
                  style={
                    location.pathname === item.path
                      ? { backgroundColor: '#1F6FB2' }
                      : {}
                  }
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative rounded-xl hidden sm:flex">
              <Bell className="w-5 h-5" />
              <Badge
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 rounded-full"
                style={{ backgroundColor: '#FF3E30' }}
              >
                3
              </Badge>
            </Button>
            <Link to="/profile" className="hidden sm:block">
              <Button variant="outline" className="rounded-xl">
                Profile
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              {/* Find Care Link */}
              <Link to="/services" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={location.pathname === '/services' ? 'default' : 'ghost'}
                  className="w-full justify-start rounded-xl"
                  style={
                    location.pathname === '/services'
                      ? { backgroundColor: '#1F6FB2' }
                      : {}
                  }
                >
                  Find Care
                </Button>
              </Link>

              {/* Find Jobs Link */}
              <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={location.pathname === '/jobs' ? 'default' : 'ghost'}
                  className="w-full justify-start rounded-xl"
                  style={
                    location.pathname === '/jobs'
                      ? { backgroundColor: '#1F6FB2' }
                      : {}
                  }
                >
                  Find Jobs
                </Button>
              </Link>

              {/* Other Navigation Items */}
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={location.pathname === item.path ? 'default' : 'ghost'}
                    className="w-full justify-start rounded-xl"
                    style={
                      location.pathname === item.path
                        ? { backgroundColor: '#1F6FB2' }
                        : {}
                    }
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  Profile
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
