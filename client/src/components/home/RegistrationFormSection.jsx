import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const RegistrationForm = () => {
  const navigate = useNavigate();

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

  const kidCourses = [
    { value: 'first-steps-arabic', label: 'For Kids | First Steps To Arabic' },
    { value: 'learning-arabic', label: 'For Kids | Learning The Arabic Language' },
    { value: 'full-quran', label: 'For Kids | Full Quran Course' },
    { value: 'learn-tajweed', label: 'For Kids | Learn Tajweed' },
    { value: 'quran-memorization', label: 'For Kids | Quran Memorization' },
    { value: 'noor-albayan', label: 'For Kids | Noor Albayan' },
    { value: 'noorani-quaaida', label: 'For Kids | Noorani Quaaida' },
    { value: 'ijaza-hifz', label: 'For Kids | Ijaza Program - Hifz' },
    { value: 'ijaza-recitation', label: 'For Kids | Ijaza Program - Recaitation' },
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
    { value: 'ijaza-recitation', label: 'For Adults | Ijaza Program - Recaitation' },
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
        'service_la3bbrs',    // Replace with your EmailJS service ID
        'template_v3h5xh4',   // Replace with your EmailJS template ID
        templateParams,
        'bbsWu1uJFmest6EFW'     // Replace with your EmailJS public key
      );

      toast.success('Form submitted successfully! Email sent.');

      // Reset form
      setFormData({
        firstName: '',
        email: '',
        phone: '',
        userType: '',
        selectedCourse: null,
        startDate: null,
        agreeToTerms: false
      });

      // Optional redirect
      // navigate('/thanks-free-trial-reg');

    } catch (error) {
      console.error('EmailJS error:', error);
      toast.error('Failed to send registration email.');
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#16a34a' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 1px #16a34a' : 'none',
      '&:hover': { borderColor: '#16a34a' },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#16a34a' : state.isFocused ? '#dcfce7' : 'white',
      color: state.isSelected ? 'white' : 'black',
      '&:hover': { backgroundColor: state.isSelected ? '#16a34a' : '#dcfce7' },
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Your Name"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <PhoneInput
              country={'eg'}
              value={formData.phone}
              onChange={handlePhoneChange}
              containerClass="w-full"
              inputClass={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              buttonClass="border-gray-300"
              preferredCountries={['us', 'gb', 'ca', 'au']}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Adult/Kid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adult or Kid <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="adult"
                  name="userType"
                  value="Adult Courses"
                  checked={formData.userType === 'Adult Courses'}
                  onChange={(e) => handleUserTypeChange(e.target.value)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="adult" className="ml-2 text-sm text-gray-700">Adult Courses</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="kid"
                  name="userType"
                  value="Kid Courses"
                  checked={formData.userType === 'Kid Courses'}
                  onChange={(e) => handleUserTypeChange(e.target.value)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="kid" className="ml-2 text-sm text-gray-700">Kid Courses</label>
              </div>
            </div>
            {errors.userType && <p className="mt-1 text-sm text-red-500">{errors.userType}</p>}
          </div>

          {/* Course */}
          {formData.userType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.userType === 'Kid Courses' ? 'Kid Courses' : 'Adult Courses'} <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.selectedCourse}
                onChange={handleCourseChange}
                options={formData.userType === 'Kid Courses' ? kidCourses : adultCourses}
                placeholder="Select a course"
                styles={customSelectStyles}
                className={errors.selectedCourse ? 'border-red-500 rounded-md' : ''}
              />
              {errors.selectedCourse && <p className="mt-1 text-sm text-red-500">{errors.selectedCourse}</p>}
            </div>
          )}

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Time <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={handleDateChange}
              placeholderText="When Do You Want To Start Your Free Trial?"
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
          </div>

          {/* Terms */}
          <div>
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className={`w-4 h-4 mt-1 text-green-600 focus:ring-green-500 rounded ${errors.agreeToTerms ? 'border-red-500' : 'border-gray-300'}`}
              />
              <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                I agree to{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                  terms & conditions
                </a>. By providing my phone number, I agree to receive text messages.
              </label>
            </div>
            {errors.agreeToTerms && <p className="mt-1 text-sm text-red-500">{errors.agreeToTerms}</p>}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
