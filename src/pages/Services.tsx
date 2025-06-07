import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Wrench, Package, FileText, ChevronRight } from 'lucide-react';

const Services: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    {
      id: 'installation',
      title: t('services.installation'),
      description: t('services.installationText'),
      icon: <Truck className="text-blue-600" size={36} />,
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600',
      details: [
        'পেশাদার ইনস্টলেশন টিম',
        'সময়মত সেবা প্রদান',
        'সম্পূর্ণ কমিশনিং',
        'ব্যবহারকারী প্রশিক্ষণ'
      ]
    },
    {
      id: 'maintenance',
      title: t('services.maintenance'),
      description: t('services.maintenanceText'),
      icon: <Wrench className="text-blue-600\" size={36} />,
      image: 'https://images.pexels.com/photos/162568/generator-power-supply-emergency-162568.jpeg?auto=compress&cs=tinysrgb&w=1600',
      details: [
        'নিয়মিত রক্ষণাবেক্ষণ',
        'জরুরী মেরামত সেবা',
        'যন্ত্রাংশ প্রতিস্থাপন',
        'দক্ষতা অপ্টিমাইজেশন'
      ]
    },
    {
      id: 'spareParts',
      title: t('services.spareParts'),
      description: t('services.sparePartsText'),
      icon: <Package className="text-blue-600" size={36} />,
      image: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=1600',
      details: [
        'আসল স্পেয়ার পার্টস',
        'দ্রুত সরবরাহ',
        'সকল ব্র্যান্ডের জন্য উপলব্ধ',
        'কোয়ালিটি গ্যারান্টি'
      ]
    },
    {
      id: 'consultancy',
      title: t('services.consultancy'),
      description: t('services.consultancyText'),
      icon: <FileText className="text-blue-600\" size={36} />,
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600',
      details: [
        'প্রকল্প পরিকল্পনা',
        'যন্ত্রপাতি নির্বাচন',
        'সম্ভাব্যতা যাচাই',
        'রিটার্ন অন ইনভেস্টমেন্ট বিশ্লেষণ'
      ]
    }
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
            {t('services.title')}
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            আমরা আপনার শিল্প যন্ত্রপাতির সম্পূর্ণ জীবনচক্র জুড়ে সেবা প্রদান করি, ইনস্টলেশন থেকে রক্ষণাবেক্ষণ পর্যন্ত।
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Services */}
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={`py-16 ${index % 2 === 0 ? '' : 'bg-gray-50'}`}
            >
              <div className="container mx-auto px-4">
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  <div className={`order-2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                    <h2 className="text-3xl font-bold mb-6">{service.title}</h2>
                    <p className="text-gray-700 mb-6">{service.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {service.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link 
                      to="/contact" 
                      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors text-lg font-medium"
                    >
                      যোগাযোগ করুন
                      <ChevronRight className="ml-2" size={20} />
                    </Link>
                  </div>
                  
                  <div className={`order-1 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="rounded-lg shadow-lg w-full h-80 object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">আপনার যন্ত্রপাতির সেবা প্রয়োজন?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            আমাদের বিশেষজ্ঞ টিম আপনার যন্ত্রপাতি এবং সরঞ্জামের যত্ন নেওয়ার জন্য প্রস্তুত। আজই যোগাযোগ করুন!
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

export default Services;