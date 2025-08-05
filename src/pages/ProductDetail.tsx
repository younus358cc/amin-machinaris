import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Download, Send } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  model: string;
  brand: string;
  image: string;
  detailedDescription?: string;
  specifications?: Record<string, string>;
  features?: string[];
}

const ProductDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'features'>('overview');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Simulate API fetch for product details
    const fetchProduct = () => {
      setLoading(true);
      
      // Mock product data
      const mockProducts: Record<string, Product> = {
        '1': {
          id: 1,
          name: 'হাইড্রোলিক এক্সকাভেটর',
          description: 'হাইড্রোলিক এক্সকাভেটর নির্মাণ প্রকল্পের জন্য আদর্শ, কঠিন মাটি এবং ভারী সামগ্রী খনন করে।',
          category: 'construction',
          model: 'EX-220',
          brand: 'কাটারপিলার',
          image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600',
          detailedDescription: 'আমাদের হাইড্রোলিক এক্সকাভেটর অত্যাধুনিক প্রযুক্তি ব্যবহার করে তৈরি করা হয়েছে যা আপনাকে যেকোনো ধরণের নির্মাণ প্রকল্পে সর্বোচ্চ দক্ষতা অর্জন করতে সাহায্য করে। এটি উচ্চ ক্ষমতাসম্পন্ন ইঞ্জিন এবং উন্নত হাইড্রোলিক সিস্টেম দিয়ে সজ্জিত, যা কঠিন মাটি এবং ভারী সামগ্রী সহজে খনন করতে পারে। এটি বিভিন্ন ধরণের অ্যাটাচমেন্টের সাথে ব্যবহার করা যেতে পারে, যা একে একটি বহুমুখী যন্ত্র করে তোলে।',
          specifications: {
            'ইঞ্জিন': 'কাটারপিলার C6.6 ACERT™',
            'ইঞ্জিন পাওয়ার': '128 kW / 172 hp',
            'অপারেটিং ওয়েট': '22,000 kg',
            'বাকেট ক্যাপাসিটি': '1.0 - 1.5 m³',
            'ডিগিং ডেপথ': '6,620 mm',
            'ফুয়েল ট্যাংক': '410 L'
          },
          features: [
            'উন্নত হাইড্রোলিক সিস্টেম',
            'ইকো মোড ফর ফুয়েল ইফিশিয়েন্সি',
            'স্পেশাল বুম ডিজাইন',
            'এডভান্সড অপারেটর কেবিন',
            'রিমোট মনিটরিং সিস্টেম',
            'আন্ডারক্যারেজ প্রোটেকশন'
          ]
        },
        '2': {
          id: 2,
          name: 'ইন্ডাস্ট্রিয়াল জেনারেটর',
          description: 'উচ্চ ক্ষমতার জেনারেটর যা আপনার শিল্প প্রতিষ্ঠানের জন্য নিরবচ্ছিন্ন বিদ্যুৎ সরবরাহ নিশ্চিত করে।',
          category: 'industrial',
          model: 'IG-5000',
          brand: 'কুমিনস',
          image: 'https://images.pexels.com/photos/162568/generator-power-supply-emergency-162568.jpeg?auto=compress&cs=tinysrgb&w=1600',
          detailedDescription: 'আমাদের ইন্ডাস্ট্রিয়াল জেনারেটরগুলি শিল্প প্রতিষ্ঠানের জন্য নিরবচ্ছিন্ন বিদ্যুৎ সরবরাহ নিশ্চিত করতে ডিজাইন করা হয়েছে। এগুলি উচ্চ মানের কুমিনস ইঞ্জিন দিয়ে তৈরি, যা দীর্ঘস্থায়ী এবং নির্ভরযোগ্য কার্যক্ষমতা প্রদান করে। এই জেনারেটরগুলি বিদ্যুৎ বিভ্রাট, লোডশেডিং বা অন্যান্য জরুরী অবস্থায় আপনার ব্যবসা চালু রাখতে আদর্শ।',
          specifications: {
            'ইঞ্জিন': 'কুমিনস QSX15-G9',
            'পাওয়ার আউটপুট': '500 kVA / 400 kW',
            'ফ্রিকোয়েন্সি': '50 Hz',
            'ভোল্টেজ': '400/230V',
            'ফুয়েল টাইপ': 'ডিজেল',
            'ফুয়েল ট্যাংক': '1000 L',
            'অপারেটিং টাইম': '24 আওয়ার্স অন ফুল লোড'
          },
          features: [
            'অটোমেটিক ট্রান্সফার সুইচ',
            'ডিজিটাল কন্ট্রোল প্যানেল',
            'রিমোট মনিটরিং',
            'লো নয়েজ অপারেশন',
            'এমিশন কমপ্লায়েন্ট',
            'ওয়েদার প্রুফ ইনক্লোজার'
          ]
        },
        '3': {
          id: 3,
          name: 'এগ্রিকালচারাল পাম্প',
          description: 'কৃষি সেচের জন্য আধুনিক পাম্প যা জল সরবরাহ করে এবং ফসলের উৎপাদন বাড়ায়।',
          category: 'agricultural',
          model: 'AP-100',
          brand: 'যামাহা',
          image: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=1600',
          detailedDescription: 'আমাদের এগ্রিকালচারাল পাম্পগুলি বাংলাদেশের কৃষকদের চাহিদা মাথায় রেখে তৈরি করা হয়েছে। এই পাম্পগুলি কৃষি সেচের জন্য আদর্শ, যা দক্ষতার সাথে জল সরবরাহ করে এবং ফসলের উৎপাদন বাড়াতে সাহায্য করে। এগুলি সহজে পরিবহনযোগ্য, টেকসই এবং কম রক্ষণাবেক্ষণের প্রয়োজন হয়।',
          specifications: {
            'ইঞ্জিন': 'যামাহা MZ175',
            'হর্সপাওয়ার': '5 HP',
            'ডিসচার্জ সাইজ': '2 ইঞ্চি',
            'ম্যাক্সিমাম ফ্লো রেট': '600 L/min',
            'ম্যাক্সিমাম হেড': '28 m',
            'ফুয়েল ট্যাংক': '3.6 L',
            'ফুয়েল টাইপ': 'পেট্রোল'
          },
          features: [
            'পোর্টেবল ডিজাইন',
            'সেলফ-প্রাইমিং',
            'লো নয়েজ অপারেশন',
            'লং লাইফ মেকানিক্যাল সিল',
            'ইজি স্টার্ট সিস্টেম',
            'ফুয়েল ইফিশিয়েন্ট'
          ]
        },
        '10': {
          id: 10,
          name: 'স্মল স্কেল রাইস মিল',
          description: 'ছোট আকারের ধান ভাঙানোর মেশিন যা দৈনিক ৫০০-১০০০ কেজি ধান প্রক্রিয়াজাত করতে পারে। গ্রামীণ এলাকার জন্য আদর্শ।',
          category: 'agricultural',
          model: 'RM-500',
          brand: 'সাতাইশ',
          image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=1600',
          detailedDescription: 'আমাদের স্মল স্কেল রাইস মিল গ্রামীণ এলাকার ছোট ব্যবসায়ীদের জন্য বিশেষভাবে ডিজাইন করা হয়েছে। এই মেশিনটি দৈনিক ৫০০ থেকে ১০০০ কেজি ধান প্রক্রিয়াজাত করতে পারে এবং উচ্চ মানের চাল উৎপাদন করে। এটি কম বিদ্যুৎ খরচ করে এবং সহজে পরিচালনা করা যায়। মেশিনটিতে রয়েছে অটোমেটিক ক্লিনিং সিস্টেম যা চালের মান বজায় রাখে।',
          specifications: {
            'প্রক্রিয়াজাতকরণ ক্ষমতা': '৫০০-১০০০ কেজি/দিন',
            'মোটর পাওয়ার': '১৫ HP',
            'ভোল্টেজ': '৩৮০V, ৩ ফেজ',
            'চাল রিকভারি রেট': '৬৮-৭০%',
            'ভাঙা চালের হার': '৩-৫%',
            'মেশিনের ওজন': '১২০০ কেজি',
            'ডাইমেনশন': '৮×৪×৬ ফুট'
          },
          features: [
            'অটোমেটিক ক্লিনিং সিস্টেম',
            'কম বিদ্যুৎ খরচ',
            'সহজ পরিচালনা',
            'উচ্চ মানের চাল উৎপাদন',
            'কম রক্ষণাবেক্ষণ',
            'দীর্ঘস্থায়ী যন্ত্রাংশ'
          ]
        },
        '16': {
          id: 16,
          name: 'মাহিন্দ্রা স্করপিও এন',
          description: 'মাহিন্দ্রার জনপ্রিয় SUV যা শক্তিশালী পারফরমেন্স এবং আরামদায়ক যাত্রার জন্য পরিচিত। ৭ সিটার, ৪WD সুবিধা সহ।',
          category: 'automotive',
          model: 'Scorpio-N Z8L',
          brand: 'মাহিন্দ্রা',
          image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1600',
          detailedDescription: 'মাহিন্দ্রা স্করপিও এন হল একটি প্রিমিয়াম SUV যা শক্তিশালী পারফরমেন্স এবং আধুনিক প্রযুক্তির সমন্বয়। এটি ২.২ লিটার mHawk ডিজেল ইঞ্জিন দিয়ে সজ্জিত যা ১৩২ HP পাওয়ার এবং ৩০০ Nm টর্ক প্রদান করে। গাড়িটিতে রয়েছে ৪WD সিস্টেম যা যেকোনো রাস্তায় চলাচলের জন্য উপযুক্ত। আরামদায়ক ৭ সিটের ব্যবস্থা এবং প্রিমিয়াম ইন্টেরিয়র ডিজাইন এটিকে পারিবারিক ব্যবহারের জন্য আদর্শ করে তুলেছে।',
          specifications: {
            'ইঞ্জিন': '২.২L mHawk ডিজেল',
            'পাওয়ার': '১৩২ HP @ ৩৭৫০ rpm',
            'টর্ক': '৩০০ Nm @ ১৭৫০-২৯০০ rpm',
            'ট্রান্সমিশন': '৬-স্পিড ম্যানুয়াল/অটোমেটিক',
            'ড্রাইভট্রেইন': '২WD/৪WD',
            'ফুয়েল ট্যাংক': '৫৭ লিটার',
            'মাইলেজ': '১২-১৪ কিমি/লিটার'
          },
          features: [
            '৮.৮" টাচস্ক্রিন ইনফোটেইনমেন্ট',
            'অটোমেটিক ক্লাইমেট কন্ট্রোল',
            'ক্রুজ কন্ট্রোল',
            '৬ এয়ারব্যাগ',
            'ESP ও হিল হোল্ড অ্যাসিস্ট',
            'অ্যাডভেঞ্চার স্ট্যাটিস্টিক্স ডিসপ্লে'
          ]
        },
        '21': {
          id: 21,
          name: 'পাওয়ার ড্রিল সেট',
          description: 'প্রফেশনাল গ্রেড কর্ডলেস পাওয়ার ড্রিল সেট। ২০V লিথিয়াম ব্যাটারি, ৫০+ ড্রিল বিট সহ। নির্মাণ ও কারিগরি কাজের জন্য।',
          category: 'tools',
          model: 'PD-20V-Pro',
          brand: 'বোশ',
          image: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=1600',
          detailedDescription: 'বোশের প্রফেশনাল গ্রেড কর্ডলেস পাওয়ার ড্রিল সেট যা নির্মাণ কাজ, কারিগরি কাজ এবং DIY প্রকল্পের জন্য আদর্শ। এই সেটে রয়েছে ২০V লিথিয়াম-আয়ন ব্যাটারি যা দীর্ঘ সময় কাজ করতে পারে। ড্রিলটিতে ২-স্পিড গিয়ারবক্স এবং ২১+১ টর্ক সেটিং রয়েছে যা বিভিন্ন ধরনের কাজের জন্য উপযুক্ত। সাথে রয়েছে ৫০+ ড্রিল বিট এবং স্ক্রু ড্রাইভার বিট।',
          specifications: {
            'ব্যাটারি': '২০V লিথিয়াম-আয়ন',
            'চার্জিং টাইম': '৬০ মিনিট',
            'ম্যাক্স টর্ক': '৫৫ Nm',
            'স্পিড': '০-৪০০/০-১৫০০ rpm',
            'চাক সাইজ': '১৩mm কিলেস',
            'ওজন': '১.৫ কেজি',
            'LED লাইট': 'হ্যাঁ'
          },
          features: [
            '২-স্পিড গিয়ারবক্স',
            '২১+১ টর্ক সেটিং',
            'LED ওয়ার্ক লাইট',
            'এরগনমিক ডিজাইন',
            'ব্যাটারি ইন্ডিকেটর',
            'রিভার্স ফাংশন'
          ]
        }
      };
      
      setTimeout(() => {
        if (id && mockProducts[id]) {
          setProduct(mockProducts[id]);
        } else {
          setProduct(null);
        }
        setLoading(false);
      }, 800);
    };
    
    fetchProduct();
  }, [id]);

  const handleTabChange = (tab: 'overview' | 'specifications' | 'features') => {
    setActiveTab(tab);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Quote request submitted:', formData);
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Reset form status after 3 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">পণ্য পাওয়া যায়নি</h2>
        <p className="mb-6">আপনি যে পণ্যটি খুঁজছেন তা পাওয়া যায়নি।</p>
        <Link 
          to="/products"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors"
        >
          সকল পণ্য দেখুন
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft size={16} className="mr-1" />
            সকল পণ্য
          </Link>
        </div>
        
        {/* Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto object-cover"
            />
          </motion.div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="block text-sm text-gray-500">{t('products.model')}</span>
                <span className="font-semibold">{product.model}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="block text-sm text-gray-500">{t('products.brand')}</span>
                <span className="font-semibold">{product.brand}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="block text-sm text-gray-500">{t('products.category')}</span>
                <span className="font-semibold">
                  {product.category === 'construction' ? t('categories.construction') : 
                   product.category === 'agricultural' ? t('categories.agricultural') : 
                   product.category === 'industrial' ? t('categories.industrial') :
                   product.category === 'automotive' ? 'অটোমোটিভ' :
                   product.category === 'tools' ? 'টুলস ও যন্ত্রাংশ' :
                   'অন্যান্য'}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="block text-sm text-gray-500">{t('products.price')}</span>
                <span className="font-semibold text-blue-600">
                  {product.price || t('products.contactForPrice')}
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById('quoteForm')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
              >
                {t('products.getQuote')}
                <Send size={18} className="ml-2" />
              </button>
              <button className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg transition-colors">
                ডাউনলোড ক্যাটালগ
                <Download size={18} className="ml-2" />
              </button>
              <button className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg transition-colors">
                শেয়ার করুন
                <Share2 size={18} className="ml-2" />
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-16">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => handleTabChange('overview')}
              className={`px-6 py-4 font-medium text-sm uppercase tracking-wider transition-colors ${
                activeTab === 'overview' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              ওভারভিউ
            </button>
            <button
              onClick={() => handleTabChange('specifications')}
              className={`px-6 py-4 font-medium text-sm uppercase tracking-wider transition-colors ${
                activeTab === 'specifications' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              স্পেসিফিকেশন
            </button>
            <button
              onClick={() => handleTabChange('features')}
              className={`px-6 py-4 font-medium text-sm uppercase tracking-wider transition-colors ${
                activeTab === 'features' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              ফিচারস
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">{product.name} সম্পর্কে</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.detailedDescription}
                </p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">টেকনিক্যাল স্পেসিফিকেশন</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-3 text-left font-medium">{key}</td>
                          <td className="px-6 py-3 text-left">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'features' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">প্রধান বৈশিষ্ট্য</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features && product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Quote Request Form */}
        <div id="quoteForm" className="bg-gray-50 rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-6">কোটেশনের জন্য অনুরোধ করুন</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('contact.phone')}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                {t('contact.message')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="আপনার প্রয়োজনীয়তা সম্পর্কে আমাদের জানান..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={formStatus === 'sending'}
              className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors text-lg font-medium ${
                formStatus === 'sending' ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {formStatus === 'sending' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  অনুরোধ পাঠানো হচ্ছে...
                </>
              ) : (
                <>
                  কোটেশনের জন্য অনুরোধ করুন
                  <Send className="ml-2" size={20} />
                </>
              )}
            </button>
            
            {/* Success Message */}
            {formStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg"
              >
                আপনার অনুরোধ সফলভাবে পাঠানো হয়েছে। আমরা দ্রুত আপনার সাথে যোগাযোগ করব।
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;