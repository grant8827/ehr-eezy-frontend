import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState({
    // Business Information
    business_name: '',
    business_type: '',
    business_email: '',
    business_phone: '',
    business_address: '',
    business_website: '',
    license_number: '',
    
    // Owner/Administrator Information  
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    
    // Subscription
    subscription_plan: 'premium'
  });
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const showStep = (step) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlanSelect = (plan) => {
    setFormData({
      ...formData,
      subscription_plan: plan
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.business_name || !formData.business_type || !formData.business_email || 
        !formData.first_name || !formData.last_name || !formData.email || 
        !formData.password || !formData.password_confirmation) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        toast.success('Business registration successful! Welcome to EHReezy!');
        navigate('/app');
      } else {
        // Handle detailed error messages
        if (typeof result.error === 'object' && result.error !== null) {
          const errorMessages = Object.values(result.error).flat().join(', ');
          toast.error(`Validation errors: ${errorMessages}`);
        } else {
          toast.error(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 py-12 px-4">
      <div className="max-w-4xl w-full space-y-8 p-8 bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex justify-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">EHReezy</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Register Your Healthcare Business</h2>
          <p className="text-sm text-gray-600">Join thousands of healthcare providers managing their practice with EHReezy</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>1</div>
            <span className="ml-2 text-sm font-medium text-gray-700">Business Info</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 rounded"></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>2</div>
            <span className="ml-2 text-sm font-medium text-gray-700">Owner Details</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 rounded"></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
              currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>3</div>
            <span className="ml-2 text-sm font-medium text-gray-700">Subscription</span>
          </div>
        </div>

        {/* Multi-step Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: Business Information */}
          {currentStep === 1 && (
            <div className="step-content">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm8-1a1 1 0 10-2 0 1 1 0 002 0zm-2 3a1 1 0 10-2 0 1 1 0 002 0z"/>
                </svg>
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                  <input 
                    name="business_name" 
                    type="text" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Your Healthcare Practice"
                    value={formData.business_name}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                  <select 
                    name="business_type" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={formData.business_type}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    <option value="healthcare">General Healthcare</option>
                    <option value="clinic">Medical Clinic</option>
                    <option value="hospital">Hospital</option>
                    <option value="therapy_center">Therapy Center</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Email *</label>
                  <input 
                    name="business_email" 
                    type="email" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="contact@yourbusiness.com"
                    value={formData.business_email}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone</label>
                  <input 
                    name="business_phone" 
                    type="tel" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="+1 (555) 123-4567"
                    value={formData.business_phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                  <textarea 
                    name="business_address" 
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="123 Healthcare Ave, Medical District, City, State, ZIP"
                    value={formData.business_address}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input 
                    name="business_website" 
                    type="url" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://yourbusiness.com"
                    value={formData.business_website}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                  <input 
                    name="license_number" 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Medical License #"
                    value={formData.license_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Owner Details */}
          {currentStep === 2 && (
            <div className="step-content">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                </svg>
                Administrator Account
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input 
                    name="first_name" 
                    type="text" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input 
                    name="last_name" 
                    type="text" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email *</label>
                  <input 
                    name="email" 
                    type="email" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="admin@yourbusiness.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    name="phone" 
                    type="tel" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="+1 (555) 987-6543"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input 
                    name="date_of_birth" 
                    type="date" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select 
                    name="gender" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input 
                    name="password" 
                    type="password" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <input 
                    name="password_confirmation" 
                    type="password" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Confirm your password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Subscription Plan */}
          {currentStep === 3 && (
            <div className="step-content">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm8-1a1 1 0 10-2 0 1 1 0 002 0zm-2 3a1 1 0 10-2 0 1 1 0 002 0z"/>
                </svg>
                Choose Your Plan
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                  { 
                    id: 'starter', 
                    name: 'Starter', 
                    price: 99, 
                    description: 'Perfect for small practices',
                    features: [
                      'Up to 5 providers',
                      '1,000 patient records',
                      'Basic appointment scheduling',
                      'Patient portal access',
                      'Basic reporting',
                      'Email support',
                      'Mobile app access',
                      'HIPAA compliant storage'
                    ] 
                  },
                  { 
                    id: 'professional', 
                    name: 'Professional', 
                    price: 199, 
                    description: 'Most popular choice for growing practices',
                    features: [
                      'Up to 15 providers',
                      '10,000 patient records',
                      'Advanced scheduling & calendar sync',
                      'Telehealth consultations',
                      'Patient portal with messaging',
                      'Advanced reporting & analytics',
                      'Insurance verification',
                      'Billing integration',
                      'Priority email & phone support',
                      'API access',
                      'Custom forms & templates',
                      'Automated reminders'
                    ], 
                    popular: true 
                  },
                  { 
                    id: 'enterprise', 
                    name: 'Enterprise', 
                    price: 'Custom', 
                    description: 'For large organizations and health systems',
                    features: [
                      'Unlimited providers',
                      'Unlimited patient records',
                      'Multi-location support',
                      'Advanced telehealth platform',
                      'Custom integrations (HL7, FHIR)',
                      'Advanced security & compliance',
                      'Dedicated account manager',
                      '24/7 phone support',
                      'Custom workflows',
                      'Advanced analytics & reporting',
                      'Training & onboarding',
                      'Custom branding'
                    ] 
                  }
                ].map(plan => (
                  <div 
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`relative border-2 rounded-xl p-6 cursor-pointer transition ${
                      formData.subscription_plan === plan.id 
                        ? 'border-blue-500 bg-blue-50 shadow-lg' 
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    } ${plan.popular ? 'border-purple-500 bg-purple-50 transform scale-105' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    <div className="text-center mb-4">
                      <h4 className="font-semibold text-lg text-gray-900 mb-1">{plan.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900">
                          {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                        </span>
                        {typeof plan.price === 'number' && (
                          <span className="text-sm text-gray-500">/month</span>
                        )}
                      </div>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-2 mb-4">
                      {plan.features.slice(0, 6).map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 6 && (
                        <li className="text-xs text-gray-500 italic">
                          +{plan.features.length - 6} more features...
                        </li>
                      )}
                    </ul>
                    {plan.id === 'enterprise' && (
                      <div className="text-center">
                        <button
                          type="button"
                          className="text-blue-600 text-sm font-medium hover:text-blue-700"
                        >
                          Contact Sales for Pricing
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Terms and Conditions */}
              <div className="mt-6 flex items-start">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link> 
                  {' '}and <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button 
              type="button" 
              onClick={prevStep}
              className={`px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition ${
                currentStep === 1 ? 'invisible' : ''
              }`}
            >
              Previous
            </button>
            
            <div className="flex space-x-4">
              {currentStep < totalSteps ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Next Step
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={loading || !termsAccepted}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Business...
                    </div>
                  ) : (
                    'Register Your Business'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already have an account? 
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium ml-1">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;