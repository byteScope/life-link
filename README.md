# LifeLink - Emergency & Healthcare Services Platform

A comprehensive, modern web application for emergency and healthcare services. This platform includes user-facing features and a complete admin panel for managing all aspects of the healthcare service platform.

## 📚 Documentation

- **[Business Documentation](./docs/BUSINESS.md)** - Comprehensive business model, mission, vision, market analysis, go-to-market strategy, and success metrics
- **[Product Documentation Framework](./docs/PRODUCT_DOCUMENTATION_FRAMEWORK.md)** - Reusable template for documenting future products and tech solutions
- **[Setup Guide](./SETUP.md)** - Technical setup and configuration guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 🌟 Features

### User Platform
- **Authentication** - Login/Register with OTP (Phone & Email)
- **Home Dashboard** - Quick access to all services with beautiful UI
- **Service Listing** - Browse healthcare services with filters and search
- **Service Booking** - Book appointments with date/time selection
- **Emergency Services** - Request ambulance, medical help, fire, or police services
- **Blood Request** - Find blood donors by blood group and location
- **Real-time Chat** - Communicate with providers and emergency responders
- **Profile Management** - Manage personal info, medical records, and booking history
- **Secure Payments** - Multiple payment methods with secure processing

### Admin Panel
- **Dashboard Overview** - Stats, active bookings, emergencies, and blood requests
- **Users Management** - View and manage all registered users
- **Providers Management** - Approve/verify healthcare providers
- **Bookings Management** - Track and manage all service bookings
- **Emergency Management** - Monitor and respond to emergency requests
- **Blood Requests** - Match donors with recipients
- **Payments & Transactions** - Track revenue and payment status

## 🎨 Design System

### Color Palette
- **Blue (#1F6FB2)** - User actions, login, payments
- **Green (#1BC47D)** - Services, providers, success states
- **Red (#FF3E30)** - Emergencies, critical alerts
- **Orange (#FF8C42)** - Blood requests, warnings
- **Purple (#9B4DFF)** - Chat, messaging

### Design Principles
- Minimal, modern, and clean interface
- Consistent rounded buttons and cards
- Clear typography hierarchy
- Responsive layouts (mobile, tablet, desktop)
- Accessible components

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Shadcn/ui** - Component library
- **Lucide React** - Icons
- **Radix UI** - Accessible component primitives

## 📁 Project Structure

```
lifelink/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin panel components
│   │   ├── figma/          # Figma-generated components
│   │   └── ui/             # UI component library
│   ├── styles/             # Global styles
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── postcss.config.js       # PostCSS config
```

## 📄 Pages & Routes

### User Routes
- `/login` - Authentication
- `/` - Home dashboard
- `/services` - Service listing
- `/service/:id` - Service details & booking
- `/emergency` - Emergency requests
- `/blood-request` - Blood donation requests
- `/chat` - Messaging
- `/profile` - User profile & settings
- `/payments` - Payment processing

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/users` - Users management
- `/admin/providers` - Providers management
- `/admin/bookings` - Bookings management
- `/admin/emergencies` - Emergency incidents
- `/admin/blood-requests` - Blood requests
- `/admin/payments` - Transactions & revenue

## 🎯 Demo Access

Use the quick demo buttons on the login page:
- **User Demo** - Access the user platform
- **Admin Demo** - Access the admin panel

Or use the authentication flow:
1. Select Phone or Email login
2. Enter your contact information
3. Click "Send OTP"
4. Enter any 6-digit OTP
5. Click "Verify & Login"

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📝 Notes

- This is a demonstration/prototype application
- Payment processing uses mock data
- API calls are simulated for demo purposes
- Real-world implementation would require backend services

## 🤝 Support

For questions or issues, please refer to the documentation or contact support.

---

**LifeLink** - Your Healthcare Partner, Available 24/7
