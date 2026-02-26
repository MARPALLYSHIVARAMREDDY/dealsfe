"use client";

import React, { useState } from "react";
import { Tag, Store } from "lucide-react";
import { PreferenceDisplayCard } from "./preference-display-card";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/auth-store";
import { updateProfile } from "@/data/authentication/auth-server-action";
import { extractPreferenceIds } from "@/lib/preference.utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PreferenceType = "categories" | "stores" | "brands";

const preferenceSections: {
  key: PreferenceType;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    key: "categories",
    label: "Categories",
    icon: Tag,
  },
  {
    key: "stores",
    label: "Favorite Stores",
    icon: Store,
  },
  {
    key: "brands",
    label: "Favorite Brands",
    icon: Tag,
  },
];

export function PreferenceManager() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.newAuth);
  
  // Redux catalogue data
  const catalogueCategories = useAppSelector(
    (state) => state.catalogue.categories
  );
  const catalogueBrands = useAppSelector((state) => state.catalogue.brands);
  const catalogueStores = useAppSelector((state) => state.catalogue.stores);

  // Handle safe catalogue arrays
  const safeCatalogueCategories = catalogueCategories || [];
  const safeCatalogueBrands = catalogueBrands || [];
  const safeCatalogueStores = catalogueStores || [];

  // Local UI state
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSectionKey, setActiveSectionKey] = useState<PreferenceType | null>(null);
  const [tempSelectedIds, setTempSelectedIds] = useState<Set<string>>(new Set());

  // Check if user is loaded
  if (!user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Loading user data...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if catalogue is loaded
  const isCatalogueLoaded =
    safeCatalogueCategories.length > 0 ||
    safeCatalogueStores.length > 0 ||
    safeCatalogueBrands.length > 0;

  if (!isCatalogueLoaded) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Loading preferences...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userCategoryIds = extractPreferenceIds(user?.preferences?.categories);
  const userStoreIds = extractPreferenceIds(user?.preferences?.stores);
  const userBrandIds = extractPreferenceIds(user?.preferences?.brands);

  const handleRemoveItem = async (type: PreferenceType, item: string) => {
    setLoading(true);
    try {
      // Build updated preferences with the item removed
      const updatedCategories = type === 'categories'
        ? userCategoryIds.filter(id => id !== item)
        : userCategoryIds;
      const updatedStores = type === 'stores'
        ? userStoreIds.filter(id => id !== item)
        : userStoreIds;
      const updatedBrands = type === 'brands'
        ? userBrandIds.filter(id => id !== item)
        : userBrandIds;

      const result = await updateProfile({
        categoryIds: updatedCategories,
        storeIds: updatedStores,
        brandIds: updatedBrands,
      });

      if (result.success && result.data) {
        dispatch(setUser(result.data));
      } else {
        throw new Error(result.error || "Failed to remove");
      }
    } catch {
      // Failed to remove item
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (key: PreferenceType) => {
    setActiveSectionKey(key);
    let currentIds: string[] = [];
    if (key === 'categories') currentIds = userCategoryIds;
    if (key === 'stores') currentIds = userStoreIds;
    if (key === 'brands') currentIds = userBrandIds;
    
    setTempSelectedIds(new Set(currentIds));
    setIsDialogOpen(true);
  };

  const handleToggleSelection = (id: string) => {
    const newSet = new Set(tempSelectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setTempSelectedIds(newSet);
  };

  const handleSaveDialog = async () => {
    if (!activeSectionKey) return;
    setLoading(true);
    setIsDialogOpen(false); 

    try {
       const newIds = Array.from(tempSelectedIds);
       
       const payload = {
         categoryIds: activeSectionKey === 'categories' ? newIds : userCategoryIds,
         storeIds: activeSectionKey === 'stores' ? newIds : userStoreIds,
         brandIds: activeSectionKey === 'brands' ? newIds : userBrandIds,
       };

       const result = await updateProfile(payload);
        if (result.success && result.data) {
          dispatch(setUser(result.data));
        } else {
          throw new Error(result.error || "Failed to update");
        }

    } catch {
      // Failed to update preferences
    } finally {
      setLoading(false);
      setActiveSectionKey(null);
    }
  };

  const getActiveCatalogueItems = () => {
    if (activeSectionKey === 'categories') return safeCatalogueCategories;
    if (activeSectionKey === 'stores') return safeCatalogueStores;
    if (activeSectionKey === 'brands') return safeCatalogueBrands;
    return [];
  };

  const activeCatalogueItems = getActiveCatalogueItems();

  // Filter user preferences to only show items that exist in catalogue
  const getFilteredUserItems = (
    userItems: string[],
    catalogueItems: { id: string }[]
  ): string[] => {
    const catalogueIds = new Set(catalogueItems.map(item => item.id));
    return userItems.filter(id => catalogueIds.has(id));
  };

  // Get display name for an item from catalogue
  const getItemDisplayName = (
    id: string,
    catalogueItems: { id: string; name: string }[],
    fallback: string = id
  ): string => {
    const item = catalogueItems.find(item => item.id === id);
    return item?.name || fallback;
  };

  // Map section keys to their corresponding state arrays (filtered by catalogue)
  const sectionItems: Record<PreferenceType, string[]> = {
    categories: getFilteredUserItems(userCategoryIds, safeCatalogueCategories),
    stores: getFilteredUserItems(userStoreIds, safeCatalogueStores),
    brands: getFilteredUserItems(userBrandIds, safeCatalogueBrands),
  };

  return (
    <div className="space-y-6">
      {preferenceSections.map((section) => (
        <PreferenceDisplayCard
          key={section.key}
          title={section.label}
          icon={section.icon}
          items={sectionItems[section.key]}
          onRemove={(item) => handleRemoveItem(section.key, item)}
          onAdd={() => handleOpenDialog(section.key)}
          renderBadgeContent={(id) => {
            const catalogueData =
              section.key === "categories" ? safeCatalogueCategories :
              section.key === "stores" ? safeCatalogueStores :
              safeCatalogueBrands;

            return getItemDisplayName(id, catalogueData);
          }}
        />
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] flex flex-col">
          <DialogHeader>
             <DialogTitle>Manage {preferenceSections.find(s => s.key === activeSectionKey)?.label}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto min-h-[200px] p-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeCatalogueItems.map((item) => {
                const isSelected = tempSelectedIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleSelection(item.id)}
                    className={cn(
                      "cursor-pointer rounded-md border p-4 text-center text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "bg-card text-card-foreground"
                    )}
                  >
                    {item.name}
                  </div>
                );
              })}
            </div>
             {activeCatalogueItems.length === 0 && (
                <p className="text-center text-muted-foreground mt-4">No items available.</p>
             )}
          </div>

          <DialogFooter>
             <Button onClick={handleSaveDialog} disabled={loading}>
               {loading ? "Saving..." : "Save"}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
