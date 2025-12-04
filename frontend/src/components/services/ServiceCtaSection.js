"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ServiceCtaSection() {
  return (
    <section className="py-16 md:py-24 text-white relative overflow-hidden bg-blue-700">
      {/* Enhanced gradient background - explicitly setting z-index */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700 overflow-hidden">
        {/* CSS Grid pattern replacement instead of image */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Light beams with increased visibility */}
        <div className="absolute left-1/4 top-0 w-[100px] h-full bg-gradient-to-b from-white/30 via-white/10 to-transparent skew-x-12 opacity-70"></div>
        <div className="absolute left-2/3 top-0 w-[80px] h-full bg-gradient-to-b from-white/25 via-white/8 to-transparent -skew-x-12 opacity-60"></div>

        {/* Added pulsing glow elements */}
        <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] rounded-full bg-blue-500/20 blur-[80px] animate-pulse"></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-violet-500/20 blur-[100px] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Added floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => {
            const top = Math.floor(Math.random() * 100);
            const left = Math.floor(Math.random() * 100);
            const size = Math.floor(Math.random() * 4) + 2;
            const opacity = Math.random() * 0.7 + 0.2;

            return (
              <div
                key={i}
                className="absolute rounded-full bg-white blur-[1px]"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: opacity,
                  transform: "translateZ(0)",
                  animation: `floatParticle 15s infinite ease-in-out ${i * -1.5}s`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Content with higher z-index */}
      <div className="container-custom relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="md:col-span-8">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Ready to Transform Your Business with SAP?
            </motion.h2>
            <motion.p
              className="text-lg text-white/90 mb-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Contact our team today to discuss how our SAP services can help
              your organization achieve its goals.
            </motion.p>
          </div>
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255,255,255,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-700 hover:bg-white/90 w-full md:w-auto relative overflow-hidden group"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2"
                >
                  <span className="relative z-10">Contact Us</span>
                  <ArrowRight className="h-4 w-4 relative z-10" />
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Additional CSS for animations */}
      <style jsx>{`
        @keyframes floatParticle {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
        }
      `}</style>
    </section>
  );
}
