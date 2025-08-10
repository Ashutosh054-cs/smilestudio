import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Camera, Heart, Video, Book } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-16 px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Studio Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <Camera className="text-pink-400" size={32} />
              <h2 className="text-2xl font-bold">Picture Smile Studio</h2>
            </div>
            <p className="text-gray-300 text-base mb-6 leading-relaxed">
              Crafting timeless memories through the art of photography. We specialize in capturing life's most precious moments with creativity, passion, and professional excellence.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/picture_smile__?igsh=YXkxNGJ3MzdnaGg5" className="bg-pink-600 p-3 rounded-full hover:bg-pink-700 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/share/1C1uQZ5uPt/" className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://youtube.com/@picturesmile-o8e?si=uNQRjpbIybLGykw0" className="bg-red-600 p-3 rounded-full hover:bg-red-700 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-pink-400">Our Services</h3>
            <ul className="space-y-3">
              <li><Link to="/Gallery" className="text-gray-300 hover:text-white transition-colors">Wedding Photography</Link></li>
              <li><Link to="/Gallery" className="text-gray-300 hover:text-white transition-colors">Pre-Wedding Shoots</Link></li>
              <li><Link to="/Gallery" className="text-gray-300 hover:text-white transition-colors">Event Coverage</Link></li>
              <li><Link to="/Gallery" className="text-gray-300 hover:text-white transition-colors">Portrait Sessions</Link></li>
              <li><Link to="/Gallery" className="text-gray-300 hover:text-white transition-colors">Premium Albums</Link></li>
              <li><Link to="https://wa.me/917682991297" className="text-pink-400 hover:text-pink-300 transition-colors font-medium">Book Now</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-pink-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-pink-400" />
                <span className="text-gray-300">+91 7682991297 / +91 8144961616</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-pink-400" />
                <span className="text-gray-300">Picturesmile321@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-pink-400 mt-1" />
                <span className="text-gray-300">Picture Smile Studio<br />Kalla, Deogarh<br />Odisha, India 768110</span>
              </li>
            </ul>
            
            {/* Studio Hours */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-pink-400 mb-2">Studio Hours</h4>
              <p className="text-gray-300 text-sm">
                24/7 Open all the time<br />
              </p>
            </div>
          </div>

          {/* Studio Location Map */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-pink-400">Find Us</h3>
            
            {/* Interactive Google Map Embed */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden h-48 mb-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.1234567890!2d85.8245!3d20.2961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDE3JzQ2LjAiTiA4NcKwNDknMjguMyJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-300"
              ></iframe>
              
              {/* Map Overlay for Click */}
              <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-all duration-300 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-gray-800 text-sm font-medium hover:bg-white transition-all">
                  <MapPin size={16} className="inline mr-1" />
                  View on Google Maps
                </div>
              </div>
            </div>

            {/* Alternative: Static Map Image with Click-to-Open */}
            {/* 
            <div className="relative bg-gray-800 rounded-lg overflow-hidden h-48 mb-4 cursor-pointer group"
                 onClick={() => window.open('https://goo.gl/maps/YOUR_GOOGLE_MAPS_LINK', '_blank')}>
              <img 
                src="https://via.placeholder.com/300x200/374151/f8fafc?text=Picture+Smile+Studio+Location"
                alt="Picture Smile Studio Location"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-gray-800 font-medium">
                  <MapPin size={16} className="inline mr-2" />
                  Click to Open Map
                </div>
              </div>
            </div>
            */}
            
            <Link 
              to="/contact"
              className="block w-full text-center bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition-colors font-medium"
            >
              Get Directions
            </Link>
          </div>
        </div>

        {/* Services Highlights */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
              <Heart className="mx-auto text-pink-400 mb-2" size={24} />
              <div className="text-sm font-medium">Wedding Photography</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
              <Video className="mx-auto text-pink-400 mb-2" size={24} />
              <div className="text-sm font-medium">Event Videography</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
              <Camera className="mx-auto text-pink-400 mb-2" size={24} />
              <div className="text-sm font-medium">Portrait Sessions</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
              <Book className="mx-auto text-pink-400 mb-2" size={24} />
              <div className="text-sm font-medium">Premium Albums</div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 <span className="font-semibold text-white">Picture Smile Studio</span>. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;