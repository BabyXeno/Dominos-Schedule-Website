import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, RefreshCw, Clock, ClipboardList } from 'lucide-react';
import Button from '../components/ui/Button';
import Layout from '../components/layout/Layout';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-dominos-blue text-white py-20 px-4 rounded-lg mb-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Domino's Schedule Swap
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            The easiest way to manage your work schedule and coordinate shift swaps with your team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            <Button 
              variant="danger" 
              size="lg"
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simplify Your Schedule Management</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Designed specifically for Domino's employees to make scheduling and shift swaps hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="rounded-full bg-blue-100 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Calendar className="text-dominos-blue" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">View Schedules</h3>
            <p className="text-gray-600">
              Access your work schedule anytime, anywhere, on any device.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="rounded-full bg-blue-100 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <RefreshCw className="text-dominos-blue" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Request Swaps</h3>
            <p className="text-gray-600">
              Easily request shift swaps with other employees when you need time off.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="rounded-full bg-blue-100 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Clock className="text-dominos-blue" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
            <p className="text-gray-600">
              Get instant notifications for schedule changes and swap requests.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="rounded-full bg-blue-100 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <ClipboardList className="text-dominos-blue" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Manager Approval</h3>
            <p className="text-gray-600">
              Streamlined approval process for managers to review swap requests.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 rounded-lg p-8 my-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Join your fellow Domino's employees in making schedule management easier.
        </p>
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => navigate('/register')}
        >
          Sign Up Now
        </Button>
      </section>

      {/* Testimonial Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">What Team Members Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
              <div>
                <h4 className="font-semibold">Alex Johnson</h4>
                <p className="text-sm text-gray-600">Delivery Driver</p>
              </div>
            </div>
            <p className="text-gray-600">
              "This app has made it so much easier to swap shifts with my coworkers. 
              I used to have to call around or text everyone individually."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
              <div>
                <h4 className="font-semibold">Maria Rodriguez</h4>
                <p className="text-sm text-gray-600">Store Manager</p>
              </div>
            </div>
            <p className="text-gray-600">
              "As a manager, I love having all swap requests in one place. 
              It saves me time and helps me keep track of all schedule changes."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
              <div>
                <h4 className="font-semibold">David Chen</h4>
                <p className="text-sm text-gray-600">Customer Service</p>
              </div>
            </div>
            <p className="text-gray-600">
              "Having my schedule on my phone makes it easy to plan my week.
              The swap feature has been a lifesaver when emergencies come up."
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;