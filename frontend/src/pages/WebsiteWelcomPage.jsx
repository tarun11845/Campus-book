import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Droplets, Volleyball, Trophy, CircleDot, Info } from "lucide-react";

const WebsiteWelcomePage = () => {
  const navigate = useNavigate();

  const sports = [
    {
      name: "Swimming",
      icon: <Droplets className="w-10 h-10" />,
      route: "/sports/swimming",
      description: "Book gender-specific swimming sessions with fixed capacity.",
    },
    {
      name: "Basketball",
      icon: <Volleyball className="w-10 h-10" />,
      route: "/sports/basketball",
      description: "Reserve your court time and enjoy team play sessions.",
    },
    {
      name: "Tennis",
      icon: <Trophy className="w-10 h-10" />,
      route: "/sports/tennis",
      description: "Book singles or doubles slots with real-time availability.",
    },
    {
      name: "Badminton",
      icon: <CircleDot className="w-10 h-10" />,
      route: "/sports/badminton",
      description: "Reserve badminton courts easily and avoid waiting.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white">
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Header */}
        <motion.header
          className="flex items-center justify-between p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold">CampusBook</h1>
            <p className="text-emerald-200 text-sm">
              NITK Sports Booking System
            </p>
          </div>

          <motion.button
            onClick={() => navigate("/about")}
            className="flex items-center space-x-2 text-white/80 hover:text-white"
            whileHover={{ scale: 1.05 }}
          >
            <Info className="w-5 h-5" />
            <span>About</span>
          </motion.button>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.h1
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Book Your Favorite{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Sports Slot
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-white/80 mb-12 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Avoid crowding and ensure equal opportunities. Reserve your sports
            slot in advance and enjoy uninterrupted playtime at NITK.
          </motion.p>

          {/* Sports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            {sports.map((sport, index) => (
              <motion.div
                key={index}
                onClick={() => navigate(sport.route)}
                className="cursor-pointer bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-emerald-300 mb-4">{sport.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{sport.name}</h3>
                <p className="text-white/70 text-sm">{sport.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-white/60">
          © 2025 CampusBook - NITK Sports Booking
        </footer>
      </div>
    </div>
  );
};

export default WebsiteWelcomePage;
