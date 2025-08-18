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
import ErrorBoundary from './components/ErrorBoundary';

// ✅ New pages for Video and Album
import VideoPage from './pages/Videoapage';
import AlbumPage from './pages/Albumpage';

// Component to conditionally render Navbar
function ConditionalNavbar() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/admin']; // Hide navbar on these routes
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }
  return <Navbar />;
}

// Component to conditionally render Footer
function ConditionalFooter() {
  const location = useLocation();
  const hideFooterPaths = ['/login', '/admin']; // Hide footer on these routes
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
        
        {/* Conditional Navbar */}
        <ConditionalNavbar />
        
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
            {/* Fixed Login Route - Remove extra wrapper divs */}
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  {/* No navbar here */}
                  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                    <ErrorBoundary>
                      <AdminDashboard />
                    </ErrorBoundary>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* ✅ New routes for Video and Album pages */}
            <Route path="/video/:id" element={<VideoPage />} />
            <Route path="/album/:id" element={<AlbumPage />} />

          </Routes>
        </main>
        
        {/* Conditional Footer */}
        <ConditionalFooter />
      </div>
    </Router>
  );
}

export default App;
