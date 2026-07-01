import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Info,
  Trophy,
  Users,
  Clock,
  MapPin,
} from "lucide-react";

const TennisPage = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Professional Booking",
      description: "Reserve your tennis court with professional-grade system",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Friendly",
      description: "Both boys and girls welcome to book and play together",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Timing",
      description: "30-minute slots with real-time availability tracking",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Exclusive Court Access",
      description: "Book entire court without sharing or conflicts",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/src/assets/tennis.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-emerald-900/70 to-teal-900/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          className="flex items-center justify-between p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-2xl">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">TennisBook</h1>
              <p className="text-sm text-green-200 font-medium">
                NITK Tennis Court
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Info className="w-5 h-5" />
              <span>Back</span>
            </motion.button>

            <motion.button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 flex items-center space-x-2 shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-4xl">
            {/* Main Title */}
            <motion.h1
              className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Ace Your{" "}
              <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Game
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Experience premium tennis court booking at NITK. Reserve your
              perfect time slot, perfect your serve, and enjoy your best match.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <motion.button
                onClick={() => navigate("/login")}
                className="group bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 flex items-center space-x-3 shadow-2xl"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                <span>Start Booking Now</span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/")}
                className="border-2 border-green-300/50 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-green-500/20 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Sports
              </motion.button>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-8 border border-green-300/30 hover:from-green-500/30 hover:to-teal-500/30 transition-all duration-300 group shadow-xl"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                >
                  <div className="text-green-300 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          className="text-center py-8 text-green-200/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <p className="text-sm font-medium">
            © 2025 TennisBook - NITK Tennis Court. All rights reserved.
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default TennisPage;
