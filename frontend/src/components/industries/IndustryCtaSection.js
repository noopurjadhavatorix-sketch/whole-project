"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AnimatedCTABackground from "./AnimatedCTABackground";

export default function IndustryCtaSection() {
  return (
    <section className="py-16 md:py-20 bg-primary text-white relative overflow-hidden">
      {/* Animated background effect */}
      <AnimatedCTABackground />

      <div className="container-custom relative z-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="md:col-span-8">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Let's Discuss Your Industry-Specific Needs
            </motion.h2>
            <motion.p
              className="text-lg text-white/90 mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Contact our team to learn how our SAP solutions can address the
              unique challenges in your industry and drive digital
              transformation.
            </motion.p>
          </div>
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 w-full md:w-auto shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
