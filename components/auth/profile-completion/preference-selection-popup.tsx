"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/auth-store";
import { savePreferences } from "@/data/authentication/auth-server-action";
import { usePreferenceTimer } from "@/hooks/use-preference-timer";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tag, Store, Heart, Check, ChevronDown, ChevronUp } from "lucide-react";

type PreferenceType = "categories" | "stores" | "brands";

const PREFERENCE_CONFIG = {
  categories: {
    title: "Categories",
    icon: Tag,
    description: "Select your favorite shopping categories",
  },
  stores: {
    title: "Favorite Stores",
    icon: Store,
    description: "Choose stores you love to shop from",
  },
  brands: {
    title: "Favorite Brands",
    icon: Tag,
    description: "Pick your preferred brands",
  },
};

export function PreferenceSelectionPopup() {
  const { user } = useAppSelector((state) => state.newAuth);
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const { canShow, handleDismiss, handleSuccess } = usePreferenceTimer(user, pathname);

  // Redux catalogue data
  const catalogueCategories = useAppSelector((state) => state.catalogue.categories);
  const catalogueBrands = useAppSelector((state) => state.catalogue.brands);
  const catalogueStores = useAppSelector((state) => state.catalogue.stores);

  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Expanded sections state (all expanded by default)
  const [expandedSections, setExpandedSections] = useState<Record<PreferenceType, boolean>>({
    categories: true,
    stores: true,
    brands: true,
  });

  // Selection state for all three types
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync canShow with isOpen
  useEffect(() => {
    if (canShow && !isOpen) {
      setIsOpen(true);
    }
  }, [canShow, isOpen]);

  // Check if catalogue is loaded
  const isCatalogueLoaded =
    catalogueCategories.length > 0 ||
    catalogueStores.length > 0 ||
    catalogueBrands.length > 0;

  // Get catalogue data for a specific type
  const getCatalogueData = (type: PreferenceType) => {
    if (type === "categories") return catalogueCategories;
    if (type === "stores") return catalogueStores;
    return catalogueBrands;
  };

  // Toggle section expansion
  const toggleSection = (type: PreferenceType) => {
    setExpandedSections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Toggle item selection
  const toggleItem = (type: PreferenceType, itemId: string) => {
    if (type === "categories") {
      setSelectedCategories((prev) =>
        prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
      );
    } else if (type === "stores") {
      setSelectedStores((prev) =>
        prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
      );
    } else if (type === "brands") {
      setSelectedBrands((prev) =>
        prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
      );
    }
  };

  // Check if item is selected
  const isItemSelected = (type: PreferenceType, itemId: string): boolean => {
    if (type === "categories") return selectedCategories.includes(itemId);
    if (type === "stores") return selectedStores.includes(itemId);
    return selectedBrands.includes(itemId);
  };

  // Get count of selected items for a type
  const getSelectedCount = (type: PreferenceType): number => {
    if (type === "categories") return selectedCategories.length;
    if (type === "stores") return selectedStores.length;
    return selectedBrands.length;
  };

  // Handle saving all preferences
  const handleSaveAll = async () => {
    // Check if any preferences are selected
    const hasSelections =
      selectedCategories.length > 0 ||
      selectedStores.length > 0 ||
      selectedBrands.length > 0;

    if (!hasSelections) {
      // No selections - just dismiss and start 5-min cooldown
      handleDismiss();
      setIsOpen(false);
      toast.info("You can set your preferences later!");
      return;
    }

    // Has selections - call API
    setIsSaving(true);
    setError(null);

    try {
      const response = await savePreferences({
        categoryIds: selectedCategories,
        storeIds: selectedStores,
        brandIds: selectedBrands,
      });

      if (response.success && response.data) {
        dispatch(setUser(response.data));
        handleSuccess(); // Clear timers permanently
        setIsOpen(false);
        toast.success("Preferences saved successfully!");
      } else {
        throw new Error(response.error || "Failed to save preferences");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle dismissing the popup
  const onDismiss = () => {
    handleDismiss(); // Saves timestamp, starts 5-min cooldown
    setIsOpen(false);
  };

  // Render a preference section with tile-based selection
  const renderPreferenceSection = (type: PreferenceType) => {
    const config = PREFERENCE_CONFIG[type];
    const catalogueData = getCatalogueData(type);
    const isExpanded = expandedSections[type];
    const selectedCount = getSelectedCount(type);
    const Icon = config.icon;

    return (
      <div key={type} className="border border-border rounded-lg overflow-hidden">
        {/* Section Header */}
        <button
          onClick={() => toggleSection(type)}
          className="w-full px-4 py-3 flex items-center justify-between bg-secondary/50 hover:bg-secondary/70 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">{config.title}</span>
            {selectedCount > 0 && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {selectedCount}
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Section Content - Tiles */}
        {isExpanded && (
          <div className="p-4 bg-background">
            <p className="text-xs text-muted-foreground mb-3">{config.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
              {catalogueData.map((item: any) => {
                const isSelected = isItemSelected(type, item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(type, item.id)}
                    className={`
                      relative px-3 py-2.5 rounded-md text-xs font-medium
                      transition-all duration-200 cursor-pointer border
                      ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
                      }
                    `}
                  >
                    <span className="block truncate text-center">
                      {item.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-primary-foreground rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5 text-primary" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render the main content
  const renderContent = () => {
    if (!isCatalogueLoaded) {
      return (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Loading preferences...</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h3 className="text-xl font-semibold">Set Your Preferences</h3>
          </div>
         
        </div>

        {/* Scrollable sections */}
        <div className="max-h-[55vh] overflow-y-auto space-y-3 pr-2">
          {renderPreferenceSection("categories")}
          {renderPreferenceSection("stores")}
          {renderPreferenceSection("brands")}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={onDismiss}
            variant="outline"
            className="flex-1"
            disabled={isSaving}
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleSaveAll}
            disabled={isSaving || !isCatalogueLoaded}
            className="flex-1"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  // Mobile: Sheet from bottom
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onDismiss()}>
        <SheetContent side="bottom" className="h-[85vh] p-6">
          <SheetHeader className="sr-only">
            <SheetTitle>Set Your Preferences</SheetTitle>
            <SheetDescription>
              Choose your favorite categories, stores, and brands
            </SheetDescription>
          </SheetHeader>
          {renderContent()}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Centered Dialog
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader className="sr-only">
          <DialogTitle>Set Your Preferences</DialogTitle>
          <DialogDescription>
            Choose your favorite categories, stores, and brands
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
