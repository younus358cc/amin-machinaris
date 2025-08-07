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
      // Existing Construction Equipment
      {
        id: 1,
        name: 'হাইড্রোলিক এক্সকাভেটর',
        description: 'হাইড্রোলিক এক্সকাভেটর নির্মাণ প্রকল্পের জন্য আদর্শ, কঠিন মাটি এবং ভারী সামগ্রী খনন করে।',
        category: 'construction',
        model: 'EX-220',
        brand: 'কাটারপিলার',
        image: 'https://yua.kaioumachinery.com/uploads/201916199/hydraulic-medium-crawler-excavator-machine26398643300.jpg'
      },
      {
        id: 4,
        name: 'ফ্রন্ট এন্ড লোডার',
        description: 'ভারী সামগ্রী উত্তোলন এবং স্থানান্তর করার জন্য শক্তিশালী লোডার।',
        category: 'construction',
        model: 'FL-320',
        brand: 'জেসিবি',
        image: 'https://yua.litengma.com/uploads/202110433/china-front-end-bucket-2-ton-liteng-wheel43160459282.jpg'
      },
      {
        id: 8,
        name: 'কন্ক্রিট মিক্সার',
        description: 'উচ্চ মানের কন্ক্রিট মিক্সার যা নির্মাণ কাজে ব্যবহার করা হয়।',
        category: 'construction',
        model: 'CM-350',
        brand: 'হিমালয়',
        image: 'https://acimotors-bd.com/assets/images/product/acimixer/aci-mixer.jpg'
      },
      
      // Industrial Equipment
      {
        id: 2,
        name: 'ইন্ডাস্ট্রিয়াল জেনারেটর',
        description: 'উচ্চ ক্ষমতার জেনারেটর যা আপনার শিল্প প্রতিষ্ঠানের জন্য নিরবচ্ছিন্ন বিদ্যুৎ সরবরাহ নিশ্চিত করে।',
        category: 'industrial',
        model: 'IG-5000',
        brand: 'কুমিনস',
        image: 'https://cdn.bdstall.com/product-image/big_284628.jpg'
      },
      {
        id: 5,
        name: 'ইন্ডাস্ট্রিয়াল কম্প্রেসার',
        description: 'শিল্প প্রতিষ্ঠানের জন্য উচ্চ মানের কম্প্রেসার যা বিভিন্ন কাজে ব্যবহার করা যায়।',
        category: 'industrial',
        model: 'IC-420',
        brand: 'আটলাস কপকো',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxej5WhSP6Djxax-t_d5I60DcZH54KPQ5cSA&s'
      },
      {
        id: 7,
        name: 'ইলেকট্রিক জেনারেটর',
        description: 'আপনার ব্যবসার জন্য বিশ্বস্ত বিদ্যুৎ সরবরাহ।',
        category: 'industrial',
        model: 'EG-2000',
        brand: 'পারকিনস',
        image: 'https://fixit.com.bd/wp-content/uploads/2023/09/pol_pl_AGREGAT-PRADOTWORCZY-INWERTOROWY-2000W-10012928_1-1-400x400.webp'
      },
      
      // Agricultural Equipment - Existing
      {
        id: 3,
        name: 'এগ্রিকালচারাল পাম্প',
        description: 'কৃষি সেচের জন্য আধুনিক পাম্প যা জল সরবরাহ করে এবং ফসলের উৎপাদন বাড়ায়।',
        category: 'agricultural',
        model: 'AP-100',
        brand: 'যামাহা',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSkJImeCRfAyLEB8b2y1dzOckPD9DiFUxFwg&s'
      },
      {
        id: 6,
        name: 'পাওয়ার টিলার',
        description: 'কৃষি জমি চাষের জন্য আধুনিক পাওয়ার টিলার যা কাজকে সহজ করে।',
        category: 'agricultural',
        model: 'PT-500',
        brand: 'সোনালিকা',
        image: 'https://alim.com.bd/assets/uploads/images/336df-df-16.jpg'
      },
      {
        id: 9,
        name: 'ট্র্যাক্টর',
        description: 'আধুনিক ট্র্যাক্টর যা কৃষি কাজে ব্যবহার করা হয়।',
        category: 'agricultural',
        model: 'T-750',
        brand: 'মাহিন্দ্রা',
        image: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=1600'
      },
      
      // NEW PRODUCTS - Rice Mill Equipment
      {
        id: 10,
        name: 'স্মল স্কেল রাইস মিল',
        description: 'ছোট আকারের ধান ভাঙানোর মেশিন যা দৈনিক ৫০০-১০০০ কেজি ধান প্রক্রিয়াজাত করতে পারে। গ্রামীণ এলাকার জন্য আদর্শ।',
        category: 'agricultural',
        model: 'RM-500',
        brand: 'সাতাইশ',
        image: 'https://image.made-in-china.com/202f0j00SbGWUDgHRlYT/Fmnj-Series-Small-Scale-Combined-Rice-Mill.webp',
        price: '৳ ২,৫০,০০০ - ৳ ৩,৫০,০০০'
      },
      {
        id: 11,
        name: 'মিডিয়াম ক্যাপাসিটি রাইস মিল',
        description: 'মাঝারি আকারের ধান প্রক্রিয়াজাতকরণ মেশিন যা দৈনিক ২-৫ টন ধান প্রক্রিয়াজাত করতে পারে। উন্নত পরিষ্কারকরণ সিস্টেম সহ।',
        category: 'agricultural',
        model: 'RM-2000',
        brand: 'এনজিনিয়ারিং',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThQnSvR-7uPhiTHOBdBATOPiAqUE0e5FNlWA&s',
        price: '৳ ৮,০০,০০০ - ৳ ১২,০০,০০০'
      },
      {
        id: 12,
        name: 'ইন্ডাস্ট্রিয়াল রাইস মিল',
        description: 'বৃহৎ শিল্প কারখানার জন্য উচ্চ ক্ষমতাসম্পন্ন ধান প্রক্রিয়াজাতকরণ মেশিন। দৈনিক ১০-২০ টন ধান প্রক্রিয়াজাত করতে পারে।',
        category: 'industrial',
        model: 'RM-10000',
        brand: 'হেভি ইন্ডাস্ট্রিজ',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDOBQBOclcumkqlzKn0PmRvXtQ34sbmLMOrA&s',
        price: 'যোগাযোগ করুন'
      },
      
      // NEW PRODUCTS - Spray Machines
      {
        id: 13,
        name: 'ম্যানুয়াল স্প্রে মেশিন',
        description: 'হাতে চালিত কৃষি স্প্রে মেশিন যা কীটনাশক ও সার প্রয়োগের জন্য ব্যবহৃত হয়। ১৬ লিটার ট্যাংক ক্যাপাসিটি।',
        category: 'agricultural',
        model: 'SM-16L',
        brand: 'এগ্রো টুলস',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPWYzHIpFSFN_mUgVWV_Ubc1Id1AaUifhlwg&s',
        price: '৳ ৩,৫০০ - ৳ ৫,০০০'
      },
      {
        id: 14,
        name: 'ব্যাটারি চালিত স্প্রে মেশিন',
        description: 'রিচার্জেবল ব্যাটারি চালিত স্প্রে মেশিন। ২০ লিটার ক্যাপাসিটি, ৮ ঘন্টা কাজের সময়। ১ একর জমিতে একবারে স্প্রে করা যায়।',
        category: 'agricultural',
        model: 'BSM-20L',
        brand: 'পাওয়ার স্প্রে',
        image: 'https://www.gardentoolsbd.com/storage/12l-spray.png',
        price: '৳ ১৮,০০০ - ৳ ২৫,০০০'
      },
      {
        id: 15,
        name: 'ট্র্যাক্টর মাউন্টেড স্প্রে মেশিন',
        description: 'ট্র্যাক্টরের সাথে সংযুক্ত করে ব্যবহারের জন্য বড় আকারের স্প্রে মেশিন। ৫০০ লিটার ট্যাংক, ১০ মিটার স্প্রে উইথ।',
        category: 'agricultural',
        model: 'TSM-500L',
        brand: 'ফার্ম ইকুইপমেন্ট',
        image: 'https://i0.wp.com/successfarmbd.com/wp-content/uploads/2021/09/%E0%A6%B8%E0%A7%81%E0%A6%B2%E0%A6%AD-%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A1-%E0%A6%B8%E0%A7%8D%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%B0-%E0%A7%A7%E0%A7%AC-%E0%A6%B2%E0%A6%BF%E0%A6%9F%E0%A6%BE%E0%A6%B0-Sulov-Hand-Sprayer-16Ltr.jpg?fit=500%2C500&ssl=1',
        price: '৳ ১,২০,০০০ - ৳ ১,৮০,০০০'
      },
      
      // NEW PRODUCTS - Mahindra Vehicles
      {
        id: 16,
        name: 'মাহিন্দ্রা স্করপিও এন',
        description: 'মাহিন্দ্রার জনপ্রিয় SUV যা শক্তিশালী পারফরমেন্স এবং আরামদায়ক যাত্রার জন্য পরিচিত। ৭ সিটার, ৪WD সুবিধা সহ।',
        category: 'automotive',
        model: 'Scorpio-N Z8L',
        brand: 'মাহিন্দ্রা',
        image: 'https://cdx.dhakamail.com/media/images/2024April/mahindara_20240428_152908359.jpeg',
        price: '৳ ৩৫,০০,০০০ - ৳ ৪৫,০০,০০০'
      },
      {
        id: 17,
        name: 'মাহিন্দ্রা XUV700',
        description: 'প্রিমিয়াম SUV যা অত্যাধুনিক প্রযুক্তি এবং বিলাসবহুল ফিচার সহ। ADAS প্রযুক্তি, প্যানোরামিক সানরুফ।',
        category: 'automotive',
        model: 'XUV700 AX7L',
        brand: 'মাহিন্দ্রা',
        image: 'https://5.imimg.com/data5/CX/SW/BS/GLADMIN-7273/mahindra-yuvo-575-di-4wd-45-hp-tractor-1500-kg-500x500.jpg',
        price: '৳ ৪২,০০,০০০ - ৳ ৫৮,০০,০০০'
      },
      {
        id: 18,
        name: 'মাহিন্দ্রা XUV300',
        description: 'কমপ্যাক্ট SUV যা শহুরে ড্রাইভিং এর জন্য আদর্শ। উন্নত নিরাপত্তা ফিচার এবং ফুয়েল ইফিশিয়েন্সি।',
        category: 'automotive',
        model: 'XUV300 W8(O)',
        brand: 'মাহিন্দ্রা',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIwYl_HERIggc0wnWichiFiC6g7Adkfp-Y6Q&s',
        price: '৳ ২৮,০০,০০০ - ৳ ৩৫,০০,০০০'
      },
      {
        id: 19,
        name: 'মাহিন্দ্রা বোলেরো নিও',
        description: 'রুক্ষ পথের জন্য উপযুক্ত শক্তিশালী SUV। গ্রামীণ এলাকা এবং অফ-রোড ড্রাইভিং এর জন্য আদর্শ।',
        category: 'automotive',
        model: 'Bolero Neo N10(O)',
        brand: 'মাহিন্দ্রা',
        image: 'https://5.imimg.com/data5/SELLER/Default/2023/8/336931261/SV/TE/NX/104849289/5050d-50-hp-john-deere-tractor-1000x1000.jpeg',
        price: '৳ ২৫,০০,০০০ - ৳ ৩২,০০,০০০'
      },
      {
        id: 20,
        name: 'মাহিন্দ্রা পিকআপ ট্রাক',
        description: 'বাণিজ্যিক ব্যবহারের জন্য শক্তিশালী পিকআপ ট্রাক। ১ টন লোড ক্যাপাসিটি, ডাবল ক্যাব সুবিধা।',
        category: 'automotive',
        model: 'Pickup Double Cab',
        brand: 'মাহিন্দ্রা',
        image: 'https://thumb.photo-ac.com/98/98d41d4ce0efe0daa6e2d566e35fe8cb_t.jpeg',
        price: '৳ ২২,০০,০০০ - ৳ ২৮,০০,০০০'
      },
      
      // NEW PRODUCTS - Various Tools
      {
        id: 21,
        name: 'পাওয়ার ড্রিল সেট',
        description: 'প্রফেশনাল গ্রেড কর্ডলেস পাওয়ার ড্রিল সেট। ২০V লিথিয়াম ব্যাটারি, ৫০+ ড্রিল বিট সহ। নির্মাণ ও কারিগরি কাজের জন্য।',
        category: 'tools',
        model: 'PD-20V-Pro',
        brand: 'বোশ',
        image: 'https://supertoolsbd.com/wp-content/uploads/2020/11/TOTAL-115-pcs-680w-drill-kit-300x300.jpg',
        price: '৳ ১২,০০০ - ৳ ১৮,০০০'
      },
      {
        id: 22,
        name: 'এঙ্গেল গ্রাইন্ডার',
        description: 'হেভি ডিউটি এঙ্গেল গ্রাইন্ডার যা মেটাল কাটিং, পলিশিং এবং গ্রাইন্ডিং এর জন্য ব্যবহৃত হয়। ১২৫mm ডিস্ক সাইজ।',
        category: 'tools',
        model: 'AG-125-HD',
        brand: 'ম্যাকিতা',
        image: 'https://bn.smartdeal.com.bd/public/uploads/all/bx2gQWuZrOzYnRMuuNjWGWAT1ieOadQUKMwtxqJv.jpg',
        price: '৳ ৮,৫০০ - ৳ ১২,৫০০'
      },
      {
        id: 23,
        name: 'ওয়েল্ডিং মেশিন',
        description: 'ইনভার্টার টেকনোলজি সহ পোর্টেবল ওয়েল্ডিং মেশিন। ২০০ এম্প ক্যাপাসিটি, ডিজিটাল ডিসপ্লে সহ।',
        category: 'tools',
        model: 'WM-200-INV',
        brand: 'লিংকন',
        image: 'https://www.bisongenerator.com/uploads/allimg/220125/1-16430PC5-1536.jpg',
        price: '৳ ২৫,০০০ - ৳ ৩৫,০০০'
      },
      {
        id: 24,
        name: 'হ্যান্ড টুল সেট',
        description: 'কমপ্লিট হ্যান্ড টুল সেট যাতে রয়েছে স্ক্রু ড্রাইভার, রেঞ্চ, প্লায়ার, হ্যামার এবং অন্যান্য প্রয়োজনীয় টুলস। ১০০+ পিস।',
        category: 'tools',
        model: 'HTS-100-Pro',
        brand: 'স্ট্যানলি',
        image: 'https://tools.com.bd/public/storage/product/tolsen-9pcs-hand-tool-set-665414ac35fd4.jpg',
        price: '৳ ১৫,০০০ - ৳ ২২,০০০'
      },
      {
        id: 25,
        name: 'চেইন স',
        description: 'প্রফেশনাল গ্রেড চেইন স যা গাছ কাটা এবং কাঠ প্রক্রিয়াজাতকরণের জন্য ব্যবহৃত হয়। ১৮ ইঞ্চি বার, অটো অয়েলিং সিস্টেম।',
        category: 'tools',
        model: 'CS-18-Pro',
        brand: 'স্টিহল',
        image: 'https://gw.alicdn.com/imgextra/O1CN01kUxnlr1w30cGv5STo_!!6000000006251-0-yinhe.jpg_540x540.jpg',
        price: '৳ ৩৫,০০০ - ৳ ৪৫,০০০'
      },
      {
        id: 26,
        name: 'কৃষি হ্যান্ড টুলস',
        description: 'কৃষি কাজের জন্য বিশেষভাবে তৈরি হ্যান্ড টুলস সেট। কোদাল, নিড়ানি, কাস্তে, বেলচা সহ সম্পূর্ণ সেট।',
        category: 'agricultural',
        model: 'AHT-Complete',
        brand: 'ফার্ম টুলস',
        image: 'https://www.industrybuying.com/wp-content/uploads/2024/10/Agriculture-Hand-Tools.jpg',
        price: '৳ ৫,০০০ - ৳ ৮,০০০'
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
    { id: 'industrial', name: t('categories.industrial') },
    { id: 'automotive', name: 'অটোমোটিভ' },
    { id: 'tools', name: 'টুলস ও যন্ত্রাংশ' }
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