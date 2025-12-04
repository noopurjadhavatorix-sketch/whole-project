import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BlogPostCard({ post, index }) {
  return (
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
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-300">
            {post.category}
          </div>
          <span className="text-xs text-muted-foreground">{post.readTime}</span>
        </div>
        <h3 className="text-xl font-bold mb-3">
          <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {post.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
              {post.author.charAt(0)}
            </div>
            <span className="text-sm">{post.author}</span>
          </div>
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>
      </div>
    </motion.div>
  );
}
