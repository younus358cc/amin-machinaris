import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Award, Users, Globe, Shield } from 'lucide-react';
import BusinessOwnerButton from '../components/BusinessOwnerButton';

const About: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    { id: 1, value: '20+', label: 'Years Experience' },
    { id: 2, value: '500+', label: 'Happy Clients' },
    { id: 3, value: '1000+', label: 'Projects Completed' },
    { id: 4, value: '50+', label: 'Expert Team Members' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 bg-gradient-to-r from-blue-900 to-gray-900">
        <div className="absolute inset-0 z-10 bg-black opacity-40"></div>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            আমরা বাংলাদেশের সেরা শিল্প যন্ত্রপাতি সরবরাহকারী, গ্রাহকদের সাফল্যের জন্য নিবেদিত।
          </p>
        </div>
      </section>

      {/* Our History */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Business Owner Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">আমাদের নেতৃত্ব</h2>
            <div className="max-w-md mx-auto">
              <BusinessOwnerButton />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.img 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                alt="Company History" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-bold mb-6">{t('about.history')}</h2>
                <p className="text-gray-700 mb-6">
                  {t('about.historyText')}
                </p>
                <p className="text-gray-700">
                  যাত্রা শুরুর পর থেকে, আমরা ক্রমাগত আমাদের পণ্য ও সেবার মান উন্নত করেছি, গ্রাহকদের প্রয়োজন বোঝার জন্য সময় নিয়েছি, এবং তাদের চাহিদা পূরণে প্রতিশ্রুতিবদ্ধ থেকেছি। আমরা শিল্প ক্ষেত্রে সর্বাধুনিক যন্ত্রপাতি সরবরাহ করি যা গ্রাহকদের ব্যবসা বৃদ্ধিতে সাহায্য করে।
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Award className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('about.mission')}</h3>
              <p className="text-gray-700">
                {t('about.missionText')}
              </p>
              <p className="text-gray-700 mt-4">
                আমাদের লক্ষ্য হল আমাদের গ্রাহকদের তাদের শিল্প ক্ষেত্রে সর্বোত্তম করতে সাহায্য করা। আমরা বিশ্বাস করি যে উচ্চ মানের যন্ত্রপাতি এবং বিশেষজ্ঞ সেবা সরবরাহ করে, আমরা আমাদের গ্রাহকদের প্রতিযোগিতামূলক বাজারে এগিয়ে থাকতে সাহায্য করতে পারি।
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Globe className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('about.vision')}</h3>
              <p className="text-gray-700">
                {t('about.visionText')}
              </p>
              <p className="text-gray-700 mt-4">
                আমরা চাই বাংলাদেশের শিল্প খাতে অবদান রাখতে এবং দেশের অর্থনৈতিক উন্নয়নে সহায়তা করতে। আমরা কেবল যন্ত্রপাতি সরবরাহকারী হিসাবে নয়, বরং একটি বিশ্বাসযোগ্য অংশীদার হিসাবে পরিচিত হতে চাই যারা গ্রাহকদের সাফল্যে অবদান রাখে।
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-blue-200">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('about.whyUs')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Reason 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">সর্বোচ্চ মান নিশ্চিত</h3>
              <p className="text-gray-600">
                আমরা কেবল সর্বোচ্চ মানের যন্ত্রপাতি ও সরঞ্জাম সরবরাহ করি যা আন্তর্জাতিক মান পূরণ করে। আমরা কোন ধরনের আপস করি না।
              </p>
            </motion.div>

            {/* Reason 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">বিশেষজ্ঞ টিম</h3>
              <p className="text-gray-600">
                আমাদের দক্ষ প্রকৌশলী ও টেকনিশিয়ানরা আপনাকে সঠিক সমাধান এবং শ্রেষ্ঠ সেবা প্রদান করার জন্য প্রস্তুত। তারা নিয়মিত প্রশিক্ষণ নেয়।
              </p>
            </motion.div>

            {/* Reason 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Award className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">পূর্ণ সমর্থন</h3>
              <p className="text-gray-600">
                আমরা কেবল পণ্য বিক্রি করি না, আমরা সম্পূর্ণ সমর্থন প্রদান করি। আমাদের বিক্রয় পরবর্তী সেবা আপনার যন্ত্রপাতি দীর্ঘদিন চালু রাখতে সাহায্য করে।
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">আমাদের সার্টিফিকেশন</h2>
          
          <div className="flex flex-wrap justify-center gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-64"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Award className="text-blue-600" size={36} />
              </div>
              <h3 className="text-lg font-semibold mb-2">ISO 9001:2015</h3>
              <p className="text-gray-600 text-sm">
                গুণমান ব্যবস্থাপনা পদ্ধতি
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-64"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-blue-600" size={36} />
              </div>
              <h3 className="text-lg font-semibold mb-2">CE Certification</h3>
              <p className="text-gray-600 text-sm">
                ইউরোপীয় মান পূরণের স্বীকৃতি
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-64"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="text-blue-600" size={36} />
              </div>
              <h3 className="text-lg font-semibold mb-2">BSTI Approved</h3>
              <p className="text-gray-600 text-sm">
                বাংলাদেশ স্ট্যান্ডার্ডস এন্ড টেস্টিং ইনস্টিটিউশন
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;