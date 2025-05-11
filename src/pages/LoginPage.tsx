import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-2 flex justify-center">
              <div className="bg-dominos-blue rounded-full p-3">
                <LogIn size={24} className="text-white" />
              </div>
            </div>
            <CardTitle as="h2">Log in to your account</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Enter your Domino's employee credentials
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employee@dominos.com"
                required
              />
              
              <Input
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button 
                    type="button" 
                    className="text-dominos-blue hover:text-dominos-darkblue"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full"
              >
                Log in
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="justify-center border-t">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-dominos-blue hover:text-dominos-darkblue"
              >
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Demo accounts:<br />
            Employee: employee@dominos.com<br />
            Manager: manager@dominos.com<br />
            (Any password will work)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;