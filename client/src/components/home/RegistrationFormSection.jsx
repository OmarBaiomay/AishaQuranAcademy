import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { User, Mail, Phone, UserCircle, BookOpen, Calendar, Send, Shield } from 'lucide-react';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [defaultCountry, setDefaultCountry] = useState('us');

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    userType: '',
    selectedCourse: null,
    startDate: null,
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  // Detect user's country based on IP (client-side)
  useEffect(() => {
    const detectCountry = async () => {
      // Method 1: Try ipapi.co (most accurate, 1000 requests/day free)
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code && !data.error) {
          setDefaultCountry(data.country_code.toLowerCase());
          console.log('✅ Country detected (ipapi.co):', data.country_code, '-', data.country_name);
          return;
        }
      } catch (error) {
        console.log('⚠️ ipapi.co failed:', error.message);
      }

      // Method 2: Try ipwhois.app (10,000 requests/month free)
      try {
        const response = await fetch('https://ipwho.is/');
        const data = await response.json();
        
        if (data.country_code && data.success) {
          setDefaultCountry(data.country_code.toLowerCase());
          console.log('✅ Country detected (ipwhois):', data.country_code, '-', data.country);
          return;
        }
      } catch (error) {
        console.log('⚠️ ipwhois.app failed:', error.message);
      }

      // Method 3: Try ipapi.com (45 requests/minute free)
      try {
        const response = await fetch('https://ipapi.com/ip_api.php?ip=');
        const data = await response.json();
        
        if (data.country_code) {
          setDefaultCountry(data.country_code.toLowerCase());
          console.log('✅ Country detected (ipapi.com):', data.country_code, '-', data.country_name);
          return;
        }
      } catch (error) {
        console.log('⚠️ ipapi.com failed:', error.message);
      }

      // Method 4: Try Cloudflare trace (most reliable, always works)
      try {
        const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
        const data = await response.text();
        const countryLine = data.split('\n').find(line => line.startsWith('loc='));
        
        if (countryLine) {
          const countryCode = countryLine.split('=')[1].toLowerCase();
          setDefaultCountry(countryCode);
          console.log('✅ Country detected (Cloudflare):', countryCode.toUpperCase());
          return;
        }
      } catch (error) {
        console.log('⚠️ Cloudflare trace failed:', error.message);
      }

      console.log('ℹ️ All detection methods failed, using default: US');
    };
    
    detectCountry();
  }, []);

  const kidCourses = [
    { value: 'first-steps-arabic', label: 'For Kids | First Steps To Arabic' },
    { value: 'learning-arabic', label: 'For Kids | Learning The Arabic Language' },
    { value: 'full-quran', label: 'For Kids | Full Quran Course' },
    { value: 'learn-tajweed', label: 'For Kids | Learn Tajweed' },
    { value: 'quran-memorization', label: 'For Kids | Quran Memorization' },
    { value: 'noor-albayan', label: 'For Kids | Noor Albayan' },
    { value: 'noorani-quaaida', label: 'For Kids | Noorani Quaaida' },
    { value: 'ijaza-hifz', label: 'For Kids | Ijaza Program - Hifz' },
    { value: 'ijaza-recitation', label: 'For Kids | Ijaza Program - Recitation' },
    { value: 'islamic-studies', label: 'For Kids | Islamic Studies' },
    { value: 'qasas-anbyia', label: 'For Kids | Qasas Al-Anbyia\'a' },
    { value: 'hadith-children', label: 'For Kids | Hadith For Children' }
  ];

  const adultCourses = [
    { value: 'arabic-adults', label: 'For Adults | Arabic For Adults' },
    { value: 'arabic-phonetics', label: 'For Adults | Arabic Phonetics' },
    { value: 'quranic-arabic', label: 'For Adults | Quranic Arabic' },
    { value: 'egyptian-dialect', label: 'For Adults | Egyptian Dialect' },
    { value: 'al-muqaddimah', label: 'For Adults | Al-Muqaddimah Al-Ujrumiyya' },
    { value: 'full-quran', label: 'For Adults | Full Quran Course' },
    { value: 'tajweed-adults', label: 'For Adults | Tajweed For Adults' },
    { value: 'quran-memorization', label: 'For Adults | Quran Memorization' },
    { value: 'ijazah-hifz', label: 'For Adults | Ijazah Program - Hifz' },
    { value: 'ijaza-recitation', label: 'For Adults | Ijaza Program - Recitation' },
    { value: 'qasas-anbyia', label: 'For Adults | Qasas Al-Anbyia\'a' },
    { value: 'alfiqh-almuyassar', label: 'For Adults | Alfiqh Almuyassar' },
    { value: 'al-arbaoun', label: 'For Adults | Al-arba\'oun Al-Nawawiya' }
  ];

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handleUserTypeChange = (value) => {
    setFormData(prev => ({ ...prev, userType: value, selectedCourse: null }));
    if (errors.userType) setErrors(prev => ({ ...prev, userType: '' }));
  };

  const handleCourseChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, selectedCourse: selectedOption }));
    if (errors.selectedCourse) setErrors(prev => ({ ...prev, selectedCourse: '' }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, startDate: date }));
    if (errors.startDate) setErrors(prev => ({ ...prev, startDate: '' }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.userType) newErrors.userType = 'Please select Adult or Kid';
    if (!formData.selectedCourse) newErrors.selectedCourse = 'Please select a course';
    if (!formData.startDate) newErrors.startDate = 'Please select a start date';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms & conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission using EmailJS
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitProgress(0);

    // Simulate progress stages
    const progressInterval = setInterval(() => {
      setSubmitProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const templateParams = {
      name: formData.firstName,
      email: formData.email,
      phone: formData.phone,
      userType: formData.userType,
      course: formData.selectedCourse.label,
      startDate: formData.startDate.toDateString(),
    };

    try {
      await emailjs.send(
        'service_la3bbrs',
        'template_v3h5xh4',
        templateParams,
        'bbsWu1uJFmest6EFW'
      );

      clearInterval(progressInterval);
      setSubmitProgress(100);

      // Show success message
      toast.success('Registration successful! Redirecting...', {
        duration: 2000,
        icon: '🎉',
      });

      // Wait a bit for user to see success state
      setTimeout(() => {
        navigate('/thanks-free-trial-reg');
      }, 1500);

    } catch (error) {
      clearInterval(progressInterval);
      setIsSubmitting(false);
      setSubmitProgress(0);
      console.error('EmailJS error:', error);
      toast.error('Failed to send registration. Please try again.', {
        duration: 4000,
      });
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: '8px',
      borderRadius: '12px',
      borderWidth: '2px',
      borderColor: state.isFocused ? '#9333ea' : (errors.selectedCourse ? '#ef4444' : '#e5e7eb'),
      boxShadow: state.isFocused ? '0 0 0 3px rgba(147, 51, 234, 0.1)' : 'none',
      backgroundColor: '#f9fafb',
      '&:hover': { borderColor: '#c084fc' },
      transition: 'all 0.3s ease',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#9333ea' : state.isFocused ? '#f3e8ff' : 'white',
      color: state.isSelected ? 'white' : '#18181b',
      padding: '12px',
      cursor: 'pointer',
      '&:hover': { backgroundColor: state.isSelected ? '#9333ea' : '#f3e8ff' },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    }),
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-zinc-700 overflow-hidden">
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-6">
          {/* Name Field */}
          <div className="group">
            <label htmlFor="firstName" className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
              <div className="w-5 h-5 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <User className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={`w-full px-5 py-4 border-2 rounded-xl bg-gray-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${errors.firstName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-zinc-700'} hover:border-purple-300 dark:hover:border-purple-700`}
            />
            {errors.firstName && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <span className="text-base">⚠</span> {errors.firstName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="group">
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
              <div className="w-5 h-5 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Mail className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className={`w-full px-5 py-4 border-2 rounded-xl bg-gray-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-zinc-700'} hover:border-purple-300 dark:hover:border-purple-700`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <span className="text-base">⚠</span> {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field with IP Detection */}
          <div className="group">
            <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
              <div className="w-5 h-5 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Phone className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              Phone <span className="text-red-500">*</span>
            </label>
            <PhoneInput
              country={defaultCountry}
              value={formData.phone}
              onChange={handlePhoneChange}
              containerClass="phone-input-container"
              inputClass="phone-input-field"
              buttonClass="phone-input-button"
              dropdownClass="phone-input-dropdown"
              preferredCountries={['us', 'gb', 'ca', 'au', 'eg', 'sa', 'ae']}
              enableSearch={true}
              searchPlaceholder="Search country..."
            />
            <style>{`
              .phone-input-container {
                width: 100%;
              }
              .phone-input-field {
                width: 100% !important;
                height: 56px !important;
                padding: 16px 20px 16px 60px !important;
                border: 2px solid ${errors.phone ? '#ef4444' : '#e5e7eb'} !important;
                border-radius: 12px !important;
                background-color: #f9fafb !important;
                color: #18181b !important;
                font-size: 16px !important;
                transition: all 0.3s ease !important;
              }
              .phone-input-field:hover {
                border-color: #c084fc !important;
              }
              .phone-input-field:focus {
                outline: none !important;
                border-color: #9333ea !important;
                box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1) !important;
              }
              .phone-input-button {
                border: 2px solid ${errors.phone ? '#ef4444' : '#e5e7eb'} !important;
                border-right: none !important;
                border-radius: 12px 0 0 12px !important;
                background-color: #f9fafb !important;
                padding: 0 12px !important;
                transition: all 0.3s ease !important;
              }
              .phone-input-button:hover {
                background-color: #f3f4f6 !important;
              }
              .phone-input-dropdown {
                border-radius: 12px !important;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1) !important;
                margin-top: 8px !important;
              }
              .dark .phone-input-field {
                background-color: #27272a !important;
                color: #fafafa !important;
                border-color: ${errors.phone ? '#ef4444' : '#3f3f46'} !important;
              }
              .dark .phone-input-button {
                background-color: #27272a !important;
                border-color: ${errors.phone ? '#ef4444' : '#3f3f46'} !important;
              }
            `}</style>
            {errors.phone && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <span className="text-base">⚠</span> {errors.phone}
              </p>
            )}
          </div>

          {/* User Type */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
              <div className="w-5 h-5 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <UserCircle className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              Student Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => handleUserTypeChange('Adult Courses')}
                className={`relative flex items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${formData.userType === 'Adult Courses' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-500/20' : 'border-gray-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md'}`}
              >
                <span className={`font-medium ${formData.userType === 'Adult Courses' ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                  Adult Courses
                </span>
                {formData.userType === 'Adult Courses' && (
                  <span className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">✓</span>
                  </span>
                )}
              </div>
              
              <div 
                onClick={() => handleUserTypeChange('Kid Courses')}
                className={`relative flex items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${formData.userType === 'Kid Courses' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-500/20' : 'border-gray-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md'}`}
              >
                <span className={`font-medium ${formData.userType === 'Kid Courses' ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                  Kid Courses
                </span>
                {formData.userType === 'Kid Courses' && (
                  <span className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">✓</span>
                  </span>
                )}
              </div>
            </div>
            {errors.userType && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <span className="text-base">⚠</span> {errors.userType}
              </p>
            )}
          </div>

          {/* Course Selection */}
          {formData.userType && (
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                <div className="w-5 h-5 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                </div>
                {formData.userType === 'Kid Courses' ? 'Kid Courses' : 'Adult Courses'} <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.selectedCourse}
                onChange={handleCourseChange}
                options={formData.userType === 'Kid Courses' ? kidCourses : adultCourses}
                placeholder="Select a course..."
                styles={customSelectStyles}
                className="react-select-container"
              />
              {errors.selectedCourse && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span className="text-base">⚠</span> {errors.selectedCourse}
                </p>
              )}
            </div>
          )}

          {/* Start Date */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
              <div className="w-5 h-5 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              Preferred Start Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={handleDateChange}
              placeholderText="When do you want to start your free trial?"
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
              className={`w-full px-5 py-4 border-2 rounded-xl bg-gray-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${errors.startDate ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-zinc-700'} hover:border-purple-300 dark:hover:border-purple-700`}
            />
            {errors.startDate && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <span className="text-base">⚠</span> {errors.startDate}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="group">
            <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 cursor-pointer" onClick={() => setFormData(prev => ({...prev, agreeToTerms: !prev.agreeToTerms}))}>
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 w-5 h-5 rounded-lg border-2 border-gray-300 dark:border-zinc-600 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer transition-all duration-300"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline font-medium">
                  terms & conditions
                </a>
                . By providing my phone number, I agree to receive text messages.
              </span>
            </div>
            {errors.agreeToTerms && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <span className="text-base">⚠</span> {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`group relative w-full overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 hover:from-purple-700 hover:via-purple-800 hover:to-purple-700 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2 shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/60 flex items-center justify-center gap-3 ${isSubmitting ? 'cursor-not-allowed opacity-90' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {/* Progress Bar Background */}
            {isSubmitting && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-300 ease-out"
                style={{ 
                  width: `${submitProgress}%`,
                  opacity: 0.3 
                }}
              />
            )}

            {/* Button Content */}
            <div className="relative flex items-center justify-center gap-3">
              {isSubmitting ? (
                <>
                  {submitProgress < 100 ? (
                    <>
                      {/* Loading Spinner */}
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-lg">Submitting... {submitProgress}%</span>
                    </>
                  ) : (
                    <>
                      {/* Success Checkmark */}
                      <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg">Success! Redirecting...</span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <span className="text-lg">Start Your Free Trial</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </div>
          </button>

          {/* Progress Indicator Text */}
          {isSubmitting && submitProgress < 100 && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                  Processing your registration...
                </span>
              </div>
            </div>
          )}

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
            <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Your information is secure and will never be shared
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;