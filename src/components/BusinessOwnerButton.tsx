import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Award, Calendar, MapPin, Phone, Mail } from 'lucide-react';

interface BusinessOwnerButtonProps {
  className?: string;
  onPress?: () => void;
}

const BusinessOwnerButton: React.FC<BusinessOwnerButtonProps> = ({ 
  className = '', 
  onPress 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const ownerData = {
    name: 'মোঃ বজলুর রহমান (আমিন)',
    position: 'প্রতিষ্ঠাতা ও ব্যবস্থাপনা পরিচালক',
    experience: '২৫+ বছর',
    specialization: 'শিল্প যন্ত্রপাতি ও মেশিনারি',
    education: 'মেকানিক্যাল ইঞ্জিনিয়ারিং, বুয়েট,শিক্ষক',
    achievements: [
      'বাংলাদেশ মেশিনারি অ্যাসোসিয়েশনের সদস্য',
      'ISO 9001:2015 সার্টিফাইড কোম্পানি প্রতিষ্ঠা',
      '৫০০+ সফল প্রকল্প বাস্তবায়ন',
      'জাতীয় শিল্প পুরস্কার প্রাপ্ত'
    ],
    description: 'মোঃ বজলুর রহমান (আমিন) ২৫ বছরেরও বেশি অভিজ্ঞতা নিয়ে বাংলাদেশের শিল্প যন্ত্রপাতি খাতে কাজ করছেন। তিনি ২০০০ সালে আমিন মেশিনারিজ প্রতিষ্ঠা করেন এবং এটিকে দেশের অন্যতম বিশ্বস্ত শিল্প যন্ত্রপাতি সরবরাহকারী প্রতিষ্ঠানে পরিণত করেছেন। তার নেতৃত্বে কোম্পানি হাজারেরও বেশি ক্লায়েন্টকে সেবা প্রদান করেছে এবং দেশের শিল্প উন্নয়নে গুরুত্বপূর্ণ অবদান রেখেছে।',
    contact: {
      phone: '+880 1912-658599,01920466397',
      email: 'amin@aminmachineriess.com',
      location: 'মেলান্দহ বাজার, জামালপুর'
    },
    images: {
      primary: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      secondary: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  };

  const handleButtonPress = () => {
    setShowDetails(true);
    if (onPress) {
      onPress();
    }
  };

  return (
    <>
      {/* Main Button */}
      <motion.button
        onClick={handleButtonPress}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        className={`
          relative w-full bg-white rounded-xl shadow-lg border-2 border-gray-200 
          overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-300
          focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50
          active:bg-gray-50 ${className}
        `}
        aria-label="ব্যবসার মালিকের তথ্য দেখুন"
        role="button"
        tabIndex={0}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-gray-50 opacity-50" />
        
        {/* Content Container */}
        <div className="relative p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              ব্যবসার মালিক
            </h3>
            <p className="text-sm text-gray-600">
              আমাদের প্রতিষ্ঠাতা সম্পর্কে জানুন
            </p>
          </div>

          {/* Images Container */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            {/* Primary Image */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg"
              >
                <img
                  src={ownerData.images.primary}
                  alt="মোঃ বজলুর রহমান (আমিন) - প্রতিষ্ঠাতা"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <User size={12} className="text-white" />
              </div>
            </div>

            {/* Separator */}
            <div className="w-px h-16 bg-gray-300" />

            {/* Secondary Image */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg"
              >
                <img
                  src={ownerData.images.secondary}
                  alt="মোঃ ইদ্রিস আলী - কর্মক্ষেত্রে"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                <Award size={12} className="text-white" />
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 mb-1">
              {ownerData.name}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {ownerData.position}
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              <Calendar size={12} className="mr-1" />
              {ownerData.experience} অভিজ্ঞতা
            </div>
          </div>

          {/* Tap Indicator */}
          <div className="absolute bottom-2 right-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-blue-500 rounded-full opacity-70"
            />
          </div>
        </div>

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-blue-600 bg-opacity-10 flex items-center justify-center"
        >
          <span className="text-blue-700 font-medium text-sm">
            বিস্তারিত দেখতে ট্যাপ করুন
          </span>
        </motion.div>
      </motion.button>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                  aria-label="বন্ধ করুন"
                >
                  <X size={24} />
                </button>
                
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={ownerData.images.primary}
                      alt={ownerData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{ownerData.name}</h2>
                    <p className="text-blue-100">{ownerData.position}</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Owner Images */}
                <div className="flex justify-center space-x-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden shadow-lg mb-2">
                      <img
                        src={ownerData.images.primary}
                        alt="প্রতিষ্ঠাতার ছবি"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-600">প্রতিষ্ঠাতা</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden shadow-lg mb-2">
                      <img
                        src={ownerData.images.secondary}
                        alt="কর্মক্ষেত্রে"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-600">কর্মক্ষেত্রে</p>
                  </motion.div>
                </div>

                {/* Professional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">অভিজ্ঞতা</p>
                        <p className="font-semibold">{ownerData.experience}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Award className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">বিশেষত্ব</p>
                        <p className="font-semibold">{ownerData.specialization}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">শিক্ষাগত যোগ্যতা</p>
                        <p className="font-semibold">{ownerData.education}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <MapPin className="text-orange-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">অবস্থান</p>
                        <p className="font-semibold">{ownerData.contact.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    প্রতিষ্ঠাতার বার্তা
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-gray-700 leading-relaxed">
                      {ownerData.description}
                    </p>
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    উল্লেখযোগ্য অর্জন
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ownerData.achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="12" 
                            height="12" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="white" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <p className="text-sm text-green-800 font-medium">
                          {achievement}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold mb-4 text-blue-900">
                    যোগাযোগের তথ্য
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="text-blue-600" size={18} />
                      <a 
                        href={`tel:${ownerData.contact.phone}`}
                        className="text-blue-700 hover:text-blue-900 font-medium"
                      >
                        {ownerData.contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="text-blue-600" size={18} />
                      <a 
                        href={`mailto:${ownerData.contact.email}`}
                        className="text-blue-700 hover:text-blue-900 font-medium"
                      >
                        {ownerData.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-blue-600" size={18} />
                      <span className="text-blue-700 font-medium">
                        {ownerData.contact.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    আমিন মেশিনারিজ - বিশ্বস্ত অংশীদার
                  </p>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BusinessOwnerButton;