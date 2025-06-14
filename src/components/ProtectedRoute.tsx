import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const loginStatus = localStorage.getItem('aminmachinaris_logged_in');
    setIsLoggedIn(loginStatus === 'true');
  }, []);

  // Show loading state while checking authentication
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">অথেন্টিকেশন যাচাই করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show access denied message
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">অ্যাক্সেস নিষিদ্ধ</h2>
            <p className="text-gray-600 mb-6">
              এই পেজটি দেখার জন্য আপনাকে লগইন করতে হবে। অনুগ্রহ করে প্রথমে লগইন করুন।
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Shield size={16} />
              <span>সুরক্ষিত এলাকা - শুধুমাত্র অনুমোদিত ব্যবহারকারীদের জন্য</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If logged in, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;