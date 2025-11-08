/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
/* eslint-enable no-unused-vars */
import { Instagram, Facebook, Youtube, Award, Camera, Heart, X } from "lucide-react";
import { Helmet } from "react-helmet";
import { useState, useCallback, memo } from "react";
import hituPhoto from "../assets/hitu-profile.webp";
import cert1 from "../assets/certificate1.webp";
import cert2 from "../assets/certificate2.webp";
import cert3 from "../assets/certificate3.webp";

// Memoized certificate card component
const CertificateCard = memo(({ cert, index, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 * index }}
        className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
        onClick={() => onClick(cert.img)}
    >
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg p-4 mb-4">
            <img 
                src={cert.img} 
                alt={cert.title} 
                className="w-full h-32 object-cover rounded"
                loading="lazy"
                decoding="async"
            />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{cert.title}</h3>
        <p className="text-gray-600 text-sm">{cert.desc}</p>
    </motion.div>
));

// Memoized social link component
const SocialLink = memo(({ href, icon, bgColor }) => {
    const IconComponent = icon;
    return (
        <motion.a 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${bgColor} p-4 rounded-full hover:opacity-90 transition-all shadow-lg`}
        >
            <IconComponent className="text-white" size={24} />
        </motion.a>
    );
});

function About() {
    const [selectedImage, setSelectedImage] = useState(null);

    const openImage = useCallback((img) => setSelectedImage(img), []);
    const closeImage = useCallback(() => setSelectedImage(null), []);

    const certificates = [
        { img: cert1, title: "Cinematic Videography", desc: "Proud to share this milestone! I've earned a Certificate of Cinematic Videography with 'State Selection' on 09/05/2022." },
        { img: cert2, title: "District Photography Award", desc: "Thrilled to announce I've received the District Photography Award on October 26, 2023." },
        { img: cert3, title: "Excellence Award 2024", desc: "Recognized for outstanding contribution to wedding photography and client satisfaction in Odisha." }
    ];

    return (
        <>
            <Helmet>
                <title>About Hitu Garnayak | Picture Smile Studio</title>
                <meta name="description" content="Meet Hitu Garnayak, passionate photographer and cinematic videographer with 8 years of experience in wedding and event photography." />
                <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Helmet>

            {/* Hero Section */}
            <section className="relative min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-gray-100 flex items-center justify-center pt-24 pb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-100/30 to-purple-100/30"></div>

                <div className="relative z-10 max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Profile Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex justify-center lg:justify-start"
                        >
                            <div className="relative cursor-pointer" onClick={() => openImage(hituPhoto)}>
                                <div className="w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 p-2">
                                    <div className="w-full h-full rounded-full bg-white p-4 shadow-2xl">
                                        <img
                                            src={hituPhoto} 
                                            alt="Hitu Garnayak - Professional Photographer"
                                            className="w-full h-full rounded-full object-cover"
                                            loading="eager"
                                        />
                                    </div>
                                </div>

                                {/* Floating Elements - Simplified */}
                                <div className="absolute -top-4 -right-4 bg-pink-600 p-4 rounded-full shadow-lg animate-bounce">
                                    <Camera className="text-white" size={24} />
                                </div>
                                <div className="absolute -bottom-4 -left-4 bg-purple-600 p-4 rounded-full shadow-lg animate-pulse">
                                    <Heart className="text-white" size={24} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-center lg:text-left"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                <span className="text-pink-600">Hitu Garnayak</span>
                            </h1>
                            <h2 className="text-2xl md:text-3xl text-purple-600 mb-6" style={{ fontFamily: 'Dancing Script, cursive' }}>
                                A Visual Storyteller
                            </h2>

                            <div className="prose prose-lg max-w-none text-gray-700 mb-8 leading-relaxed">
                                <p className="mb-4">
                                    With a lens in hand and an eye for detail, I am <strong className="text-pink-600">Hitu Garnayak</strong>,
                                    a passionate photographer and cinematic videographer. For the past <strong>8 years</strong>, I've dedicated
                                    my craft to transforming fleeting moments into timeless stories.
                                </p>
                                <p className="mb-4">
                                    My expertise spans a wide range of events, from the intimate emotions of a wedding to the
                                    dynamic energy of a live performance. I believe the most compelling images and videos are
                                    those that capture <strong className="text-purple-600">genuine feelings and authentic connections</strong>.
                                </p>
                                <p className="text-lg">
                                    I'm not just a person behind a camera; I'm a <strong className="text-pink-600">storyteller</strong>.
                                    My goal is to create memories that you can relive and cherish forever.
                                    <span className="text-purple-600 font-semibold"> Let's create something beautiful together.</span>
                                </p>
                            </div>

                            {/* Social Links */}
                            <div className="flex justify-center lg:justify-start space-x-4 mb-8">
                                <SocialLink href="https://www.instagram.com/picture_smile__?igsh=YXkxNGJ3MzdnaGg5" icon={Instagram} bgColor="bg-pink-600" />
                                <SocialLink href="https://www.facebook.com/share/1C1uQZ5uPt/" icon={Facebook} bgColor="bg-blue-600" />
                                <SocialLink href="https://youtube.com/@picturesmile-o8e?si=uNQRjpbIybLGykw0" icon={Youtube} bgColor="bg-red-600" />
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 text-center">
                                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                                    <div className="text-2xl font-bold text-pink-600 mb-1">8+</div>
                                    <div className="text-gray-600 text-sm">Years Experience</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                                    <div className="text-2xl font-bold text-purple-600 mb-1">500+</div>
                                    <div className="text-gray-600 text-sm">Happy Clients</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                                    <div className="text-2xl font-bold text-pink-600 mb-1">1000+</div>
                                    <div className="text-gray-600 text-sm">Projects Done</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Certificates */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }} 
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            <Award className="inline-block mr-3 text-pink-600" size={48} />
                            Certifications & <span className="text-pink-600">Achievements</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Recognized expertise and continuous learning in the art of photography and videography
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certificates.map((cert, i) => (
                            <CertificateCard key={i} cert={cert} index={i} onClick={openImage} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence mode="wait">
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={closeImage}
                    >
                        <motion.div
                            className="relative max-w-4xl w-full p-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={closeImage} className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors">
                                <X className="text-black" size={24} />
                            </button>
                            <img 
                                src={selectedImage} 
                                alt="Enlarged" 
                                className="w-full max-h-[80vh] object-contain rounded-lg"
                                loading="lazy"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default About;
