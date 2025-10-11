import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircleIcon,
  XMarkIcon,
  StarIcon,
  ArrowRightIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const pricingPlans = [
    {
      name: 'Starter',
      description: 'Perfect for small practices and solo practitioners',
      monthlyPrice: 99,
      yearlyPrice: 990, // 2 months free
      features: [
        'Up to 5 providers',
        '1,000 patient records',
        'Basic appointment scheduling',
        'Patient portal access',
        'Basic reporting',
        'Email support',
        'Mobile app access',
        'HIPAA compliant storage',
      ],
      limitations: [
        'No telehealth',
        'Limited integrations',
        'Basic analytics only',
      ],
      popular: false,
      color: 'blue',
    },
    {
      name: 'Professional',
      description: 'Most popular choice for growing practices',
      monthlyPrice: 199,
      yearlyPrice: 1990, // 2 months free
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
        'Automated reminders',
      ],
      limitations: [],
      popular: true,
      color: 'purple',
    },
    {
      name: 'Enterprise',
      description: 'For large organizations and health systems',
      monthlyPrice: null,
      yearlyPrice: null,
      customPricing: true,
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
        'Custom branding',
        'SSO integration',
        'Data migration assistance',
      ],
      limitations: [],
      popular: false,
      color: 'green',
    },
  ];

  const faqs = [
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All plans include a 30-day free trial with full access to features. No credit card required to start.',
    },
    {
      question: 'Can I change plans later?',
      answer: 'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we are HIPAA compliant with bank-level encryption. All data is stored securely in SOC 2 certified data centers.',
    },
    {
      question: 'Do you offer data migration?',
      answer: 'Yes, we provide free data migration assistance for Professional plans and above. Our team will help transfer your existing patient data.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, ACH transfers, and can accommodate purchase orders for Enterprise clients.',
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees for Starter and Professional plans. Enterprise plans include complimentary setup and training.',
    },
  ];

  const getPrice = (plan) => {
    if (plan.customPricing) return 'Custom';
    
    const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    return `$${price}`;
  };

  const getPeriod = () => {
    return billingPeriod === 'monthly' ? 'per month' : 'per year';
  };

  const getSavings = (plan) => {
    if (plan.customPricing || billingPeriod === 'monthly') return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.yearlyPrice;
    return savings;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EHReezy
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that fits your practice. All plans include a 30-day free trial.
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center">
            <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    billingPeriod === 'monthly'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    billingPeriod === 'yearly'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Yearly
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-sm border-2 p-8 ${
                plan.popular
                  ? 'border-purple-500 transform scale-105'
                  : 'border-gray-200 hover:border-blue-300'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-purple-600 text-white">
                    <StarIcon className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {getPrice(plan)}
                  </span>
                  {!plan.customPricing && (
                    <span className="text-base font-medium text-gray-500">
                      /{getPeriod()}
                    </span>
                  )}
                </div>

                {getSavings(plan) && (
                  <div className="mt-2 text-sm text-green-600 font-medium">
                    Save ${getSavings(plan)} per year
                  </div>
                )}
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircleIcon className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
                    <span className="ml-3 text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-start">
                    <XMarkIcon className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5" />
                    <span className="ml-3 text-sm text-gray-500">{limitation}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to={`/register?plan=${plan.name.toLowerCase()}`}
                  className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium transition-all duration-200 ${
                    plan.popular
                      ? 'text-white bg-purple-600 hover:bg-purple-700'
                      : plan.customPricing
                      ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                      : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  {plan.customPricing ? 'Contact Sales' : 'Start Free Trial'}
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Compare Features
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900">Starter</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900">Professional</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-sm text-gray-900">Providers</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">Up to 5</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">Up to 15</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-gray-900">Patient Records</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">1,000</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">10,000</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-gray-900">Telehealth</td>
                  <td className="py-4 px-6 text-center"><XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-gray-900">API Access</td>
                  <td className="py-4 px-6 text-center"><XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm text-gray-900">Support</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">Email</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">Email + Phone</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">24/7 Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheckIcon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">HIPAA Compliant</h3>
              <p className="text-gray-600">Bank-level security and encryption for all patient data</p>
            </div>
            <div className="flex flex-col items-center">
              <ClockIcon className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">99.9% Uptime</h3>
              <p className="text-gray-600">Reliable service with guaranteed availability</p>
            </div>
            <div className="flex flex-col items-center">
              <PhoneIcon className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600">Dedicated support team with healthcare expertise</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <div className="flex items-start">
                  <QuestionMarkCircleIcon className="flex-shrink-0 w-6 h-6 text-blue-600 mt-1" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Transform Your Practice?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of healthcare professionals who trust EHReezy
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              Start Your Free Trial
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-200">
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;