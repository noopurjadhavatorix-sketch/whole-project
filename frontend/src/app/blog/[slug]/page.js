"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// Blog posts data - imported from the blog page
const blogPosts = [
  {
    id: "best-sap-implementation-partner-in-india",
    title: "BEST SAP IMPLEMENTATION PARTNER IN INDIA",
    description: "ATORIX IT SOLUTIONS - Best SAP Implementation Partner in India with expertise in SAP S/4HANA implementation and support services.",
    date: "May 24, 2023",
    author: "Atorix Team",
    authorRole: "SAP Implementation Expert",
    image: "/images/web-dev.svg",
    category: "SAP",
    readTime: "5 min read",
    content: `
      <p>ATORIX IT SOLUTIONS - Best SAP Implementation Partner in India with its head office in Pune. We provide robust, business process solutions for successful clients.</p>

      <p>Atorix IT Solutions is the Best SAP Implementation Partner in India with its head office in Pune. We provide robust, business process solutions for successful clients. From implementation to support, we ensure a seamless SAP experience tailored to your business needs.</p>

      <h3>Why Choose Atorix as Your SAP Implementation Partner?</h3>

      <ul>
        <li>Expertise in SAP S/4HANA Implementation</li>
        <li>Certified SAP Consultants</li>
        <li>Industry-Specific Solutions</li>
        <li>End-to-End Support</li>
        <li>Proven Implementation Methodology</li>
      </ul>

      <p>Partner with us for successful SAP implementations that drive digital transformation and business growth.</p>
    `
  },
  {
    id: "what-is-sap-solution-manager",
    title: "What is SAP Solution Manager?",
    description: "SAP Solution Manager (SolMan) is a module of SAP that provides functionalities like integrated content, methodologies, tools etc. Learn more about this essential SAP tool.",
    date: "February 28, 2023",
    author: "Atorix Team",
    authorRole: "SAP Technical Specialist",
    image: "/images/app.svg",
    category: "SAP",
    readTime: "7 min read",
    content: `
      <p>SAP Solution Manager (SolMan) is a module of SAP that provides functionalities like integrated content, methodologies, tools etc. To implement, operate, monitor and support an enterprise's SAP solution. SAP solution manager manages the SAP and Non-SAP solutions in the IT landscapes of an organization. It supports the underlying IT infrastructure and business processes.</p>

      <h3>Key Functions of SAP Solution Manager</h3>

      <p>SAP Solution Manager is central to your SAP landscape management, providing:</p>

      <ul>
        <li>Implementation and upgrade support</li>
        <li>Business process operations</li>
        <li>Application lifecycle management</li>
        <li>Change control management</li>
        <li>IT service management</li>
        <li>Monitoring and alerting functions</li>
        <li>Root cause analysis tools</li>
        <li>Testing support</li>
      </ul>

      <p>For organizations running SAP systems, Solution Manager is an essential tool for maintaining optimal system performance and ensuring smooth operations of their SAP landscape.</p>
    `
  },
  {
    id: "future-scope-of-sap",
    title: "Future Scope of SAP",
    description: "SAP is an idea that has revolutionized the recruitment scene in India. Explore the future opportunities and trends in SAP implementation and careers.",
    date: "February 7, 2023",
    author: "Atorix Team",
    authorRole: "SAP Strategic Consultant",
    image: "/images/consultation.svg",
    category: "SAP",
    readTime: "6 min read",
    content: `
      <p>SAP is an idea that has revolutionised the recruitment scene in India. Even though it is an extraordinarily new idea in the Indian context, the fact is that ERP software program applications are increasing through the minute right here and in this kind of state of affairs the want for SAP-licensed specialists is growing throughout horizontals and verticals.</p>

      <h3>Growing Demand for SAP Professionals</h3>

      <p>The demand for SAP experts continues to grow as more businesses adopt enterprise resource planning solutions. This growth is evident across various industries, creating numerous career opportunities for SAP specialists.</p>

      <h3>Future Trends in SAP</h3>

      <ul>
        <li>Increased adoption of SAP S/4HANA</li>
        <li>Cloud-based SAP implementations</li>
        <li>Integration with AI and machine learning</li>
        <li>Enhanced mobile capabilities</li>
        <li>IoT integration with SAP systems</li>
      </ul>

      <p>As businesses continue to digitally transform, the scope for SAP implementation and support services will continue to expand, making it a promising field for professionals and implementation partners alike.</p>
    `
  },
  {
    id: "sap-s4-hana-all-about-sap-s4-hana",
    title: "SAP S/4 HANA- All about SAP S/4 HANA",
    description: "S/4HANA is an acronym for SAP Business Suite 4 SAP HANA. Learn about this next-generation ERP system and its benefits for large enterprises.",
    date: "February 7, 2023",
    author: "Atorix Team",
    authorRole: "S/4HANA Expert",
    image: "/images/web.svg",
    category: "SAP",
    readTime: "8 min read",
    content: `
      <p>S/4HANA is an acronym for SAP Business Suite 4 SAP HANA. Similar to the shift from SAP R/2 to SAP R/3, it brings in the next significant wave of innovation for SAP clients. SAP S/4HANA is SAP's enterprise resource planning (ERP) system for large businesses. It is the successor to SAP R/3 and SAP ERP, and it is built on SAP HANA, the company's in-memory database.</p>

      <h3>Key Features of SAP S/4HANA</h3>

      <ul>
        <li>In-memory computing architecture for faster processing</li>
        <li>Simplified data model reducing database footprint</li>
        <li>Improved real-time analytics capabilities</li>
        <li>Modern user experience with SAP Fiori</li>
        <li>Enhanced planning and simulation features</li>
        <li>Embedded machine learning capabilities</li>
      </ul>

      <h3>Benefits of SAP S/4HANA</h3>

      <p>Businesses implementing S/4HANA can expect:</p>

      <ul>
        <li>Faster transaction processing and reporting</li>
        <li>Reduced total cost of ownership</li>
        <li>Improved decision-making with real-time insights</li>
        <li>Simplified IT landscape and operations</li>
        <li>Enhanced productivity through intuitive user interfaces</li>
        <li>Future-proofing business operations</li>
      </ul>

      <p>SAP S/4HANA represents the future of ERP systems, combining speed, simplicity, and innovative features to drive digital transformation.</p>
    `
  },
  {
    id: "data-migration-in-sap-s4-hana",
    title: "Data migration in SAP S/4 HANA - All about SAP HANA Migration Cockpit",
    description: "Data migration is a tool its mainly used in SAP for the system installations separately. Learn about the SAP HANA Migration Cockpit and best practices.",
    date: "February 7, 2023",
    author: "Atorix Team",
    authorRole: "Data Migration Specialist",
    image: "/images/hosting.svg",
    category: "SAP",
    readTime: "7 min read",
    content: `
      <p>Data migration is a tool its mainly used in SAP for the system installations separately. It is used to provide the data extraction and transformation, & load, In the same its gives quality data management and processing.</p>

      <h3>SAP HANA Migration Cockpit</h3>

      <p>The SAP S/4HANA Migration Cockpit is a tool designed to facilitate data migration to SAP S/4HANA. It provides a guided approach to data transfer from various source systems to SAP S/4HANA.</p>

      <h3>Key Features of the Migration Cockpit</h3>

      <ul>
        <li>Predefined migration content for common business objects</li>
        <li>Data extraction from various source systems</li>
        <li>Mapping capabilities for source and target fields</li>
        <li>Validation of migrated data</li>
        <li>Migration monitoring and error handling</li>
        <li>Support for multiple migration approaches</li>
      </ul>

      <h3>Migration Approaches</h3>

      <ol>
        <li><strong>File-Based Migration</strong>: Transfer data using CSV files</li>
        <li><strong>Direct Transfer</strong>: Connect directly to SAP source systems</li>
        <li><strong>Staging Tables</strong>: Use staging tables for complex transformations</li>
        <li><strong>SAP Cloud Platform Integration</strong>: Leverage cloud integration services</li>
      </ol>

      <p>Successful data migration is critical for any SAP S/4HANA implementation project. The Migration Cockpit simplifies this process, reducing risk and ensuring data quality in your new S/4HANA environment.</p>
    `
  }
];

// Animated blob background
function AnimatedBlobBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main blob */}
      <motion.div
        className="absolute rounded-full bg-primary/10 blur-[120px]"
        style={{
          width: "50%",
          height: "50%",
          top: "10%",
          left: "10%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary blob */}
      <motion.div
        className="absolute rounded-full bg-blue-500/10 blur-[100px]"
        style={{
          width: "35%",
          height: "35%",
          bottom: "20%",
          right: "5%",
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
}

// Related posts component
function RelatedPosts({ currentPostId }) {
  // Get three related posts (excluding the current one)
  const relatedPosts = blogPosts
    .filter(post => post.id !== currentPostId)
    .slice(0, 3);

  return (
    <div className="mt-16 border-t border-border/60 pt-12">
      <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card rounded-xl overflow-hidden border border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-300"
          >
            <Link href={`/blog/${post.id}`} className="block">
              <div className="aspect-[16/9] relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-300">
                  {post.category}
                </div>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 line-clamp-2">
                <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {post.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                    {post.author.charAt(0)}
                  </div>
                  <span className="text-xs">{post.author}</span>
                </div>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the post with the matching slug
    const currentPost = blogPosts.find(post => post.id === params.slug);

    if (currentPost) {
      setPost(currentPost);
    }

    setLoading(false);
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-custom py-24 text-center">
        <h1 className="text-3xl font-bold mb-6">Blog Post Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The blog post you are looking for does not exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <AnimatedBlobBackground />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              asChild
              className="mb-6 hover:bg-background/80 text-primary"
              size="sm"
            >
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-300 mb-4">
              {post.category}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-4xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span>{post.category}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Article Content */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Featured Image */}
                <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-10 border border-border/40 shadow-md">
                  <Image
                    src="/images/bg/services-bg.webp"
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Content */}
                <article className="prose prose-lg dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-10">
                  <span className="bg-muted px-3 py-1 rounded-full text-sm">SAP</span>
                  <span className="bg-muted px-3 py-1 rounded-full text-sm">S/4HANA</span>
                  <span className="bg-muted px-3 py-1 rounded-full text-sm">Implementation</span>
                  <span className="bg-muted px-3 py-1 rounded-full text-sm">Enterprise</span>
                </div>

                {/* Social Share */}
                <div className="flex items-center gap-4 mt-10 border-t border-border/60 pt-6">
                  <span className="text-sm font-medium">Share this article:</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9" asChild>
                      <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank">
                        <Facebook className="h-4 w-4" />
                        <span className="sr-only">Share on Facebook</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9" asChild>
                      <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`} target="_blank">
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Share on Twitter</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9" asChild>
                      <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank">
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">Share on LinkedIn</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="sticky top-24"
              >
                {/* Author Card */}
                <div className="bg-card rounded-xl p-6 border border-border/40 mb-8">
                  <h3 className="text-lg font-semibold mb-4">About the Author</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{post.author}</h4>
                      <p className="text-sm text-muted-foreground">{post.authorRole}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Atorix IT Solutions expert with extensive experience in SAP implementation, support, and business process optimization.
                  </p>
                </div>

                {/* Categories */}
                <div className="bg-card rounded-xl p-6 border border-border/40 mb-8">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/blog?category=sap"
                        className="text-sm text-muted-foreground hover:text-primary flex items-center justify-between group"
                      >
                        <span>SAP</span>
                        <span className="bg-muted px-2 py-0.5 rounded-full text-xs group-hover:bg-primary/20">
                          {blogPosts.filter(p => p.category === "SAP").length}
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/blog?category=implementation"
                        className="text-sm text-muted-foreground hover:text-primary flex items-center justify-between group"
                      >
                        <span>Implementation</span>
                        <span className="bg-muted px-2 py-0.5 rounded-full text-xs group-hover:bg-primary/20">
                          3
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/blog?category=migration"
                        className="text-sm text-muted-foreground hover:text-primary flex items-center justify-between group"
                      >
                        <span>Migration</span>
                        <span className="bg-muted px-2 py-0.5 rounded-full text-xs group-hover:bg-primary/20">
                          2
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/blog?category=s4hana"
                        className="text-sm text-muted-foreground hover:text-primary flex items-center justify-between group"
                      >
                        <span>S/4HANA</span>
                        <span className="bg-muted px-2 py-0.5 rounded-full text-xs group-hover:bg-primary/20">
                          2
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/blog?category=support"
                        className="text-sm text-muted-foreground hover:text-primary flex items-center justify-between group"
                      >
                        <span>Support</span>
                        <span className="bg-muted px-2 py-0.5 rounded-full text-xs group-hover:bg-primary/20">
                          1
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Popular Posts */}
                <div className="bg-card rounded-xl p-6 border border-border/40">
                  <h3 className="text-lg font-semibold mb-4">Popular Posts</h3>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((popularPost) => (
                      <div key={`popular-${popularPost.id}`} className="flex gap-3">
                        <div className="flex-shrink-0 h-16 w-16 relative rounded-md overflow-hidden">
                          <Image
                            src={popularPost.image}
                            alt={popularPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium line-clamp-2 hover:text-primary">
                            <Link href={`/blog/${popularPost.id}`}>
                              {popularPost.title}
                            </Link>
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">{popularPost.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Related Posts */}
          <RelatedPosts currentPostId={post.id} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5 relative overflow-hidden">
        <AnimatedBlobBackground />
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your SAP Experience?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact Atorix IT Solutions today to learn how our SAP experts can help optimize your business processes and maximize your SAP investment.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="gap-2">
                  <Link href="/contact">
                    Get in Touch
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
      </section>
    </>
  );
}
