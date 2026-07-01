import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, CheckCircle } from 'lucide-react';
import SlotManagement from '../components/SlotManagement';
import BookingsManagement from '../components/BookingsManagement';

const sportsList = [
  { id: 'swimming', name: 'Swimming', accent: ['#059669', '#14b8a6'] },
  { id: 'tennis', name: 'Tennis', accent: ['#7c3aed', '#a78bfa'] },
  { id: 'basketball', name: 'Basketball', accent: ['#f97316', '#fbbf24'] },
  { id: 'badminton', name: 'Badminton', accent: ['#0ea5e9', '#38bdf8'] },
];

const features = [
  { icon: Clock, title: 'Slot Granularity', desc: 'Manage precise time segments' },
  { icon: Users, title: 'User Oversight', desc: 'View bookings and user activity' },
  { icon: CheckCircle, title: 'Approvals', desc: 'Approve or cancel bookings quickly' },
];

const AdminPage = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [activeTab, setActiveTab] = useState('slots');

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold mb-2">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Admin Dashboard</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Manage courts, slots and bookings with full control and oversight.</p>
        </motion.div>

        {/* Admin Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-5 text-center shadow-sm">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
                <p className="text-sm text-slate-600">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Sport Selection */}
        {!selectedSport ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sportsList.map((sport) => (
              <motion.div
                key={sport.id}
                onClick={() => setSelectedSport(sport)}
                whileHover={{ scale: 1.03 }}
                className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
                transition={{ type: 'spring', stiffness: 120 }}
              >
                <div className="p-6 bg-white/80 backdrop-blur-sm border border-white/30 h-full">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{sport.name}</h3>
                  <p className="text-sm text-slate-500">Manage slots and bookings for {sport.name}.</p>
                </div>
                <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(135deg, ${sport.accent[0]}22, ${sport.accent[1]}11)`, mixBlendMode: 'multiply' }} />
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <button onClick={() => setSelectedSport(null)} className="text-emerald-600 hover:underline">← Back to Sports</button>
              <div className="text-sm text-slate-500">Managing: <span className="font-semibold text-slate-800">{selectedSport.name}</span></div>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <div className="flex space-x-1 bg-slate-50 p-1 rounded-lg">
                <button onClick={() => setActiveTab('slots')} className={`px-4 py-2 rounded-md font-medium ${activeTab === 'slots' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'}`}>Manage Slots</button>
                <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 rounded-md font-medium ${activeTab === 'bookings' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'}`}>View Bookings</button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
              {activeTab === 'slots' && <SlotManagement sportKey={selectedSport.id} />}
              {activeTab === 'bookings' && <BookingsManagement sportKey={selectedSport.id} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
