"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useTheme } from "@/components/ui/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

// Import services data
import servicesData from "@/data/services.json";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  // Services is handled separately with dropdown
  { name: "Industries", path: "/industries" },
  { name: "Blog", path: "/blog" },
  { name: "Career", path: "/career" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const sheetCloseRef = useRef(null);

  // State for hover dropdowns
  const [openCategory, setOpenCategory] = useState(null);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const timeoutRef = useRef(null);
  const subMenuTimeoutRef = useRef(null);

  // State for mobile menu accordions - now using a single string instead of an object
  // to ensure only one category can be open at a time
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    if (isSheetOpen && sheetCloseRef.current) {
      sheetCloseRef.current.click();
      setIsSheetOpen(false);
    }
  }, [pathname, isSheetOpen]);

  // Check if current path is a service path
  const isServicePath = pathname.includes("/services");

  // Check if current path is blog path
  const isBlogPath = pathname.includes("/blog");

  // Handle mouse events for the main dropdown
  const handleServicesMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
      setOpenCategory(null);
    }, 300);
  };

  // Handle mouse events for category submenus
  const handleCategoryMouseEnter = (categoryId) => {
    if (subMenuTimeoutRef.current) {
      clearTimeout(subMenuTimeoutRef.current);
      subMenuTimeoutRef.current = null;
    }
    setOpenCategory(categoryId);
  };

  const handleCategoryMouseLeave = () => {
    subMenuTimeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 300);
  };

  // Handle clicking the dropdown menu container to keep it open
  const handleDropdownClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (subMenuTimeoutRef.current) {
      clearTimeout(subMenuTimeoutRef.current);
      subMenuTimeoutRef.current = null;
    }
  };

  // Toggle category expansion in mobile menu - modified to handle only one open category
  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Function to handle sheet open/close
  const handleSheetOpenChange = (open) => {
    setIsSheetOpen(open);
  };

  // Function to close mobile menu for navigation
  const closeSheet = () => {
    if (sheetCloseRef.current) {
      sheetCloseRef.current.click();
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
      },
    },
  };

  // Skip rendering on server to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render on server to avoid hydration issues
  if (!isMounted) {
    return (
      <header
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40"
        suppressHydrationWarning
      />
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300 ${
        isScrolled ? "shadow-sm" : ""
      }`}
      suppressHydrationWarning
    >
      <div className="container-custom" suppressHydrationWarning>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2" suppressHydrationWarning>
            <Link
              href="/"
              className="flex items-center"
              suppressHydrationWarning
            >
              <Image
                src="/AtorixIT.png"
                alt="Atorix IT Logo"
                width={150}
                height={40}
                className={`object-contain ${theme === "dark" ? "bg-white rounded-lg p-1" : ""}`}
                priority
                suppressHydrationWarning
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" suppressHydrationWarning>
            {/* Home and About links */}
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.path
                    ? "text-primary font-semibold"
                    : "text-foreground/80"
                }`}
                suppressHydrationWarning
              >
                {link.name}
              </Link>
            ))}

            {/* Services Dropdown with Hover */}
            <div
              className="relative"
              ref={servicesRef}
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
              onClick={handleDropdownClick}
              suppressHydrationWarning
            >
              <button
                className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                  isServicePath
                    ? "text-primary font-semibold"
                    : "text-foreground/80"
                }`}
                suppressHydrationWarning
              >
                <Link href="/services">Services</Link>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {isServicesOpen && (
                <div className="absolute left-0 top-full pt-2 z-50" suppressHydrationWarning>
                  <div className="w-64 bg-popover rounded-md border shadow-md p-1.5" suppressHydrationWarning>
                    <div className="space-y-0.5 py-1" suppressHydrationWarning>
                      {servicesData.categories.map((category) => (
                        <div
                          key={category.id}
                          className="relative"
                          onMouseEnter={() =>
                            handleCategoryMouseEnter(category.id)
                          }
                          onMouseLeave={handleCategoryMouseLeave}
                          suppressHydrationWarning
                        >
                          <div className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer" suppressHydrationWarning>
                            <span>{category.name}</span>
                            <ChevronDown className="ml-auto h-4 w-4 -rotate-90" />
                          </div>

                          {openCategory === category.id && (
                            <div className="absolute top-0 left-full pl-1.5" suppressHydrationWarning>
                              <div className="w-64 bg-popover rounded-md border shadow-md p-1.5" suppressHydrationWarning>
                                <div className="space-y-0.5 py-1" suppressHydrationWarning>
                                  {category.services.map((service) => (
                                    <Link
                                      key={service.id}
                                      href={`/services/${category.id}/${service.id}`}
                                      className="block px-2 py-1.5 text-sm rounded-sm hover:bg-accent"
                                      suppressHydrationWarning
                                    >
                                      {service.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="border-t my-1" suppressHydrationWarning></div>

                    <Link
                      href="/services"
                      className="block px-2 py-1.5 text-sm rounded-sm hover:bg-accent font-medium text-primary"
                      suppressHydrationWarning
                    >
                      View All Services
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Industries, Blog and Contact links */}
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.path ||
                  (link.path === "/blog" && isBlogPath)
                    ? "text-primary font-semibold"
                    : "text-foreground/80"
                }`}
                suppressHydrationWarning
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4" suppressHydrationWarning>
            <ThemeToggle suppressHydrationWarning />

            {/* Contact/Demo Button - Hidden on mobile */}
            <motion.div variants={itemVariants} suppressHydrationWarning>
              <Button
                asChild
                className="gap-2 px-4 py-5 text-sm font-medium bg-gradient-hero shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden group btn-3d"
                suppressHydrationWarning
              >
                <Link href="/get-demo" suppressHydrationWarning>
                  {/* Glow effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-white/30 to-primary/0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000" suppressHydrationWarning></span>

                  <span className="relative z-10 flex items-center" suppressHydrationWarning>
                    Get Demo
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                      suppressHydrationWarning
                    ></motion.div>
                  </span>
                </Link>
              </Button>
            </motion.div>

            {/* Mobile Menu */}
            <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange} suppressHydrationWarning>
              <SheetTrigger asChild className="md:hidden" suppressHydrationWarning>
                <Button variant="ghost" size="icon" aria-label="Menu" suppressHydrationWarning>
                  <Menu className="h-5 w-5" suppressHydrationWarning />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] overflow-y-auto max-h-screen p-0"
                suppressHydrationWarning
              >
                <div className="flex flex-col h-full py-6 px-6" suppressHydrationWarning>
                  <div className="flex items-center justify-between mb-8" suppressHydrationWarning>
                    <div suppressHydrationWarning>
                      <Image
                        src="/AtorixIT.png"
                        alt="Atorix IT Logo"
                        width={180}
                        height={50}
                        className="object-contain"
                        priority
                        suppressHydrationWarning
                      />
                    </div>
                    <SheetClose ref={sheetCloseRef} className="hidden" suppressHydrationWarning />
                  </div>

                  <nav className="flex flex-col space-y-6 mb-auto" suppressHydrationWarning>
                    {/* Home and About links */}
                    {navLinks.slice(0, 2).map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={`text-base font-medium transition-colors hover:text-primary ${
                          pathname === link.path
                            ? "text-primary font-semibold"
                            : "text-foreground/80"
                        }`}
                        onClick={closeSheet}
                      >
                        {link.name}
                      </Link>
                    ))}

                    {/* Services Accordion for Mobile - Now only one category can be open at a time */}
                    <div className="space-y-2">
                      <div
                        className={`text-base font-medium ${isServicePath ? "text-primary font-semibold" : "text-foreground/80"}`}
                      >
                        <Link href="/services" onClick={closeSheet}>
                          Services
                        </Link>
                      </div>
                      <div className="pl-4 space-y-4 border-l border-border/50">
                        {servicesData.categories.map((category) => (
                          <div key={category.id} className="space-y-3">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => toggleCategory(category.id)}
                            >
                              <div className="text-sm font-medium text-foreground/80 hover:text-primary">
                                {category.name}
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 text-foreground/60 transition-transform ${
                                  expandedCategory === category.id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>

                            {expandedCategory === category.id && (
                              <div className="pl-3 space-y-2 mt-2">
                                {category.services.map((service) => (
                                  <Link
                                    key={service.id}
                                    href={`/services/${category.id}/${service.id}`}
                                    className="text-xs text-foreground/70 hover:text-primary block py-1"
                                    onClick={closeSheet}
                                  >
                                    {service.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Industries, Blog and Contact links */}
                    {navLinks.slice(2).map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={`text-base font-medium transition-colors hover:text-primary ${
                          pathname === link.path ||
                          (link.path === "/blog" && isBlogPath)
                            ? "text-primary font-semibold"
                            : "text-foreground/80"
                        }`}
                        onClick={closeSheet}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="pt-6 mt-6 border-t">
                    <Button asChild className="w-full">
                      <Link href="/get-demo" onClick={closeSheet}>
                        Get Demo
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
