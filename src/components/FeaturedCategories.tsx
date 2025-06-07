import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const FeaturedCategories: React.FC = () => {
  const { t } = useTranslation();

  const categories = [
    {
      id: 'construction',
      name: t('categories.construction'),
      image: 'https://images.pexels.com/photos/2760289/pexels-photo-2760289.jpeg?auto=compress&cs=tinysrgb&w=1600',
      link: '/products?category=construction'
    },
    {
      id: 'agricultural',
      name: t('categories.agricultural'),
      image: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=1600',
      link: '/products?category=agricultural'
    },
    {
      id: 'industrial',
      name: t('categories.industrial'),
      image: 'https://images.pexels.com/photos/4489729/pexels-photo-4489729.jpeg?auto=compress&cs=tinysrgb&w=1600',
      link: '/products?category=industrial'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('categories.title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Link to={category.link} className="block group">
                <div className="relative h-80 overflow-hidden rounded-lg shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 p-6 z-20">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                    <div className="mt-2 w-10 h-1 bg-blue-500 transition-all duration-300 group-hover:w-20"></div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;