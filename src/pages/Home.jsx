import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HeartIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  LightBulbIcon,
  CloudIcon,
  LockClosedIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const features = [
    {
      name: 'Patient Management',
      description: 'Comprehensive patient records with medical history, allergies, medications, and treatment plans.',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Smart Scheduling',
      description: 'AI-powered scheduling with automated reminders, waitlist management, and conflict resolution.',
      icon: CalendarDaysIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Telehealth Platform',
      description: 'Integrated video consultations with secure messaging and remote patient monitoring.',
      icon: DevicePhoneMobileIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Analytics Dashboard',
      description: 'Real-time insights on practice performance, patient outcomes, and revenue metrics.',
      icon: ChartBarIcon,
      color: 'bg-orange-500',
    },
    {
      name: 'Secure & Compliant',
      description: 'HIPAA compliant infrastructure with end-to-end encryption and audit trails.',
      icon: ShieldCheckIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Integrated Billing',
      description: 'Automated billing, insurance verification, claims processing, and payment tracking.',
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
    },
  ];

  const stats = [
    { name: 'Healthcare Providers', value: '10K+', description: 'Trust EHReezy daily' },
    { name: 'Patient Records', value: '2.5M+', description: 'Securely managed' },
    { name: 'Appointments', value: '500K+', description: 'Scheduled monthly' },
    { name: 'Uptime', value: '99.9%', description: 'Guaranteed availability' },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Family Medicine Physician',
      clinic: 'Johnson Family Clinic',
      content: 'EHReezy has transformed our practice. The intuitive interface and comprehensive features have improved our efficiency by 40% while enhancing patient care quality.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Cardiologist',
      clinic: 'Heart Health Center',
      content: 'The telehealth integration is seamless. We can now provide remote consultations without compromising on care quality. Patient satisfaction has increased significantly.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Pediatrician',
      clinic: 'Children\'s Medical Group',
      content: 'The appointment scheduling system is brilliant. Parents love the automated reminders, and we\'ve reduced no-shows by 60%. It\'s made managing our busy practice so much easier.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1594824248441-6425c470cb9f?w=100&h=100&fit=crop&crop=face',
    },
  ];

  const benefits = [
    {
      title: 'Increase Efficiency',
      description: 'Streamline workflows and reduce administrative burden',
      percentage: '45%',
      metric: 'Time Saved',
    },
    {
      title: 'Improve Patient Care',
      description: 'Better care coordination and treatment outcomes',
      percentage: '35%',
      metric: 'Patient Satisfaction',
    },
    {
      title: 'Boost Revenue',
      description: 'Reduce missed appointments and billing errors',
      percentage: '25%',
      metric: 'Revenue Increase',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EHReezy
                </span>
              </Link>
            </div>
            
            {/* Center - Navigation Links */}
            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
              <a href="#features" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Testimonials
              </a>
              <Link to="/pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <a href="#about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                About
              </a>
            </nav>

            {/* Right side - Auth buttons */}
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <Link
                  to="/app"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Dashboard
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
              
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <ChevronDownIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <a href="#features" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Features
                </a>
                <a href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Testimonials
                </a>
                <Link to="/pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Pricing
                </Link>
                <a href="#about" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  About
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modern Hero Section */}
      <main>
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:max-w-none">
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                    <LightBulbIcon className="w-4 h-4 mr-2" />
                    Next-Generation Healthcare Technology
                  </span>
                </div>
                
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                  <span className="block">Transform Your</span>
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Healthcare Practice
                  </span>
                  <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl mt-2 text-gray-700">
                    with AI-Powered EHR
                  </span>
                </h1>

                <p className="mt-6 text-lg text-gray-600 sm:text-xl lg:text-lg xl:text-xl leading-relaxed">
                  Experience the future of healthcare management with EHReezy's intelligent platform. 
                  Streamline patient care, reduce administrative burden, and improve outcomes with our 
                  comprehensive suite of tools designed for modern healthcare providers.
                </p>

                <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-lg shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
                    >
                      Start Free Trial
                      <ArrowRightIcon className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-4">
                    <button className="w-full flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 md:text-lg md:px-10 transition-all duration-200">
                      <PlayCircleIcon className="mr-2 w-5 h-5" />
                      Watch Demo
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    Free 30-day trial
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    No setup fees
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    Cancel anytime
                  </div>
                </div>
              </div>

              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="relative mx-auto w-full rounded-lg shadow-xl lg:max-w-md">
                  <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">EHReezy Dashboard</h3>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <UserGroupIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Today's Patients</p>
                              <p className="text-xs text-gray-500">12 appointments</p>
                            </div>
                          </div>
                          <span className="text-2xl font-bold text-blue-600">24</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <CalendarDaysIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Next Appointment</p>
                              <p className="text-xs text-gray-500">Sarah Johnson - 2:30 PM</p>
                            </div>
                          </div>
                          <span className="text-sm text-green-600 font-medium">In 15 min</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <ChartBarIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Revenue This Month</p>
                              <p className="text-xs text-gray-500">+12% vs last month</p>
                            </div>
                          </div>
                          <span className="text-2xl font-bold text-purple-600">$24.5K</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Trusted by Healthcare Professionals Worldwide
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Join thousands of healthcare providers who have transformed their practice with EHReezy
              </p>
            </div>
            
            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.name} className="text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-4xl font-extrabold sm:text-5xl">
                      {stat.value}
                    </div>
                    <div className="mt-2 text-lg font-medium text-gray-900">{stat.name}</div>
                    <div className="text-sm text-gray-500">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Measurable Results for Your Practice
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                See the impact EHReezy can have on your healthcare practice
              </p>
            </div>
            
            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="relative bg-white rounded-xl shadow-sm p-8 hover:shadow-lg transition-shadow duration-300">
                    <div className="text-center">
                      <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {benefit.percentage}
                      </div>
                      <div className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {benefit.metric}
                      </div>
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                        <p className="mt-2 text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div id="features" className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage healthcare
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                EHReezy provides comprehensive tools for healthcare professionals to deliver 
                better patient care while maintaining efficiency and compliance.
              </p>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div 
                    key={feature.name} 
                    className="relative bg-white rounded-xl border border-gray-200 p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      Learn more
                      <ArrowRightIcon className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div id="testimonials" className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                What Healthcare Professionals Say
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Discover how EHReezy has transformed healthcare practices around the world
              </p>
            </div>

            <div className="mt-12">
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row items-center">
                  <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mr-8">
                    <img
                      className="w-20 h-20 rounded-full object-cover"
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg text-gray-700 italic mb-4">
                      "{testimonials[currentTestimonial].content}"
                    </blockquote>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].clinic}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial navigation */}
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-purple-800">
          <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to Transform Your Practice?</span>
              <span className="block text-blue-200 mt-2">Join 10,000+ Healthcare Professionals</span>
            </h2>
            <p className="mt-6 text-xl leading-8 text-blue-100">
              Experience the future of healthcare management with EHReezy's comprehensive solution.
              Start your free 30-day trial today - no credit card required.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-blue-700 transition-all duration-200">
                <PlayCircleIcon className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:justify-center sm:space-x-8 space-y-2 sm:space-y-0 text-sm text-blue-200">
              <div className="flex items-center justify-center">
                <LockClosedIcon className="w-4 h-4 mr-2" />
                HIPAA Compliant
              </div>
              <div className="flex items-center justify-center">
                <CloudIcon className="w-4 h-4 mr-2" />
                Cloud-Based
              </div>
              <div className="flex items-center justify-center">
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                Bank-Level Security
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer id="about" className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <HeartIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">EHReezy</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Transforming healthcare through intelligent technology and seamless user experiences.
              </p>
              <div className="flex items-center space-x-4 text-gray-400">
                <LockClosedIcon className="w-5 h-5" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0 text-sm text-gray-400">
                <p>&copy; 2025 EHReezy. All rights reserved.</p>
                <div className="flex space-x-6">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-white transition-colors">HIPAA BAA</a>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4 text-sm text-gray-400">
                <span>Built with security and compliance in mind</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;