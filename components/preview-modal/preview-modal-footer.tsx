"use client";

import { ExternalLink, Eye, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewModalFooterProps {
  couponCode?: string;
  affiliateUrl?: string;
  onGrabDeal: () => void;
  onViewDetails: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export function PreviewModalFooter({
  couponCode,
  affiliateUrl,
  onGrabDeal,
  onViewDetails,
  onSave,
  onShare
}: PreviewModalFooterProps) {
  return (
    <div className="sticky bottom-0 bg-card border-t border-border p-3 space-y-2">
      <div className="flex gap-2">
        <Button variant="deal" className="flex-1 h-9 text-xs cursor-pointer" onClick={onGrabDeal}>
          Grab Deal <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
        <Button variant="outline" className="flex-1 h-9 text-xs cursor-pointer hover:bg-primary hover:text-white" onClick={onViewDetails}>
          <Eye className="h-3 w-3 mr-1" /> View Details
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 h-8 text-xs cursor-pointer hover:bg-primary hover:text-white" onClick={onSave}>
          <Heart className="h-3 w-3 mr-1" />
          Save
        </Button>
        <Button variant="outline" className="flex-1 h-8 text-xs cursor-pointer hover:bg-primary hover:text-white  " onClick={onShare}>
          <Share2 className="h-3 w-3 mr-1" /> Share
        </Button>
      </div>
    </div>
  );
}
