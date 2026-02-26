'use client'
import { Calendar, ThumbsUp, MessageCircle, Share2, Heart } from 'lucide-react';

interface BlogCardProps {
  blog: {
    id: string;
    slug: string;
    title: string;
    image: string;
    publishedAt: Date;
  };
  variant?: 'card' | 'horizontal';
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: (e: React.MouseEvent, blogId: string) => void;
  onSave?: (e: React.MouseEvent, blogId: string) => void;
  animationDelay?: number;
}

const BlogCardUI = ({
  blog,
  variant = 'card',
  isLiked = false,
  isSaved = false,
  onLike,
  onSave,
  animationDelay = 0
}: BlogCardProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const baseLikes = 50 + (blog.id.charCodeAt(0) * 3);
  const displayLikes = isLiked ? baseLikes + 1 : baseLikes;
  const comments = Math.floor(10 + (blog.id.charCodeAt(1) || 0) * 2);

  const isHorizontal = variant === 'horizontal';

  return (
    <div
      className="group animate-fade-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <article className={`bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 ${isHorizontal ? 'flex gap-3' : 'h-full'}`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${isHorizontal ? 'w-24 h-24 shrink-0 rounded-xl' : 'aspect-[4/3]'}`}>
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badge */}
          {!isHorizontal && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md">
              BLOG
            </div>
          )}
        </div>

        {/* Content */}
        <div className={isHorizontal ? 'flex-1 py-2 pr-3' : 'p-3'}>
          {/* Category + Date */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {!isHorizontal && <span className="text-xs font-semibold text-foreground">Shopping Tips</span>}
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(blog.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className={`font-semibold text-foreground transition-colors ${isHorizontal ? 'line-clamp-2 text-xs' : 'line-clamp-2 text-sm mb-2'}`}>
            {blog.title}
          </h3>

          {/* Social Stats */}
          {!isHorizontal && (
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <button
                  onClick={(e) => onLike && onLike(e, blog.id)}
                  className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-primary' : 'hover:text-primary'}`}
                >
                  <ThumbsUp className={`h-3 w-3 ${isLiked ? 'fill-primary' : ''}`} />
                  {displayLikes}
                </button>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {comments}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-6 h-6 rounded-full hover:bg-accent flex items-center justify-center">
                  <Share2 className="h-3 w-3 text-muted-foreground" />
                </span>
                <button
                  onClick={(e) => onSave && onSave(e, blog.id)}
                  className="w-6 h-6 rounded-full hover:bg-accent flex items-center justify-center"
                >
                  <Heart className={`h-3 w-3 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogCardUI;
