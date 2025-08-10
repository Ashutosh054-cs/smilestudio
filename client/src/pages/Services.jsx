import { useState, useEffect } from "react";

// Replace these with your actual imports
import { FaCameraRetro, FaHeart, FaPhotoVideo, FaBookOpen, FaUserFriends, FaBaby, FaGraduationCap, FaRing, FaWhatsapp, FaPercentage } from "react-icons/fa";
import { supabase } from '../services/supabaseClient'; // Adjust path as needed

function Services() {
  const [discountSettings, setDiscountSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscountSettings();
  }, []);

  const fetchDiscountSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('discount_settings')
        .select('*');
      
      if (error) throw error;
      
      const discountObj = {};
      data.forEach(item => {
        discountObj[item.key] = {
          title: item.title,
          description: item.description,
          discount: item.discount,
          active: item.active
        };
      });
      setDiscountSettings(discountObj);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      // Fallback to default settings
      setDiscountSettings({
        weddingPackage: { 
          title: "Wedding Package Deal", 
          description: "Book Wedding + Pre-Wedding together", 
          discount: 20,
          active: true
        },
        earlyBird: { 
          title: "Early Bird Discount", 
          description: "Book 3 months in advance", 
          discount: 15,
          active: true
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      icon: <FaCameraRetro className="text-3xl text-blue-600" />,
      title: "Wedding Photography",
      description: "Capture your big day with elegant and timeless photography.",
      price: "Starting from ₹25,000"
    },
    {
      icon: <FaHeart className="text-3xl text-pink-500" />,
      title: "Pre-Wedding Shoots",
      description: "Romantic shoots tailored to your love story in stunning locations.",
      price: "Starting from ₹8,000"
    },
    {
      icon: <FaRing className="text-3xl text-rose-500" />,
      title: "Engagement Photography",
      description: "Beautiful moments of your engagement ceremony captured perfectly.",
      price: "Starting from ₹12,000"
    },
    {
      icon: <FaPhotoVideo className="text-3xl text-purple-500" />,
      title: "Event Coverage",
      description: "From birthdays to corporate events — we cover it all.",
      price: "Starting from ₹5,000"
    },
    {
      icon: <FaBaby className="text-3xl text-orange-500" />,
      title: "Maternity & Baby Shoots",
      description: "Precious moments of motherhood and newborn photography.",
      price: "Starting from ₹6,000"
    },
    {
      icon: <FaGraduationCap className="text-3xl text-indigo-500" />,
      title: "Portrait Sessions",
      description: "Professional headshots and personal portrait photography.",
      price: "Starting from ₹3,000"
    },
    {
      icon: <FaBookOpen className="text-3xl text-yellow-500" />,
      title: "Album Creation",
      description: "Premium albums designed to preserve your memories beautifully.",
      price: "Starting from ₹4,000"
    },
    {
      icon: <FaUserFriends className="text-3xl text-green-500" />,
      title: "Client Meet & Demo",
      description: "Book a demo session to experience our creativity live.",
      price: "Free Consultation"
    },
  ];

  const handleBookNow = (serviceName) => {
    const message = `Hi! I'm interested in booking your ${serviceName} service. Could you please provide more details?`;
    const whatsappUrl = `https://wa.me/917682991297?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-gray-50 to-white pt-32 pb-16 px-4 md:px-8 lg:px-20" id="services">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </section>
    );
  }

  const hasActiveDiscounts = Object.values(discountSettings).some(discount => discount.active);

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white pt-32 pb-16 px-4 md:px-8 lg:px-20" id="services">
      {/* Dynamic Discount Section */}
      {hasActiveDiscounts && (
        <div className="max-w-6xl mx-auto mb-12 lg:mb-16">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-6 md:p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 md:top-4 md:right-4">
              <FaPercentage className="text-2xl md:text-4xl opacity-20" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                🎉 Special Offers This Month!
              </h2>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
                {Object.entries(discountSettings).map(([key, discount]) => (
                  discount.active && (
                    <div key={key} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/30">
                      <h3 className="text-lg md:text-xl font-semibold mb-2">{discount.title}</h3>
                      <p className="text-xs md:text-sm opacity-90 mb-2 md:mb-3">{discount.description}</p>
                      <div className="text-xl md:text-2xl font-bold">Save {discount.discount}%</div>
                    </div>
                  )
                ))}
              </div>
              <p className="mt-4 md:mt-6 text-xs md:text-sm opacity-90">
                *Offers valid till end of this month. Terms and conditions apply.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Services Section */}
      <div className="text-center mb-8 lg:mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-4">Our Services</h2>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
          What we offer to make your moments memorable and transform them into timeless treasures
        </p>
        <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-3 md:mt-4 rounded-full"></div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="group bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-2xl p-4 md:p-6 text-center border border-gray-100 hover:border-purple-200 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-8 md:-translate-y-10 translate-x-8 md:translate-x-10 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="mb-3 md:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3 group-hover:text-purple-700 transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-3 md:mb-4 text-sm leading-relaxed">
                {service.description}
              </p>
              
              <div className="mb-3 md:mb-4">
                <span className="text-base md:text-lg font-bold text-purple-600 bg-purple-50 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                  {service.price}
                </span>
              </div>
              
              <button
                onClick={() => handleBookNow(service.title)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg transform hover:scale-105 text-sm md:text-base"
              >
                <FaWhatsapp className="text-base md:text-lg" />
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12 lg:mt-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
            Ready to Create Beautiful Memories?
          </h3>
          <p className="text-base md:text-lg opacity-90 mb-4 md:mb-6 px-2">
            Let's discuss your photography needs and create something amazing together!
          </p>
          <button
            onClick={() => handleBookNow("General Inquiry")}
            className="bg-white text-purple-600 font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-xl hover:bg-gray-100 transition-colors duration-300 inline-flex items-center gap-2 text-base md:text-lg"
          >
            <FaWhatsapp className="text-lg md:text-xl" />
            Chat with Us Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default Services;