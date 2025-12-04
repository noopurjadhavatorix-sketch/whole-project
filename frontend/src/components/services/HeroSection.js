"use client";

import { motion } from "framer-motion";
import EnhancedBackground from "./EnhancedBackground";

export default function HeroSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <EnhancedBackground />

      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Our Services
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            OUR SERVICES
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            From implementation to support, our range of services covers all
            aspects of SAP to help you achieve your digital transformation
            goals.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
