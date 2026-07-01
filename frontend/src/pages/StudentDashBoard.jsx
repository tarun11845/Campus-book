import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplets, Trophy, Volleyball, CircleDot, ArrowRight, Clock, Users, CheckCircle } from "lucide-react";

const sportsList = [
  {
    id: "swimming",
    name: "Swimming",
    icon: Droplets,
    accent: ["#059669", "#14b8a6"],
    subtitle: "Gender-specific sessions · 20 per slot",
    description: "Dive into premium swimming sessions with gender-separated timings. Morning slots for boys, evening for girls. Safe, comfortable experience with professional supervision.",
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: Trophy,
    accent: ["#7c3aed", "#a78bfa"],
    subtitle: "Professional courts · Singles & doubles",
    description: "Book professional-grade tennis courts for singles or doubles play. Perfect for improving your game with reliable schedules and well-maintained facilities.",
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: Volleyball,
    accent: ["#f97316", "#fbbf24"],
    subtitle: "Full-court bookings · Team play",
    description: "Reserve full basketball courts exclusively for your team. Ideal for matches, practice sessions, and competitive play with guaranteed availability.",
  },
  {
    id: "badminton",
    name: "Badminton",
    icon: CircleDot,
    accent: ["#0ea5e9", "#38bdf8"],
    subtitle: "Quick 30-min slots · Well-lit courts",
    description: "Fast badminton bookings with 30-minute slots. Well-lit courts perfect for singles or doubles matches with convenient scheduling.",
  },
];

const features = [
  { icon: Clock, title: "30-Minute Slots", desc: "Flexible time slots fitting your schedule" },
  { icon: Users, title: "Fair Access", desc: "Equal opportunities for all students" },
  { icon: CheckCircle, title: "Real-Time Booking", desc: "Instant confirmation and reminders" },
];

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 p-8 page-transition">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-extrabold mb-3">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Student Dashboard
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your one-stop platform for booking college sports facilities. Choose your sport,
            check availability, and secure your slot in seconds.
          </p>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {features.map((feature, idx) => {
            const FeatureIcon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                    <FeatureIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Sports Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Choose Your Sport</h2>
          <p className="text-slate-600">
            Browse our four premium sports facilities and book your preferred time slots
          </p>
        </motion.div>

        {/* Sports Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {sportsList.map((sport, idx) => {
            const Icon = sport.icon;

            return (
              <motion.div
                key={sport.id}
                onClick={() => navigate(`/calendar/${sport.id}`)}
                className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <div className="p-6 bg-white/80 backdrop-blur-sm border border-white/30 h-full flex flex-col">
                  
                  <div className="mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                      style={{
                        background: `linear-gradient(135deg, ${sport.accent[0]}, ${sport.accent[1]})`,
                        boxShadow: `0 8px 24px ${sport.accent[0]}33`,
                      }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-2xl font-semibold text-slate-800">{sport.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{sport.subtitle}</p>
                  </div>

                  <p className="text-sm text-slate-600 mb-5 flex-grow leading-relaxed">
                    {sport.description}
                  </p>

                  <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mb-5" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/calendar/${sport.id}`);
                    }}
                    className="w-full mt-4 inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
                    style={{
                      background: `linear-gradient(90deg, ${sport.accent[0]}, ${sport.accent[1]})`,
                    }}
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Important Notes + FAQ */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-7 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-4">📋 Important Notes</h4>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>• All bookings must be made 24 hours in advance</li>
              <li>• Please arrive 5 minutes before your slot time</li>
              <li>• Cancellations must be done 6 hours before the slot</li>
              <li>• Swimming has gender-separated sessions for comfort</li>
            </ul>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-7 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-4">❓ FAQ</h4>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>
                <p className="font-semibold text-slate-800 mb-1">
                  Can I book multiple slots?
                </p>
                <p>Yes, you can book multiple slots as long as they don't overlap</p>
              </li>

              <li>
                <p className="font-semibold text-slate-800 mb-1">
                  What if I miss my booking?
                </p>
                <p>
                  Contact the sports office immediately. Repeated no-shows may
                  result in restrictions
                </p>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center text-sm text-slate-600 border-t border-slate-200 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="mb-2">© 2025 CampusBook - NITK Sports Booking System</p>
          <p className="text-xs text-slate-500">
            For support, contact sports@nitk.ac.in or visit the sports office
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default StudentDashboard;