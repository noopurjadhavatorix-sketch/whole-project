"use client";

import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  Building,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { submitWeb3FormData, submitFormData } from "@/lib/api";

export default function PopupContactForm() {
  // Define countryCodes array with phone number length requirements
  const countryCodes = [
    { code: "+1", country: "USA", minLength: 10, maxLength: 10 },
    { code: "+91", country: "India", minLength: 10, maxLength: 10 },
    { code: "+44", country: "UK", minLength: 10, maxLength: 11 },
    { code: "+61", country: "Australia", minLength: 9, maxLength: 9 },
    { code: "+81", country: "Japan", minLength: 10, maxLength: 11 },
    { code: "+49", country: "Germany", minLength: 10, maxLength: 11 },
    { code: "+33", country: "France", minLength: 9, maxLength: 9 },
    { code: "+86", country: "China", minLength: 11, maxLength: 11 },
    { code: "+7", country: "Russia", minLength: 10, maxLength: 10 },
    { code: "+39", country: "Italy", minLength: 9, maxLength: 10 },
    { code: "+55", country: "Brazil", minLength: 10, maxLength: 11 },
    { code: "+34", country: "Spain", minLength: 9, maxLength: 9 },
    { code: "+27", country: "South Africa", minLength: 9, maxLength: 9 },
    { code: "+971", country: "UAE", minLength: 9, maxLength: 9 },
    { code: "+62", country: "Indonesia", minLength: 10, maxLength: 12 },
    { code: "+90", country: "Turkey", minLength: 10, maxLength: 10 },
    { code: "+82", country: "South Korea", minLength: 9, maxLength: 10 },
    { code: "+60", country: "Malaysia", minLength: 9, maxLength: 10 },
    { code: "+31", country: "Netherlands", minLength: 9, maxLength: 9 },
    { code: "+52", country: "Mexico", minLength: 10, maxLength: 10 },
  ];

  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const particlesRef = useRef(null);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91", // Default country code (IND)
    phone: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  // Get the selected country code details
  const getSelectedCountryDetails = () => {
    return (
      countryCodes.find((country) => country.code === formData.countryCode) ||
      countryCodes[0]
    );
  };

  useEffect(() => {
    // Only show once per visit
    if (
      typeof window !== "undefined" &&
      (window.sessionStorage.getItem("atorix_popup_closed") ||
        window.sessionStorage.getItem("atorix_popup_submitted"))
    ) {
      setOpen(false);
      return;
    }

    // Check if small screen (mobile or tablet)
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024); // Changed from 768px to 1024px to include tablets
    };

    // Initial check
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Delayed appearance for better UX
    const timer = setTimeout(() => setOpen(true), 15000); // 15 seconds delay

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Initialize particles when component mounts
  useEffect(() => {
    if (open && particlesRef.current) {
      initParticles();
    }
  }, [open, particlesRef.current]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (countryDropdownOpen) {
      function handleClickOutside(event) {
        if (!event.target.closest(".country-dropdown")) {
          setCountryDropdownOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [countryDropdownOpen]);

  const initParticles = () => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = 20; // Reduced count for simplicity

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1, // Smaller particles
        color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
        speedX: Math.random() * 0.5 - 0.25, // Slower movement
        speedY: Math.random() * 0.5 - 0.25,
      });
    }

    function animate() {
      if (!canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("atorix_popup_closed", "1");
      }
    }, 500); // Match this with animation duration
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation with country-specific rules
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      // Get selected country details for validation
      const countryDetails = getSelectedCountryDetails();
      const phoneDigits = formData.phone.replace(/\D/g, "");

      if (
        phoneDigits.length < countryDetails.minLength ||
        phoneDigits.length > countryDetails.maxLength
      ) {
        newErrors.phone = `For ${countryDetails.country}, phone must be ${
          countryDetails.minLength === countryDetails.maxLength
            ? `${countryDetails.minLength} digits`
            : `${countryDetails.minLength}-${countryDetails.maxLength} digits`
        }`;
      } else if (!/^\d+$/.test(phoneDigits)) {
        newErrors.phone = "Phone number can only contain digits";
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    // Clear API error when user makes any changes
    if (apiError) {
      setApiError(null);
    }
  };

  const handleCountryCodeSelect = (code) => {
    setFormData((prev) => ({ ...prev, countryCode: code }));
    setCountryDropdownOpen(false);

    // Clear phone error when country code changes
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      // Format the phone number with country code for submission
      const formattedFormData = {
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
        subject: `Contact Form Submission from ${formData.name}`,
      };

      // Submit to Web3Forms for email delivery
      const web3Result = await submitWeb3FormData(formattedFormData);

      // Submit to backend for lead storage
      let backendSuccess = false;
      try {
        const backendResult = await submitFormData(formattedFormData);
        backendSuccess = backendResult.success;
      } catch (backendError) {
        console.warn(
          "Backend submission failed, but email was sent via Web3Forms:",
          backendError
        );
      }

      if (web3Result.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          countryCode: "+1",
          phone: "",
          company: "",
          message: "",
        });
        // Store submission in session storage
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("atorix_popup_submitted", "1");
        }
        // Close popup after submission
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setApiError(web3Result.error);
      }
    } catch (error) {
      setApiError("An unexpected error occurred. Please try again later.");
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Form component for reusability
  const FormComponent = () => (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Name field */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="text-xs font-medium flex items-center gap-1.5"
        >
          <User size={12} className="opacity-70" />
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          onFocus={() => handleFocus("name")}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 text-sm rounded-md border ${
            errors.name
              ? "border-red-400"
              : "border-gray-200 dark:border-gray-700"
          } bg-white/80 dark:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="Enter your name"
        />
        {errors.name && (
          <p className="text-red-500 text-xs flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="text-xs font-medium flex items-center gap-1.5"
        >
          <Mail size={12} className="opacity-70" />
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={() => handleFocus("email")}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 text-sm rounded-md border ${
            errors.email
              ? "border-red-400"
              : "border-gray-200 dark:border-gray-700"
          } bg-white/80 dark:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Company field */}
      <div className="space-y-1">
        <label
          htmlFor="company"
          className="text-xs font-medium flex items-center gap-1.5"
        >
          <Building size={12} className="opacity-70" />
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          onFocus={() => handleFocus("company")}
          onBlur={handleBlur}
          className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Company name"
        />
      </div>

      {/* Phone field with country code */}
      <div className="space-y-1">
        <label
          htmlFor="phone"
          className="text-xs font-medium flex items-center gap-1.5"
        >
          <Phone size={12} className="opacity-70" />
          Phone <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2">
          {/* Country code dropdown */}
          <div className="relative country-dropdown">
            <button
              type="button"
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              className="flex items-center justify-between w-18 px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <span>{formData.countryCode}</span>
              <ChevronDown size={14} className="opacity-70" />
            </button>

            {/* Dropdown menu */}
            {countryDropdownOpen && (
              <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                {countryCodes.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountryCodeSelect(country.code)}
                    className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="mr-2">{country.code}</span>
                    <span className="text-gray-600 dark:text-gray-300 text-xs">
                      {country.country}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone number input */}
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            onFocus={() => handleFocus("phone")}
            onBlur={handleBlur}
            className={`flex-1 w-48 px-3 py-2 text-sm rounded-md border ${
              errors.phone
                ? "border-red-400"
                : "border-gray-200 dark:border-gray-700"
            } bg-white/80 dark:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder={`${getSelectedCountryDetails().minLength}-${getSelectedCountryDetails().maxLength} digits`}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.phone}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {`For ${getSelectedCountryDetails().country}: ${
            getSelectedCountryDetails().minLength ===
            getSelectedCountryDetails().maxLength
              ? `${getSelectedCountryDetails().minLength} digits`
              : `${getSelectedCountryDetails().minLength}-${getSelectedCountryDetails().maxLength} digits`
          }`}
        </p>
      </div>

      {/* Message field */}
      <div className="space-y-1">
        <label
          htmlFor="message"
          className="text-xs font-medium flex items-center gap-1.5"
        >
          <MessageSquare size={12} className="opacity-70" />
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows="3"
          value={formData.message}
          onChange={handleChange}
          onFocus={() => handleFocus("message")}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 text-sm rounded-md border ${
            errors.message
              ? "border-red-400"
              : "border-gray-200 dark:border-gray-700"
          } bg-white/80 dark:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none`}
          placeholder="How can we help you?"
        ></textarea>
        {errors.message && (
          <p className="text-red-500 text-xs flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.message}
          </p>
        )}
      </div>

      {/* API error feedback */}
      {apiError && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-2 rounded flex items-center gap-2 text-xs">
          <AlertCircle className="h-4 w-4" />
          {apiError}
        </div>
      )}

      {/* Submit button */}
      <motion.button
        type="submit"
        className="w-full py-2.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="h-3.5 w-3.5" />
          </>
        )}
      </motion.button>

      {/* Privacy note */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        By submitting, you agree to our privacy policy.
      </p>
    </form>
  );

  // Success message component
  const SuccessMessage = () => (
    <motion.div
      className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
        <div>
          <p className="font-medium">Thank you!</p>
          <p className="text-sm mt-1">We'll get back to you soon.</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`p-0 overflow-hidden border-none bg-transparent shadow-xl ${isSmallScreen ? "max-w-[85%] mx-auto" : "max-w-4xl"}`}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              className="relative w-full h-full rounded-xl overflow-hidden"
            >
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                onClick={handleClose}
                className="absolute top-2 right-2 z-50 bg-white/80 p-1.5 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                aria-label="Close popup"
              >
                <X size={16} className="text-gray-700" />
              </motion.button>

              {/* Background with particles */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900 overflow-hidden">
                <canvas
                  ref={particlesRef}
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Content container - desktop shows side-by-side, tablet and mobile show stacked */}
              <div className="relative z-10 w-full h-full flex flex-col lg:flex-row bg-white/90 dark:bg-gray-900/80 backdrop-blur-md shadow-lg rounded-xl overflow-hidden border border-white/20">
                {/* Left side (Image) - Only visible on larger desktop screens */}
                {!isSmallScreen && (
                  <div className="lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center">
                      <img
                        src="/images/services/SAP-Services.png"
                        alt="Atorix IT"
                        className="object-fill mx-auto mb-4"
                      />
                    </div>
                  </div>
                )}

                {/* Right side (Form) */}
                <div className={`${isSmallScreen ? "w-full" : "lg:w-1/2"}`}>
                  {/* Header section */}
                  <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 p-4 ">
                    <div className="flex items-center justify-start lg:justify-center gap-2">
                      <img
                        src="/AtorixIT-light.png"
                        className="w-24 h-10 bg-white rounded-lg"
                        alt="Atorix Logo"
                      />
                      <h2 className="text-xl font-bold text-white">
                        Get In Touch
                      </h2>
                    </div>
                    <p className="text-sm text-white/90 mt-1 text-center">
                      Our SAP specialists are ready to help
                    </p>
                  </div>

                  {/* Form section */}
                  <div className="p-4">
                    {submitted ? <SuccessMessage /> : <FormComponent />}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
