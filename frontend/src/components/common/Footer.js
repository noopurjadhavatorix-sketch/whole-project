"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="py-16 border-t">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-block mb-6 logo-container relative"
            >
              <Image
                src="/AtorixIT.png"
                alt="Atorix IT Logo"
                width={180}
                height={50}
                className={`object-contain ${theme === "dark" ? "bg-white rounded-lg" : "bg-transparent"}`}
              />
            </Link>
            <p className="text-muted-foreground mb-6">
              Atorix IT Solutions is the Best SAP S4 HANA Implementation Partner
              in India with its head office in Pune. We provide robust, business
              process solutions for successful clients.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://instagram.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/industries"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  Industries
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/career"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  Career
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services/sap-application/implementation-rollout"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  SAP S/4 Implementation
                </Link>
              </li>
              <li>
                <Link
                  href="/services/sap-application/sap-ecc-s4-hana-support"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  SAP S/4 Support
                </Link>
              </li>
              <li>
                <Link
                  href="/services/sap-application/sap-integration"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  SAP S/4 Integration
                </Link>
              </li>
              <li>
                <Link
                  href="/services/sap-application/upgrade-services"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  SAP S/4 Upgrade
                </Link>
              </li>
              <li>
                <Link
                  href="/services/sap-application/sap-s4-hana-migration"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  SAP S/4 Migration
                </Link>
              </li>
              <li>
                <Link
                  href="/services/sap-application/sap-business-one-implementation"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  SAP Business One Implementation
                </Link>
              </li>
              <li>
                <Link
                  href="/services/data-science"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  Data Science
                </Link>
              </li>
              <li>
                <Link
                  href="/services/data-science/machine-learning"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  Machine Learning
                </Link>
              </li>
              <li>
                <Link
                  href="/services/data-science/data-analytics"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  Data Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-muted-foreground">
                  3rd Floor, Office No. C 305 DP Road, Police, Wireless Colony,
                  Pune, Maharashtra.
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+918956001555"
                  className="text-muted-foreground hover:underline"
                >
                  +91 89560 01555
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@atorix.in"
                  className="text-muted-foreground hover:underline"
                >
                  info@atorix.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Atorix IT Solutions. All rights
            reserved.
          </p>
          <div className="flex mt-4 sm:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground mx-2">|</span>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-muted-foreground mx-2">|</span>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
