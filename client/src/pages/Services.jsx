import { useState, useEffect } from "react";
import {
  FaCameraRetro, FaHeart, FaPhotoVideo, FaBookOpen,
  FaUserFriends, FaBaby, FaGraduationCap, FaRing,
  FaWhatsapp, FaPercentage
} from "react-icons/fa";
import { supabase } from "../services/supabaseClient";

function Services() {
  const [discountSettings, setDiscountSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscountSettings();
  }, []);

  const fetchDiscountSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("discount_settings")
        .select("*");

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
      console.error("Error fetching discounts:", error);
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
    { icon: <FaCameraRetro className="text-3xl text-blue-600" />, title: "Wedding Photography", description: "Capture your big day with elegant and timeless photography.", price: "Starting from ₹25,000" },
    { icon: <FaHeart className="text-3xl text-pink-500" />, title: "Pre-Wedding Shoots", description: "Romantic shoots tailored to your love story in stunning locations.", price: "Starting from ₹8,000" },
    { icon: <FaRing className="text-3xl text-rose-500" />, title: "Engagement Photography", description: "Beautiful moments of your engagement ceremony captured perfectly.", price: "Starting from ₹12,000" },
    { icon: <FaPhotoVideo className="text-3xl text-purple-500" />, title: "Event Coverage", description: "From birthdays to corporate events — we cover it all.", price: "Starting from ₹5,000" },
    { icon: <FaBaby className="text-3xl text-orange-500" />, title: "Maternity & Baby Shoots", description: "Precious moments of motherhood and newborn photography.", price: "Starting from ₹6,000" },
    { icon: <FaGraduationCap className="text-3xl text-indigo-500" />, title: "Portrait Sessions", description: "Professional headshots and personal portrait photography.", price: "Starting from ₹3,000" },
    { icon: <FaBookOpen className="text-3xl text-yellow-500" />, title: "Album Creation", description: "Premium albums designed to preserve your memories beautifully.", price: "Starting from ₹4,000" },
    { icon: <FaUserFriends className="text-3xl text-green-500" />, title: "Client Meet & Demo", description: "Book a demo session to experience our creativity live.", price: "Free Consultation" },
  ];

  const handleBookNow = (serviceName) => {
    const message = `Hi! I'm interested in booking your ${serviceName} service. Could you please provide more details?`;
    const whatsappUrl = `https://wa.me/917682991297?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-gray-50 to-white pt-28 pb-20 px-4" id="services">
        <div className="max-w-7xl mx-auto text-center py-16">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">Loading services...</p>
        </div>
      </section>
    );
  }

  const hasActiveDiscounts = Object.values(discountSettings).some(discount => discount.active);

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white pt-28 pb-20 px-4 md:px-6 lg:px-12" id="services">
      
      {/* Discounts */}
      {hasActiveDiscounts && (
        <div className="max-w-6xl mx-auto mb-14">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-6 md:p-8 text-white text-center relative overflow-hidden">
            <FaPercentage className="absolute top-4 right-4 text-4xl opacity-10" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">🎉 Special Offers This Month!</h2>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {Object.entries(discountSettings).map(([key, discount]) => (
                discount.active && (
                  <div key={key} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <h3 className="text-lg font-semibold mb-1">{discount.title}</h3>
                    <p className="text-sm opacity-90 mb-2">{discount.description}</p>
                    <div className="text-xl font-bold">Save {discount.discount}%</div>
                  </div>
                )
              ))}
            </div>
            <p className="mt-4 text-xs opacity-90">*Offers valid till end of this month. Terms apply.</p>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">Our Services</h2>
        <p className="text-gray-600 text-base md:text-lg mt-2 max-w-2xl mx-auto px-4">
          What we offer to make your moments memorable and transform them into timeless treasures
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="group bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-2xl p-6 text-center border border-gray-100"
          >
            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
              {service.icon}
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors duration-300">
              {service.title}
            </h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
            <div className="mb-4">
              <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                {service.price}
              </span>
            </div>
            <button
              onClick={() => handleBookNow(service.title)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-105"
            >
              <FaWhatsapp /> Book Now
            </button>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">Ready to Create Beautiful Memories?</h3>
          <p className="text-base md:text-lg opacity-90 mb-5 px-2">
            Let's discuss your photography needs and create something amazing together!
          </p>
          <button
            onClick={() => handleBookNow("General Inquiry")}
            className="bg-white text-purple-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <FaWhatsapp className="text-lg" /> Chat with Us Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default Services;
