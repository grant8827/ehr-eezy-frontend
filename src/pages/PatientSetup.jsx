import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { patientInvitationService } from '../services/patientInvitationService';
import { useAuth } from '../contexts/AuthContext';

const PatientSetup = () => {
  console.log('PatientSetup component loaded - Updated Version 2.0');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    password: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invitation, setInvitation] = useState(null);
  const [validatingInvitation, setValidatingInvitation] = useState(true);

  // Extract email and token from URL params and validate invitation
  useEffect(() => {
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    
    if (email && token) {
      validateInvitation(email, token);
    } else {
      toast.error('Invalid registration link. Please use the link from your invitation email.');
      navigate('/');
    }
  }, [searchParams]);

  const validateInvitation = async (email, token) => {
    try {
      setValidatingInvitation(true);
      const result = await patientInvitationService.checkInvitationStatus(email, token);
      
      if (result.valid && result.invitation) {
        setInvitation(result.invitation);
        toast.success(`Welcome ${result.invitation.firstName}! Please create your password to complete registration.`);
      } else {
        toast.error(result.message || 'Invalid or expired invitation');
        navigate('/');
      }
    } catch (error) {
      console.error('Error validating invitation:', error);
      toast.error('Error validating invitation. Please check your link.');
      navigate('/');
    } finally {
      setValidatingInvitation(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const email = searchParams.get('email');
      const token = searchParams.get('token');
      
      if (!email || !token || !invitation) {
        toast.error('Invalid registration link. Please use the link from your invitation email.');
        return;
      }

      // Complete patient registration using invitation data and password
      const registrationResult = await patientInvitationService.markAsRegistered(email, token, {
        first_name: invitation.firstName,
        last_name: invitation.lastName,
        phone: invitation.phone,
        date_of_birth: invitation.dateOfBirth,
        password: formData.password,
        password_confirmation: formData.password
      });
      
      // Check if backend returned auto-login token
      if (registrationResult.token && registrationResult.user) {
        // Auto-login using the token from registration
        localStorage.setItem('auth_token', registrationResult.token);
        localStorage.setItem('user', JSON.stringify(registrationResult.user));
        
        // Update auth context
        updateUser(registrationResult.user);
        
        toast.success('Welcome to EHReezy! Redirecting to your dashboard...');
        
        // Redirect to patient dashboard
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 1500);
      } else {
        // Fallback to manual login if no token provided
        toast.success('Account created successfully! Signing you in...');
        
        const loginResult = await login(email, formData.password);
        
        if (loginResult.success) {
          toast.success('Welcome to EHReezy! Redirecting to your dashboard...');
          
          // Redirect to patient dashboard
          setTimeout(() => {
            navigate('/app/dashboard');
          }, 1500);
        } else {
          toast.success('Registration completed! Please log in with your credentials.');
          navigate('/login');
        }
      }
      
    } catch (error) {
      console.error('Error creating account:', error);
      
      if (error.message.includes('already used') || error.message.includes('expired')) {
        toast.error('This invitation has already been used or has expired. Please contact your healthcare provider for a new invitation.');
      } else {
        toast.error(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (validatingInvitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Validating invitation...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
            <div className="text-center py-12">
              <p className="text-red-600">Invalid or expired invitation</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EHReezy</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Set Up Your Patient Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome {invitation.firstName}! Your email is confirmed. Create a password to complete your account setup.
        </p>
        <p className="mt-1 text-center text-xs text-gray-500">
          Your profile information will be available in your dashboard after setup.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Password Form */}
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  readOnly
                  value={invitation.email}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-50 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Create Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                required
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="acceptTerms" className="ml-3 block text-sm leading-6 text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account & Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-6 text-gray-900">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-blue-600 shadow-sm border border-blue-300 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSetup;