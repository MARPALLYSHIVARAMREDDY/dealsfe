import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface PreferenceDisplayCardProps {
  title: string;
  icon: React.ElementType;
  items: string[];
  addText?: string;
  onAdd?: () => void;
  onRemove: (item: string) => void;
  renderBadgeContent?: (item: string) => React.ReactNode;
}

/**
 * Reusable preference card component
 * Displays a section for categories, stores, or brands
 */
export const PreferenceDisplayCard: React.FC<PreferenceDisplayCardProps> = ({
  title,
  icon: Icon,
  items,
  addText,
  onAdd,
  onRemove,
  renderBadgeContent,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Header with title and Add button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {title}
          </h3>
          {items.length > 0 && onAdd && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary hover:text-foreground cursor-pointer"
              onClick={onAdd}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          )}
        </div>

        {/* Items display or empty state */}
        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((item) => (
              <div
                key={item}
                className="group relative px-4 py-3 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground"
              >
                <span className="block truncate text-center">
                  {renderBadgeContent ? renderBadgeContent(item) : item}
                </span>
                <button
                  onClick={() => onRemove(item)}
                  className={`absolute top-1 right-1 transition-opacity hover:bg-muted rounded-full p-0.5 ${
                    isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  aria-label={`Remove ${item}`}
                >
                  <X className="w-3 h-3 cursor-pointer" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          onAdd && (
            <button
              className="w-full p-4 border border-dashed border-border rounded-lg text-muted-foreground text-sm hover:border-primary hover:text-primary transition-colors"
              onClick={onAdd}
            >
              <Plus className="w-4 h-4 mx-auto mb-1 cursor-pointer" />
              {addText}
            </button>
          )
        )}
      </CardContent>
    </Card>
  );
};
