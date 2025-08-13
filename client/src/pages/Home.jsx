import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Video, FileText, Play, Eye, ArrowRight, X, Phone, Mail, MapPin } from "lucide-react";
import bg1 from "../assets/bg1.webp";
import bg2 from "../assets/bg2.webp";
import bg3 from "../assets/bg3.webp";
import bg4 from "../assets/bg4.webp";
import { supabase, handleSupabaseError, getImageUrl, getVideoUrl } from "../services/supabaseClient";

function Home() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const [activeGalleryTab, setActiveGalleryTab] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [galleryError, setGalleryError] = useState(null);

  const navigate = useNavigate();

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

  // Fetch gallery data when a tab is clicked
  useEffect(() => {
    const fetchGalleryData = async () => {
      if (!activeGalleryTab) return;

      setLoadingGallery(true);
      setGalleryError(null);
      setGalleryItems([]);

      let tableName, urlGetter;
      if (activeGalleryTab === 'photos') {
        tableName = 'gallery_images';
        urlGetter = getImageUrl;
      } else if (activeGalleryTab === 'videos') {
        tableName = 'gallery_videos';
        urlGetter = getVideoUrl;
      } else if (activeGalleryTab === 'albums') {
        tableName = 'gallery_albums';
        urlGetter = getImageUrl;
      }

      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(4);

        if (error) throw error;

        const itemsWithUrls = data.map(item => ({
          ...item,
          url: item.storage_path ? urlGetter(item.storage_path) : item.image_url || item.thumbnail_url,
          type: activeGalleryTab,
        }));
        setGalleryItems(itemsWithUrls);
      } catch (e) {
        console.error(`Error fetching ${activeGalleryTab}:`, e);
        setGalleryError(handleSupabaseError(e));
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchGalleryData();
  }, [activeGalleryTab]);

  const renderGalleryContent = () => {
    if (loadingGallery) {
      return (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      );
    }

    if (galleryError) {
      return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
          <p className="text-white text-lg text-center p-4">Error: {galleryError}</p>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full p-4 md:p-8 flex flex-col justify-between">
        <div className="flex justify-end p-2">
          <button
            onClick={() => setActiveGalleryTab(null)}
            className="text-white bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors backdrop-blur-sm"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[80vh] p-2">
          {galleryItems.length > 0 ? (
            galleryItems.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-lg overflow-hidden shadow-lg aspect-square group cursor-pointer"
                onClick={() => navigate('/gallery')}
              >
                {item.type === 'videos' ? (
                  <div className="relative w-full h-full bg-black">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      controls={false}
                      muted
                      autoPlay
                      loop
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={48} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url || '/placeholder.svg'}
                    alt={item.title || 'Gallery item'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <h4 className="text-white text-lg font-semibold truncate">{item.title}</h4>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-4 text-center text-white text-lg p-8">No items found for this category.</div>
          )}
        </div>

        <div className="text-center p-4">
          <Link
            to="/gallery"
            className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-semibold rounded-full shadow-lg hover:bg-pink-700 transition-all"
          >
            View All {activeGalleryTab} <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Smile Photo Studio | Capture Your Perfect Moments</title>
      </Helmet>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 mt-24">
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

        <AnimatePresence>
          {activeGalleryTab && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/80"
            >
              {renderGalleryContent()}
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`relative z-30 text-center px-4 transition-transform duration-500 ${activeGalleryTab ? 'translate-y-[-100vh]' : 'translate-y-0'}`}>
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

          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={() => setActiveGalleryTab(activeGalleryTab === 'photos' ? null : 'photos')}
              className={`flex items-center px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300 ${activeGalleryTab === 'photos' ? 'bg-pink-600/90 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
            >
              <Camera size={20} className="mr-2" />
              Photos
            </button>
            <button
              onClick={() => setActiveGalleryTab(activeGalleryTab === 'videos' ? null : 'videos')}
              className={`flex items-center px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300 ${activeGalleryTab === 'videos' ? 'bg-pink-600/90 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
            >
              <Video size={20} className="mr-2" />
              Videos
            </button>
            <button
              onClick={() => setActiveGalleryTab(activeGalleryTab === 'albums' ? null : 'albums')}
              className={`flex items-center px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300 ${activeGalleryTab === 'albums' ? 'bg-pink-600/90 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
            >
              <FileText size={20} className="mr-2" />
              Albums
            </button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            We offer a comprehensive range of photography and videography services to capture every special moment of your life.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-5xl mb-4 text-pink-600">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-500 mb-4">{service.description}</p>
                <ul className="text-left text-gray-600 space-y-1">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-4 h-4 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Happy Clients</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Read what our wonderful clients have to say about their experience with us.
          </p>
          <motion.div
            key={currentTestimonial}
            className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-4 text-yellow-400">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
            <p className="text-xl md:text-2xl font-light text-gray-700 leading-relaxed mb-6">
              "{testimonials[currentTestimonial].text}"
            </p>
            <div className="text-gray-900 font-bold text-lg">{testimonials[currentTestimonial].name}</div>
            <div className="text-gray-500 text-sm">{testimonials[currentTestimonial].location}</div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default Home;