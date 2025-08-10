import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
// Import your background images
import bg1 from "../assets/bg1.png";
import bg2 from "../assets/bg2.jpeg";
import bg3 from "../assets/bg3.jpg";
import bg4 from "../assets/bg4.jpg";

function Home() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Memoize static data to prevent re-renders
  const texts = useMemo(() => ["Perfect Moments", "Beautiful Memories", "Love Stories", "Special Days", "Dream Weddings"], []);
  const backgroundImages = useMemo(() => [bg1, bg2, bg3, bg4], []);

  const services = useMemo(() => [
    {
      icon: "👑",
      title: "Wedding Photography",
      description: "Complete wedding coverage with candid moments, rituals, and family portraits",
      features: ["Engagement Ceremony", "Mehendi & Haldi", "Wedding Day", "Reception"]
    },
    {
      icon: "💖",
      title: "Pre-Wedding Shoots",
      description: "Romantic outdoor and studio sessions to capture your love story",
      features: ["Outdoor Locations", "Studio Sessions", "Concept Shoots", "Props & Styling"]
    },
    {
      icon: "🎬",
      title: "Event Videography",
      description: "Cinematic videos and highlight reels of your special moments",
      features: ["Same Day Edit", "Highlight Reels", "Full Event Coverage", "Drone Shots"]
    },
    {
      icon: "📷",
      title: "Portrait Photography",
      description: "Professional portraits for families, individuals, and corporate needs",
      features: ["Family Portraits", "Baby Shoots", "Corporate Photos", "Fashion Shoots"]
    },
    {
      icon: "📚",
      title: "Premium Albums",
      description: "Handcrafted albums and frames to preserve your precious memories",
      features: ["Coffee Table Books", "Canvas Prints", "Photo Frames", "Digital Gallery"]
    },
    {
      icon: "🏛️",
      title: "Corporate Events",
      description: "Professional coverage for business events and conferences",
      features: ["Conferences", "Product Launches", "Team Building", "Award Ceremonies"]
    }
  ], []);

  const testimonials = useMemo(() => [
    {
      name: "Priya & Rajesh",
      location: "Bhubaneswar",
      text: "Picture Smile Studio ra kama bahut bhala! Our wedding photos are absolutely stunning. The team captured every emotion beautifully.",
      rating: 5
    },
    {
      name: "Sneha Patel",
      location: "Cuttack",
      text: "Amazing experience! Sabubele photos bhala lagila. The pre-wedding shoot was so much fun and the results were beyond our expectations.",
      rating: 5
    },
    {
      name: "Arjun & Kavya",
      location: "Puri",
      text: "Professional service with a personal touch. Kemiti beautiful photos! They made our special day even more memorable.",
      rating: 5
    },
    {
      name: "Ravi Kumar",
      location: "Berhampur",
      text: "Outstanding quality and creativity. The team is very cooperative and understanding. Bahut sundar kama karichhanti!",
      rating: 5
    },
    {
      name: "Anita & Suresh",
      location: "Sambalpur",
      text: "From booking to delivery, everything was smooth. Ame khusi! The album quality is top-notch and worth every penny.",
      rating: 5
    },
    {
      name: "Deepika Singh",
      location: "Rourkela",
      text: "They captured our emotions so perfectly! Seithi photos dekhi ame cry kalauni. Highly recommend Picture Smile Studio!",
      rating: 5
    }
  ], []);

  // Optimized typewriter effect - reduced frequency
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < texts[currentIndex].length) {
        setCurrentText(texts[currentIndex].substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentText(texts[currentIndex].substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === texts[currentIndex].length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setCurrentIndex((currentIndex + 1) % texts.length);
      }
    }, isDeleting ? 80 : 150); // Slower typing for better performance

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, charIndex, isDeleting, texts]);

  // Slower background changes
  useEffect(() => {
    const bgInterval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 12000); // Slower changes

    return () => clearInterval(bgInterval);
  }, [backgroundImages.length]);

  // Slower testimonial rotation
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000); // Slower rotation

    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  return (
    <>
      <Helmet>
        <title>Smile Photo Studio | Capture Your Perfect Moments</title>
        <meta name="description" content="Smile Photo Studio - Wedding photography, pre-wedding shoots, event coverage and premium albums. Book your session today!" />
        <meta name="keywords" content="wedding photography, event shooting, pre-wedding, albums, Smile Studio" />
        <meta name="author" content="Smile Photo Studio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Hero Section - Optimized */}
      <section className="relative min-h-screen w-full flex items-center justify-center pt-24 overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={bgIndex}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
            style={{ backgroundImage: `url(${backgroundImages[bgIndex]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>
        <div className="bg-gradient-to-r from-black/40 via-transparent to-black/30 w-full h-full absolute top-0 left-0" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
          <h1 className="text-white text-4xl md:text-7xl font-extrabold leading-tight mb-4 drop-shadow-2xl animate-slide-up">
            <span className="block sm:inline">Capture Your</span>{" "}
            <span className="text-pink-200 block sm:inline">{currentText}<span className="animate-pulse">|</span></span>
          </h1>
          <p className="text-white text-base md:text-xl font-medium max-w-xl md:max-w-2xl mb-6 drop-shadow-lg animate-slide-up leading-relaxed" style={{animationDelay: '0.2s'}}>
            <strong className="text-pink-200">Picture Smile Studio</strong> – Where every frame tells your unique love story. Professional <strong>wedding photography</strong>, <strong>pre-wedding shoots</strong>, and <strong>event photography</strong> services.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs md:text-sm border border-white/30 hover:bg-white/30 transition-all">
              ⭐ 5.0 Rating
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs md:text-sm border border-white/30 hover:bg-white/30 transition-all">
              🏆 Award Winning
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs md:text-sm border border-white/30 hover:bg-white/30 transition-all">
              👰‍♀️ 500+ Couples
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{animationDelay: '0.6s'}}>
            <Link
              to="https://wa.me/917682991297"
              className="px-6 py-3 bg-pink-600 text-white text-lg font-bold rounded-lg shadow-xl hover:bg-pink-700 transition-all duration-300 border-2 border-white/50 hover:scale-105"
            >
              Book Your Session
            </Link>
            <Link
              to="/gallery"
              className="px-6 py-3 bg-white/90 backdrop-blur-sm text-pink-600 text-lg font-semibold rounded-lg shadow-xl hover:bg-white transition-all duration-300 hover:scale-105"
            >
              View Our Work
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-12 w-full max-w-5xl animate-slide-up" style={{animationDelay: '0.8s'}}>
            <div className="bg-white/10 backdrop-blur-sm text-white p-4 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 text-center">
              <h3 className="text-lg font-bold mb-1">📸 Wedding Photography</h3>
              <p className="text-sm">Artistic excellence</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-white p-4 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 text-center">
              <h3 className="text-lg font-bold mb-1">🎥 Event Videos</h3>
              <p className="text-sm">Cinematic storytelling</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-white p-4 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 text-center">
              <h3 className="text-lg font-bold mb-1">📔 Premium Albums</h3>
              <p className="text-sm">Beautiful keepsakes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-white p-4 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 text-center">
              <h3 className="text-lg font-bold mb-1">💕 Pre Wedding Shoots</h3>
              <p className="text-sm">Forever moments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of your sections remain the same... */}
      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Our <span className="text-pink-600">Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From intimate moments to grand celebrations, we offer comprehensive photography and videography services 
              to make your special occasions unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 group hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <span className="text-pink-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-block px-8 py-4 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              What Our <span className="text-pink-600">Happy Couples</span> Say
            </h2>
            <p className="text-lg text-gray-600">
              Hear from our satisfied clients about their experience with Picture Smile Studio
            </p>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mx-auto max-w-4xl"
              >
                <div className="flex items-center justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-8 italic leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="text-center">
                  <h4 className="text-xl font-bold text-gray-800 mb-1">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-pink-600 font-medium">
                    📍 {testimonials[currentTestimonial].location}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-pink-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center mt-16">
            <p className="text-3xl md:text-4xl text-pink-600 mb-2" style={{ fontFamily: 'Dancing Script, cursive', fontWeight: '600' }}>
              Thank you Team PS 💖
            </p>
            <p className="text-lg text-gray-600" style={{ fontFamily: 'Playfair Display, serif' }}>
              With love and gratitude
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">500+</div>
              <div className="text-gray-600">Happy Couples</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">1000+</div>
              <div className="text-gray-600">Events Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">5.0</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">7+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Optimized CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out both;
        }
        .will-change-transform {
          will-change: transform;
        }
      `}</style>
    </>
  );
}

export default Home;