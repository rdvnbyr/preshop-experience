'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRegisterCustomer } from '@/hooks/useShopware';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    street: '',
    zipcode: '',
    city: '',
    agreeTerms: false,
  });

  const registerMutation = useRegisterCustomer();

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!formData.agreeTerms) {
      alert('Please accept the terms and conditions.');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.street,
          zipcode: formData.zipcode,
          city: formData.city,
          countryId: 'TR', // Turkey - would need to fetch from API
        },
      });
      // Redirect to login or account page
      window.location.href = '/shop/account/signin';
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/shop/account/signin" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Sign In
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ad
                </label>
                <div className="mt-1">
                  <InputField
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Your First Name"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Soyad
                </label>
                <div className="mt-1">
                  <InputField
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Your Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                E-posta adresi
              </label>
              <div className="mt-1">
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  <InputField
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <InputField
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Adres
              </label>
              <div className="mt-1">
                <InputField
                  id="street"
                  name="street"
                  type="text"
                  placeholder="Sokak, mahalle, no"
                  value={formData.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Posta Kodu
                </label>
                <div className="mt-1">
                  <InputField
                    id="zipcode"
                    name="zipcode"
                    type="text"
                    placeholder="34000"
                    value={formData.zipcode}
                    onChange={(e) => handleChange('zipcode', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                </label>
                <div className="mt-1">
                  <InputField
                    id="city"
                    name="city"
                    type="text"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                I agree to the{' '}
                <Link href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
              </Button>
            </div>

            {registerMutation.error && (
              <div className="text-red-600 dark:text-red-400 text-sm text-center">
                An error occurred while creating your account. Please check your information.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;