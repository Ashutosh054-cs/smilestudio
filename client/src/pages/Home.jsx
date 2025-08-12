import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import bg1 from "../assets/bg1.webp";
import bg2 from "../assets/bg2.webp";
import bg3 from "../assets/bg3.webp";
import bg4 from "../assets/bg4.webp";

function Home() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const texts = useMemo(
    () => ["Perfect Moments", "Beautiful Memories", "Love Stories", "Special Days", "Dream Weddings"],
    []
  );
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
    }
  ], []);

  // Preload background images
  useEffect(() => {
    backgroundImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [backgroundImages]);

  // Typewriter effect
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
    }, isDeleting ? 80 : 150);
    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, charIndex, isDeleting, texts]);

  // Background change
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <>
      <Helmet>
        <title>Smile Photo Studio | Capture Your Perfect Moments</title>
      </Helmet>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={bgIndex}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImages[bgIndex]})` }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center px-4">
          <motion.h1
            className="text-white text-4xl md:text-7xl font-extrabold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Capture Your{" "}
            <span className="text-pink-200">
              {currentText}
              <span className="animate-pulse">|</span>
            </span>
          </motion.h1>

          <motion.p
            className="text-white max-w-xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <strong className="text-pink-200">Picture Smile Studio</strong> – Where every frame tells your unique love story.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="https://wa.me/917682991297"
              className="px-6 py-3 bg-pink-600 text-white font-bold rounded-lg shadow-lg hover:bg-pink-700 transition"
            >
              Book Your Session
            </Link>
            <Link
              to="/gallery"
              className="px-6 py-3 bg-white text-pink-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              View Our Work
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Our <span className="text-pink-600">Services</span>
            </h2>
            <p className="text-lg text-gray-600">
              From intimate moments to grand celebrations, we offer full coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <span className="text-pink-500 mr-2">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Explore More Services Button */}
          <div className="text-center">
            <Link
              to="/services"
              className="inline-block px-8 py-3 bg-pink-600 text-white font-semibold rounded-full shadow-lg hover:bg-pink-700 hover:scale-105 transition-transform duration-300"
            >
              Explore More Services →
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            What Our <span className="text-pink-600">Happy Couples</span> Say
          </h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <div className="mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                ))}
              </div>
              <blockquote className="text-xl italic mb-8">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <h4 className="text-xl font-bold">
                {testimonials[currentTestimonial].name}
              </h4>
              <p className="text-pink-600">
                📍 {testimonials[currentTestimonial].location}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

export default Home;
