"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, PhoneCall, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { submitFormData, submitWeb3FormData } from "@/lib/api";

export default function CtaSection() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Animation for lightning/particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles = [];

    // Set canvas to full section size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      // Create initial particles
      createParticles();
    };

    // Particle creation
    const createParticles = () => {
      particles.length = 0;
      const particleCount = Math.floor(canvas.width * canvas.height / 15000);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          vx: Math.random() * 1 - 0.5,
          vy: Math.random() * 1 - 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    // Initialize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Validate form data
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

    // Phone validation (required field)
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+\d\s\-()]{7,20}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Company is optional

    // Message is optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null);
    }
    
    // Clear submission status if user starts typing after submission
    if (submitted) {
      setSubmitted(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus the first field with an error
      const firstErrorField = document.querySelector("[aria-invalid='true']");
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      // Prepare the data for submission
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company.trim() || 'Not provided',
        message: formData.message.trim() || 'No message provided',
        source: 'website-homepage',
        status: 'new',
        metadata: {
          formType: 'homepage-contact',
          submittedAt: new Date().toISOString()
        }
      };

      // 1. First, submit data to Web3Forms for immediate email notification
      const web3Result = await submitWeb3FormData({
        ...submissionData,
        subject: `New Contact from ${submissionData.name}`,
        from_name: submissionData.name,
        reply_to: submissionData.email
      });

      // 2. Submit to our backend API for database storage
      try {
        const backendResult = await submitFormData(submissionData);
        
        if (!backendResult.success) {
          console.warn('Backend submission warning:', backendResult.error);
          // Continue even if backend fails but web3forms succeeded
        }
      } catch (backendError) {
        console.error('Backend submission failed:', backendError);
        // Don't fail the whole submission if only backend fails but web3forms succeeded
      }

      // Consider the submission successful if at least web3forms worked
      if (web3Result.success) {
        setSubmitted(true);

        // Reset form data
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
        });

        // Scroll to top to show success message
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Reset submitted state after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        // If both Web3Forms and backend failed, show an error
        setApiError(web3Result.error || "Failed to submit form. Please try again or contact us directly.");
        
        // Log the error for debugging
        console.error('Form submission failed:', web3Result);
      }
    } catch (error) {
      // Handle unexpected error
      setApiError("An unexpected error occurred. Please try again later.");
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-blue-900 opacity-90 dark:opacity-80"></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Animated canvas for particles/lightning effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ pointerEvents: "none" }}
      />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Business with SAP?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Our team of SAP experts is ready to help you implement, optimize, or migrate
              your SAP systems for maximum efficiency and ROI.
            </p>

            {/* Benefits list */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-white mr-3 flex-shrink-0" />
                <p className="text-white/90">Customized SAP solutions tailored to your specific industry and business needs</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-white mr-3 flex-shrink-0" />
                <p className="text-white/90">Expert team with deep SAP knowledge and implementation experience</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-white mr-3 flex-shrink-0" />
                <p className="text-white/90">Comprehensive support and maintenance services to keep your systems running smoothly</p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-white text-blue-700 hover:bg-white/90 border-0"
              >
                <Link href="/contact">
                  Request a Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-blue-700 text-white hover:bg-white/10"
              >
                <Link href="/get-demo" className="flex text-white bg-blue-700 items-center hover:text-white">
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Get a Demo
                </Link>
              </Button>
            </div>
          </div>

          {/* Right column - Contact form */}
          <div className="bg-muted rounded-xl p-8 shadow-xl">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Get in Touch with Our Team
            </h3>

            {submitted ? (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-6 rounded-lg mb-6 flex items-start">
                <div className="rounded-full bg-green-100 dark:bg-green-800 p-1 mr-3 flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="font-medium">Thank you for your message!</p>
                  <p className="text-sm mt-1">
                    We have received your inquiry and will get back to you shortly.
                  </p>
                </div>
              </div>
            ) : null}

            {apiError && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg mb-6 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Error Submitting Form</p>
                  <p className="text-sm">{apiError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hidden honeypot field to prevent spam */}
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                style={{ display: 'none' }}
              />

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={errors.name ? "true" : "false"}
                  className={
                    "w-full px-4 py-2 rounded-md border " +
                    (errors.name ? "border-red-500 dark:border-red-400" : "border-input") +
                    " bg-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  }
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={errors.email ? "true" : "false"}
                  className={
                    "w-full px-4 py-2 rounded-md border " +
                    (errors.email ? "border-red-500 dark:border-red-400" : "border-input") +
                    " bg-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  }
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-invalid={errors.phone ? "true" : "false"}
                  className={
                    "w-full px-4 py-2 rounded-md border " +
                    (errors.phone ? "border-red-500 dark:border-red-400" : "border-input") +
                    " bg-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  }
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-input bg-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter your company name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-input bg-muted focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Tell us about your requirements"
                ></textarea>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Processing...
                  </div>
                ) : (
                  "Submit"
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By submitting this form, you agree to our{" "}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
