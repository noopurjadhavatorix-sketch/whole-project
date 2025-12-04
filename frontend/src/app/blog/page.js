"use client";

import BlogHero from "@/components/blog/BlogHero";
import BlogCategories from "@/components/blog/BlogCategories";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogGrid from "@/components/blog/BlogGrid";
import Newsletter from "@/components/blog/Newsletter";
import blogPosts from "@/components/blog/BlogPostsData";

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <BlogHero />

      {/* Categories Section */}
      <BlogCategories />

      {/* Featured Post */}
      <FeaturedPost post={blogPosts[0]} />

      {/* Blog Posts Grid */}
      <BlogGrid posts={blogPosts.slice(1)} />

      {/* Newsletter Section */}
      <Newsletter />
    </>
  );
}
