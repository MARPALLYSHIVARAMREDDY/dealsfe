'use client'

import { useState } from 'react';
import { Apple, Play } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';


const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Subscribed!",
      description: "You'll receive the hottest deals in your inbox.",
    });
    setEmail('');
  };

  const storeGuides = [
    { label: 'Amazon Discount Codes', href: '/store/amazon' },
    { label: 'Walmart Sale Schedule', href: '/store/walmart' },
    { label: 'Target Weekly Deals', href: '/store/target' },
    { label: 'Best Buy Offers', href: '/store/best-buy' },
    { label: 'eBay Coupons', href: '/store/ebay' },
  ];

  const dealsFreebies = [
    { label: 'All Coupon Codes', href: '/coupons' },
    { label: 'Birthday Freebies', href: '/deals?type=freebies' },
    { label: 'College Student Discounts', href: '/deals?type=student' },
    { label: 'Senior Discounts', href: '/deals?type=senior' },
    { label: 'Teacher Discounts', href: '/deals?type=teacher' },
    { label: 'Military Discounts', href: '/deals?type=military' },
  ];

  const resources = [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Blog', href: '/blog' },
  ];

  const legal = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
  ];

  return (
    <footer>
    
      {/* Dark Footer Section */}
      <div className="text-background bg-[#0F1629]">
        {/* Logo and App Download Row */}
        <div className="w-full px-4 lg:px-14 py-8 border-b ">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 ">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/dealslogo.png" alt="DealsMocktail" className="h-10 w-auto  " />
            </Link>

            {/* App Download */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">Download the App</span>
              <a
                href="#"
                className="flex items-center gap-2 bg-background text-foreground px-4 py-2 rounded-lg hover:bg-background/90 transition-colors"
              >
                <Apple className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-[10px] leading-none">Download on the</p>
                  <p className="text-sm font-semibold leading-tight">App Store</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 bg-background text-foreground px-4 py-2 rounded-lg hover:bg-background/90 transition-colors"
              >
                <Play className="h-5 w-5 fill-current" />
                <div className="text-left">
                  <p className="text-[10px] leading-none">Get it On</p>
                  <p className="text-sm font-semibold leading-tight">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="mx-auto px-4 lg:px-14 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Store Guides */}
            <div>
              <h4 className="font-semibold text-background mb-4">Store Guides:</h4>
              <ul className="space-y-3">
                {storeGuides.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deals & Freebies */}
            <div>
              <h4 className="font-semibold text-background mb-4">Deals & Freebies:</h4>
              <ul className="space-y-3">
                {dealsFreebies.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-background mb-4">Resources:</h4>
              <ul className="space-y-3">
                {resources.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-background mb-4">Legal:</h4>
              <ul className="space-y-3">
                {legal.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="container mx-auto px-4 lg:px-14 py-6 border-t border-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            © 2024 DealsMocktail. A service of Mocktail LLC. All rights reserved.
            DealsMocktail participates in affiliate programs and may earn commissions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
