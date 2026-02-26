'use client'
import { useMemo } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogCardUI from '@/components/card/blog-card-ui';
import type { Blog } from '@/types/blogs.types'

interface BlogSectionProps {
  blogs: Blog[];
  variant?: 'default' | 'sidebar';
}

interface SectionHeaderProps {
  isSidebar: boolean;
}

const SectionHeader = ({ isSidebar }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-4 ">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <BookOpen className="h-5 w-5 text-primary" />
      </div>
      <h2 className={`font-bold text-foreground ${isSidebar ? 'text-lg' : 'text-xl'}`}>
        Shopping Blogs
      </h2>
    </div>
    {isSidebar && (
      <Button variant="ghost" className="text-primary" size="default">
        More
        <ArrowRight className="h-4 w-4" />
      </Button>
    )}
  </div>
);

const BlogSection = ({ blogs, variant = 'default' }: BlogSectionProps) => {
  const isSidebar = variant === 'sidebar';

  const displayBlogs = useMemo(
    () => (isSidebar ? blogs.slice(0, 6) : blogs.slice(0, 4)),
    [blogs, isSidebar]
  );

  const containerClass = isSidebar ? '' : 'container mx-auto px-4';
  const sectionClass = isSidebar ? 'py-4' : 'py-4 bg-muted/50';
  const gridClass = isSidebar
    ? 'flex flex-col gap-3'
    : 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3';

  if (!blogs?.length) {
    return (
      <section className={sectionClass}>
        <div className={containerClass}>
          <SectionHeader isSidebar={isSidebar} />
          <div className="text-center py-8">
            <p className="text-muted-foreground">No blogs available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionClass}>
      <div className={containerClass}>
        <SectionHeader isSidebar={isSidebar} />

        <div className={gridClass}>
          {displayBlogs.map((blog, index) => (
            <BlogCardUI
              key={blog.id}
              blog={{
                id: blog.id,
                slug: blog.slug || blog.id,
                title: blog.title,
                image: blog.coverImage || blog.image || '/placeholder-blog.jpg',
                publishedAt: blog.publishedAt || (blog.publishedDate ? new Date(blog.publishedDate) : new Date())
              }}
              variant={isSidebar ? 'horizontal' : 'card'}
              animationDelay={index * 50}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
