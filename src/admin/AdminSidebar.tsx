import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  Ambulance,
  Droplet,
  CreditCard,
  Heart,
  LogOut,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { clearAuthStorage } from '../api/auth';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthStorage();
    localStorage.removeItem('lifelink_admin');
    window.dispatchEvent(new Event('lifelink_logout'));
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/providers', label: 'Providers', icon: Stethoscope },
    { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { path: '/admin/emergencies', label: 'Emergencies', icon: Ambulance },
    { path: '/admin/blood-requests', label: 'Blood Requests', icon: Droplet },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col">
      {/* Logo */}
      <Link to="/admin" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-[#1F6FB2] to-[#1BC47D] rounded-xl flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" fill="white" />
        </div>
        <div>
          <h3 className="text-[#1F6FB2]">LifeLink</h3>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
      </Link>

      {/* Menu Items */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant={location.pathname === item.path ? 'default' : 'ghost'}
              className="w-full justify-start rounded-xl"
              style={
                location.pathname === item.path
                  ? { backgroundColor: '#1F6FB2' }
                  : {}
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <Link to="/">View site</Link>
        <Button variant="ghost" className="w-full justify-start rounded-xl mt-2 text-gray-600" onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-3" />
          Log out
        </Button>
      </div>
    </div>
  );
}
