import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const AdminVerificationPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_BASE = import.meta.env.MODE === 'development' 
    ? 'http://localhost:4000' 
    : 'https://campus-book-sx4m.onrender.com';

  useEffect(() => {
    const userId = localStorage.getItem('pendingAdminUserId');
    if (!userId) {
      navigate('/login');
    }
  }, [navigate]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('pendingAdminUserId');
    
    if (!userId) {
      showMessage('error', 'Session expired. Please register again.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/auth/verify-admin-otp`, {
        userId,
        otp
      });

      showMessage('success', response.data.message);
      localStorage.removeItem('pendingAdminUserId');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-sky-900 to-slate-900 p-4">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate('/login')}
        className="absolute top-6 left-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors z-10"
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Login</span>
      </motion.button>

      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Admin Verification
            </h1>
            <p className="text-white/80 mt-2">Enter the OTP sent to the admin email</p>
          </motion.div>

          {/* Message Display */}
          {message.text && (
            <motion.div
              className={`p-4 rounded-lg mb-6 flex items-center space-x-2 ${
                message.type === 'success' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}

          {/* Form Container */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.form
              onSubmit={handleVerifyOTP}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Enter Admin OTP
                </h3>
                <p className="text-sm text-white/70">
                  An OTP has been sent to the admin email for verification
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Verifying...' : 'Verify Admin OTP'}
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Footer */}
          <motion.p
            className="text-center text-white/60 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Admin verification required for account creation
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminVerificationPage;