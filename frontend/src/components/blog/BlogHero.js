import { motion } from "framer-motion";
import AnimatedBlobBackground from "./AnimatedBlobBackground";

export default function BlogHero() {
  return (
    <section className="py-16 md:py-24 bg-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <AnimatedBlobBackground />
      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            SAP Insights
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Blog & Resources
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Expert insights, best practices, and industry trends to help you maximize your SAP investment and transform your business.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
