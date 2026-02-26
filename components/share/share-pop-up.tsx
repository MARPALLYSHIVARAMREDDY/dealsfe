'use client'

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check, Facebook, Twitter, Mail, MessageCircle, Linkedin, Link2, Share2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  discount?: number;
  dealId?: string;
}

const SharePopup = ({ isOpen, onClose, title, url, discount, dealId = 'default' }: SharePopupProps) => {
  const [copied, setCopied] = useState(false);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const shareText = discount 
    ? `Check out this deal: ${title} - ${discount}% off!` 
    : `Check out this deal: ${title}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Deal link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy link.",
        variant: "destructive",
      });
    }
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2] hover:bg-[#1A94DA]',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366] hover:bg-[#22C55E]',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2] hover:bg-[#0958A8]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-muted-foreground hover:bg-foreground',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`,
    },
  ];

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return createPortal(
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] animate-fade-in"
        onClick={onClose}
      />
      
      {/* Popup - Smaller on mobile, centered */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[320px] md:max-w-md bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50 z-[9999] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-border">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Share2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>
        </div>

        {/* Social Icons */}
        <div className="p-4 md:p-6">
          <div className="flex justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            {shareLinks.map((social) => (
              <button
                key={social.name}
                onClick={() => handleShare(social.url)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${social.color} text-white flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg`}
                title={`Share on ${social.name}`}
              >
                <social.icon className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            ))}
          </div>

          {/* Copy Link Section */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium text-muted-foreground">Or copy link</label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-2 md:px-3 py-1.5 md:py-2 border border-border">
                <Link2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="bg-transparent text-xs md:text-sm text-foreground w-full outline-none truncate"
                />
              </div>
              <Button 
                onClick={handleCopyLink}
                variant="default"
                size="sm"
                className="shrink-0 text-xs md:text-sm px-2 md:px-3"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                    <span className="hidden md:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                    <span className="hidden md:inline">Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default SharePopup;
