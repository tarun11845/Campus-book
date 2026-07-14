import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, Clock, MapPin, Shield, Smartphone, Zap, Heart, Facebook, Instagram, Linkedin } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Multiple Sports Facilities",
      description: "Swimming, Basketball, Tennis, Badminton and more under one unified booking platform"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Fair & Structured Booking",
      description: "Gender-specific sessions where required and equal opportunity for all students"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Smart Slot System",
      description: "Optimized time slots with real-time availability tracking to avoid overcrowding"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Centralized Sports Management",
      description: "One platform to manage and book all campus sports facilities efficiently"
    }
  ];

  const techFeatures = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile First",
      description: "Responsive design that works perfectly on all devices"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Instant booking confirmations and live availability status"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Booking",
      description: "JWT authentication with verified NITK email access"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "User Friendly",
      description: "Clean, intuitive interface designed for a seamless sports experience"
    }
  ];

  return (
   <div className="min-h-screen bg-gradient-to-br from-[#001f4c] to-[#003366]">

      {/* Header */}
      <motion.header 
        className="flex items-center justify-between p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-white/80 hover:text-white"
          whileHover={{ scale: 1.05, x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </motion.button>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">CampusBook</h1>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Main Title */}
        <motion.div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-blue-700 bg-clip-text text-transparent">
              CampusBook
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            A centralized sports booking platform designed to streamline and enhance 
            sports facility access at NITK.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-white/20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-lg text-white/80 max-w-4xl mx-auto">
            To provide students and staff with a fair, efficient, and transparent system 
            to book sports facilities. We aim to eliminate overcrowding, reduce waiting time, 
            and ensure equal opportunity for everyone to stay active and healthy.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition">
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-white font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">Register & Verify</h3>
              <p className="text-white/70">
                Sign up using your NITK email and verify securely using OTP.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">Choose Sport & Slot</h3>
              <p className="text-white/70">
                Select your preferred sport and available time slot.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">Book & Play</h3>
              <p className="text-white/70">
                Confirm your booking and enjoy uninterrupted sports time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-lg text-white/80 mb-4">
            Contact us for assistance regarding bookings or technical issues.
          </p>
          <p className="text-white/80"><b>Email:</b> campusbooksupport@325gmail.com</p>

          <motion.button
            onClick={() => navigate('/')}
            className="mt-6 bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            Back to Home
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
};

export default AboutPage;
