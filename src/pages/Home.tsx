import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronRight, Truck, Factory, Wrench } from 'lucide-react';
import FeaturedCategories from '../components/FeaturedCategories';
import Testimonials from '../components/Testimonials';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-r from-blue-900 to-gray-900">
        <div className="absolute inset-0 z-10 bg-black opacity-50"></div>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
        ></div>
        
        <div className="container mx-auto px-4 h-full relative z-20 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              আমরা আপনাকে সেরা মানের শিল্প যন্ত্রপাতি এবং সেবা প্রদান করি যা আপনার ব্যবসাকে সাফল্যের দিকে নিয়ে যায়।
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors text-lg font-medium"
            >
              {t('hero.cta')}
              <ChevronRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Featured Products */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">আমাদের জনপ্রিয় পণ্য</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product 1 */}
            <motion.div
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                  alt="Construction Equipment" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">হাইড্রোলিক এক্সকাভেটর</h3>
                <p className="text-gray-600 mb-4">
                  হাইড্রোলিক এক্সকাভেটর নির্মাণ প্রকল্পের জন্য আদর্শ, কঠিন মাটি এবং ভারী সামগ্রী খনন করে।
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-medium">{t('products.contactForPrice')}</span>
                  <Link to="/products/1" className="text-blue-600 hover:text-blue-800 font-medium">
                    {t('products.getQuote')}
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Product 2 */}
            <motion.div
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/162568/generator-power-supply-emergency-162568.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                  alt="Industrial Generator" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">ইন্ডাস্ট্রিয়াল জেনারেটর</h3>
                <p className="text-gray-600 mb-4">
                  উচ্চ ক্ষমতার জেনারেটর যা আপনার শিল্প প্রতিষ্ঠানের জন্য নিরবচ্ছিন্ন বিদ্যুৎ সরবরাহ নিশ্চিত করে।
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-medium">{t('products.contactForPrice')}</span>
                  <Link to="/products/2" className="text-blue-600 hover:text-blue-800 font-medium">
                    {t('products.getQuote')}
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Product 3 */}
            <motion.div
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                  alt="Agricultural Pump" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">এগ্রিকালচারাল পাম্প</h3>
                <p className="text-gray-600 mb-4">
                  কৃষি সেচের জন্য আধুনিক পাম্প যা জল সরবরাহ করে এবং ফসলের উৎপাদন বাড়ায়।
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-medium">{t('products.contactForPrice')}</span>
                  <Link to="/products/3" className="text-blue-600 hover:text-blue-800 font-medium">
                    {t('products.getQuote')}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors text-lg font-medium"
            >
              সকল পণ্য দেখুন
              <ChevronRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('services.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <motion.div
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              className="bg-white p-8 rounded-lg shadow-md border border-gray-200"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Truck className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('services.installation')}</h3>
              <p className="text-gray-600">{t('services.installationText')}</p>
            </motion.div>

            {/* Service 2 */}
            <motion.div
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              className="bg-white p-8 rounded-lg shadow-md border border-gray-200"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Wrench className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('services.maintenance')}</h3>
              <p className="text-gray-600">{t('services.maintenanceText')}</p>
            </motion.div>

            {/* Service 3 */}
            <motion.div
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              className="bg-white p-8 rounded-lg shadow-md border border-gray-200"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Factory className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('services.consultancy')}</h3>
              <p className="text-gray-600">{t('services.consultancyText')}</p>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors text-lg font-medium"
            >
              সকল সেবা দেখুন
              <ChevronRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">আপনার প্রয়োজনীয় যন্ত্রপাতি খুঁজছেন?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            আমাদের বিশেষজ্ঞ টিম আপনাকে সঠিক সমাধান খুঁজে পেতে সাহায্য করবে।
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center bg-white hover:bg-gray-100 text-blue-600 py-3 px-8 rounded-lg transition-colors text-lg font-medium"
          >
            আজই যোগাযোগ করুন
            <ChevronRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;