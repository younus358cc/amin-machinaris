import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      name: 'আহমেদ হাসান',
      company: 'ঢাকা কনস্ট্রাকশন কোম্পানি',
      quote: 'অমিন মেশিনারিজ থেকে কেনা আমাদের এক্সকাভেটর দীর্ঘদিন ধরে নিরবিচ্ছিন্নভাবে কাজ করছে। তাদের অসাধারণ সেবা ও সহযোগিতার জন্য ধন্যবাদ।',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5
    },
    {
      id: 2,
      name: 'ফারহানা আক্তার',
      company: 'গ্রিন এগ্রো ফার্ম',
      quote: 'আমাদের কৃষি খামারের জন্য তাদের কাছ থেকে কেনা পাম্প এবং ট্র্যাক্টর অত্যন্ত কার্যকর। মেশিনগুলো আমাদের উৎপাদন বাড়াতে সাহায্য করেছে।',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4
    },
    {
      id: 3,
      name: 'করিম উদ্দিন',
      company: 'টেক্সটাইল মিলস লিমিটেড',
      quote: 'আমাদের কারখানায় অমিন মেশিনারিজের জেনারেটর ইনস্টল করার পর থেকে বিদ্যুৎ সমস্যা সমাধান হয়েছে। তাদের পরামর্শ ও সেবা খুবই মূল্যবান।',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('testimonials.title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="flex">{renderStars(testimonial.rating)}</div>
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;