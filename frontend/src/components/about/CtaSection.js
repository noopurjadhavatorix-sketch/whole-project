"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  const canvasRef = useRef(null);

  // Wave animation effect for CTA section
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width, height;

    // Wave parameters
    const waves = [
      { y: 0.5, length: 0.5, amplitude: 0.1, speed: 0.045 },
      { y: 0.6, length: 0.3, amplitude: 0.05, speed: 0.047 },
      { y: 0.4, length: 0.6, amplitude: 0.06, speed: 0.043 },
    ];

    let time = 0;

    // Set canvas to full section size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };

    // Draw wave
    const drawWave = (wave) => {
      ctx.beginPath();

      const y = height * wave.y;
      const amplitude = height * wave.amplitude;
      const wavelength = width * wave.length;

      ctx.moveTo(0, y);

      for (let x = 0; x < width; x++) {
        const dx = x / wavelength;
        const offsetY =
          Math.sin(dx * 2 * Math.PI + time * wave.speed * 10) * amplitude;
        ctx.lineTo(x, y + offsetY);
      }

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(
        width / 2,
        y,
        width / 2,
        height
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.03)");
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw each wave
      waves.forEach(drawWave);

      // Increment time
      time += 0.01;

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    // Cleanup - store a reference to the canvas for cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated canvas for waves */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ pointerEvents: "none" }}
      />

      {/* Glowing dots with animated motion */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-white opacity-20 blur-sm"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-6 h-6 rounded-full bg-white opacity-15 blur-md"
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute top-2/3 right-1/4 w-5 h-5 rounded-full bg-white opacity-10 blur-sm"
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-3 h-3 rounded-full bg-white opacity-20 blur-sm"
        animate={{
          scale: [1, 1.7, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => {
          const size = Math.random() * 3 + 2;
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          const duration = Math.random() * 15 + 10;
          const delay = Math.random() * 5;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/40"
              style={{
                width: size,
                height: size,
                left: `${startX}%`,
                top: `${startY}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ready to Transform Your Business?
          </motion.h2>
          <motion.p
            className="text-xl text-white/80 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Contact us today to discuss how our SAP solutions can help your
            business grow.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-white/90"
            >
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
