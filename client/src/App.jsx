import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Component to conditionally render Footer
function ConditionalFooter() {
  const location = useLocation();
  // Show footer on all pages except these
  const hideFooterPaths = ['/login', '/admin'];
  if (hideFooterPaths.includes(location.pathname)) {
    return null;
  }
  return <Footer />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
        {/* Notification Toaster */}
        <Toaster
          position="top-center"
          toastOptions={{
            className: '',
            style: {
              border: '1px solid #ec4899',
              padding: '16px',
              color: '#ec4899',
              background: '#fdf2f8',
            },
          }}
        />
        
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/about" element={
              <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
                <About />
              </div>
            } />
            
            <Route path="/gallery" element={
              <div className="py-12 bg-gradient-to-br from-gray-50 to-white">
                <Gallery />
              </div>
            } />
            
            <Route path="/services" element={
              <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
                <Services />
              </div>
            } />
            
            <Route path="/booking" element={
              <div className="py-12 bg-gradient-to-br from-gray-50 to-white">
                <Booking />
              </div>
            } />
            
            <Route path="/contact" element={
              <div className="py-12 bg-gradient-to-br from-gray-50 to-white">
                <Contact />
              </div>
            } />
            
            <Route path="/login" element={
              <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4">
                <Login />
              </div>
            } />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                    <AdminDashboard />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        
        {/* Conditional Footer */}
        <ConditionalFooter />
      </div>
    </Router>
  );
}

export default App;