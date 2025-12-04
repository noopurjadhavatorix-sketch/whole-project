import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlogCategories() {
  return (
    <section className="border-b border-border/60 py-6">
      <div className="container-custom">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="ghost" className="rounded-full bg-primary/10 text-primary" asChild>
            <Link href="/blog" className="font-medium">All Posts</Link>
          </Button>
          <Button variant="ghost" className="rounded-full" asChild>
            <Link href="/blog?category=implementation" className="text-muted-foreground hover:text-primary">Implementation</Link>
          </Button>
          <Button variant="ghost" className="rounded-full" asChild>
            <Link href="/blog?category=migration" className="text-muted-foreground hover:text-primary">Migration</Link>
          </Button>
          <Button variant="ghost" className="rounded-full" asChild>
            <Link href="/blog?category=support" className="text-muted-foreground hover:text-primary">Support</Link>
          </Button>
          <Button variant="ghost" className="rounded-full" asChild>
            <Link href="/blog?category=s4hana" className="text-muted-foreground hover:text-primary">S/4HANA</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
