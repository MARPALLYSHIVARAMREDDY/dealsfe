export interface Blog {
  id: string;
  slug?: string;
  title: string;
  excerpt?: string;
  content?: string;
  author?: {
    name: string;
    avatar: string | null;
  };
  authorName?: string;
  authorAvatar?: string | null;
  category?: string;
  tags?: string[];
  hasTags?: boolean;
  coverImage?: string | null;
  image?: string | null;
  hasCoverImage?: boolean;
  publishedDate?: string;
  publishedAt?: Date;
  formattedDate?: string;
  timeAgo?: string;
  readTime?: string;
  likes?: number;
  views?: number;
  hasEngagement?: boolean;
  shareUrl?: string;
  blogUrl?: string;
  pageType?: string;
  metadata?: any;
}
