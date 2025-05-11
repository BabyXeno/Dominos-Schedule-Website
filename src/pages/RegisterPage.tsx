import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    storeId: 'store1', // Default store ID for demo
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.employeeId,
        formData.storeId
      );
      navigate('/dashboard');
    } catch (err: any) {
      setErrors({
        general: err.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock stores for demo
  const stores = [
    { value: 'store1', label: 'Domino\'s - Downtown' },
    { value: 'store2', label: 'Domino\'s - West Side' },
    { value: 'store3', label: 'Domino\'s - East End' },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-2 flex justify-center">
              <div className="bg-dominos-blue rounded-full p-3">
                <UserPlus size={24} className="text-white" />
              </div>
            </div>
            <CardTitle as="h2">Create your account</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Register with your Domino's employee information
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              
              <Input
                label="Email Address"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              
              <Input
                label="Password"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              
              <Input
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
              
              <Input
                label="Employee ID"
                type="text"
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                error={errors.employeeId}
                required
              />
              
              <Select
                label="Store Location"
                id="storeId"
                name="storeId"
                value={formData.storeId}
                onChange={handleChange}
                options={stores}
                required
              />
              
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-md text-sm mt-4">
                <p>
                  <strong>Note:</strong> In a real application, your registration 
                  would be verified against the store database or require manager approval.
                </p>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full"
              >
                Register
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="justify-center border-t">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-dominos-blue hover:text-dominos-darkblue"
              >
                Log in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;