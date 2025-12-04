"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AnimatedBlobBackground from "./AnimatedBlobBackground";

export default function AboutHeroSection() {
  return (
    <section className="py-16 md:py-24 bg-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <AnimatedBlobBackground />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                About Us
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                We're SAP Experts Dedicated to Your Success
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-8">
                Founded in 2010, Atorix IT Solutions has grown to become one of
                the leading SAP implementation and support providers. We help
                businesses transform their operations with customized SAP
                solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/contact">
                      Contact Us
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" asChild size="lg">
                    <Link href="/services">Explore Services</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/images/web-dev.svg"
                alt="Atorix IT Team Working"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
