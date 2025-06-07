import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Filter, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  model: string;
  brand: string;
  image: string;
  price?: string;
}

const Products: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');

  // Mock products data
  useEffect(() => {
    const productsData: Product[] = [
      {
        id: 1,
        name: 'হাইড্রোলিক এক্সকাভেটর',
        description: 'হাইড্রোলিক এক্সকাভেটর নির্মাণ প্রকল্পের জন্য আদর্শ, কঠিন মাটি এবং ভারী সামগ্রী খনন করে।',
        category: 'construction',
        model: 'EX-220',
        brand: 'কাটারপিলার',
        image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600'
      },
      {
        id: 2,
        name: 'ইন্ডাস্ট্রিয়াল জেনারেটর',
        description: 'উচ্চ ক্ষমতার জেনারেটর যা আপনার শিল্প প্রতিষ্ঠানের জন্য নিরবচ্ছিন্ন বিদ্যুৎ সরবরাহ নিশ্চিত করে।',
        category: 'industrial',
        model: 'IG-5000',
        brand: 'কুমিনস',
        image: 'https://images.pexels.com/photos/162568/generator-power-supply-emergency-162568.jpeg?auto=compress&cs=tinysrgb&w=1600'
      },
      {
        id: 3,
        name: 'এগ্রিকালচারাল পাম্প',
        description: 'কৃষি সেচের জন্য আধুনিক পাম্প যা জল সরবরাহ করে এবং ফসলের উৎপাদন বাড়ায়।',
        category: 'agricultural',
        model: 'AP-100',
        brand: 'যামাহা',
        image: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=1600'
      },
      {
        id: 4,
        name: 'ফ্রন্ট এন্ড লোডার',
        description: 'ভারী সামগ্রী উত্তোলন এবং স্থানান্তর করার জন্য শক্তিশালী লোডার।',
        category: 'construction',
        model: 'FL-320',
        brand: 'জেসিবি',
        image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600'
      },
      {
        id: 5,
        name: 'ইন্ডাস্ট্রিয়াল কম্প্রেসার',
        description: 'শিল্প প্রতিষ্ঠানের জন্য উচ্চ মানের কম্প্রেসার যা বিভিন্ন কাজে ব্যবহার করা যায়।',
        category: 'industrial',
        model: 'IC-420',
        brand: 'আটলাস কপকো',
        image: 'https://images.pexels.com/photos/162568/generator-power-supply-emergency-162568.jpeg?auto=compress&cs=tinysrgb&w=1600'
      },
      {
        id: 6,
        name: 'পাওয়ার টিলার',
        description: 'কৃষি জমি চাষের জন্য আধুনিক পাওয়ার টিলার যা কাজকে সহজ করে।',
        category: 'agricultural',
        model: 'PT-500',
        brand: 'সোনালিকা',
        image: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=1600'
      },
      {
        id: 7,
        name: 'ইলেকট্রিক জেনারেটর',
        description: 'আপনার ব্যবসার জন্য বিশ্বস্ত বিদ্যুৎ সরবরাহ।',
        category: 'industrial',
        model: 'EG-2000',
        brand: 'পারকিনস',
        image: 'https://images.pexels.com/photos/162568/generator-power-supply-emergency-162568.jpeg?auto=compress&cs=tinysrgb&w=1600'
      },
      {
        id: 8,
        name: 'কন্ক্রিট মিক্সার',
        description: 'উচ্চ মানের কন্ক্রিট মিক্সার যা নির্মাণ কাজে ব্যবহার করা হয়।',
        category: 'construction',
        model: 'CM-350',
        brand: 'হিমালয়',
        image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600'
      },
      {
        id: 9,
        name: 'ট্র্যাক্টর',
        description: 'আধুনিক ট্র্যাক্টর যা কৃষি কাজে ব্যবহার করা হয়।',
        category: 'agricultural',
        model: 'T-750',
        brand: 'মাহিন্দ্রা',
        image: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=1600'
      }
    ];
    setProducts(productsData);

    // Filter products based on URL parameter
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const categories = [
    { id: 'all', name: 'সকল বিভাগ' },
    { id: 'construction', name: t('categories.construction') },
    { id: 'agricultural', name: t('categories.agricultural') },
    { id: 'industrial', name: t('categories.industrial') }
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
            {t('products.title')}
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            আমাদের বিস্তৃত পণ্য তালিকা থেকে আপনার ব্যবসার প্রয়োজনীয় মেশিন ও যন্ত্রপাতি বেছে নিন।
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Filter size={20} className="mr-2 text-blue-600" />
              <h3 className="text-xl font-semibold">{t('products.category')}</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">{t('products.model')}:</span>
                      <span className="ml-1 text-gray-600">{product.model}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('products.brand')}:</span>
                      <span className="ml-1 text-gray-600">{product.brand}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-blue-600 font-medium">{t('products.contactForPrice')}</span>
                    <Link 
                      to={`/products/${product.id}`}
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {t('products.getQuote')}
                      <ChevronRight size={18} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                এই বিভাগে কোন পণ্য পাওয়া যায়নি।
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;