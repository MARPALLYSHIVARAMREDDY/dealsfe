"use client";
import { useState } from "react";
import {
  Search,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  popularStores,
  allStores,
  popularCategories,
  allCategories,
} from "./config";
import { groupByLetter } from "@/lib/utils";

type Store = { name: string; count: number };
type Category = { name: string; id: string; count: number };

const groupedStores = groupByLetter<Store>(allStores);
const groupedCategories = groupByLetter<Category>(allCategories);


export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<"stores" | "categories">("stores");
  const [query, setQuery] = useState("");
  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center gap-3 p-4">
            <span className="text-muted-foreground cursor-pointer">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </span>
            <h1 className="text-lg font-semibold text-foreground flex-1 text-center pr-5">
              Search
            </h1>
          </div>
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, brands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 h-11 bg-muted border-0 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Toggle Tabs */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "stores"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("stores")}
            >
              Stores
            </button>
            <button
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "categories"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("categories")}
            >
              Categories
            </button>
          </div>

          {activeTab === "stores" ? (
            <>
              {/* Popular Stores Grid */}
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-3">
                  Popular Stores
                </h2>
                <div className="grid grid-cols-4 gap-3">
                  {popularStores.map((store) => (
                    <div
                      key={store.name}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${store.color}20` }}
                      >
                        {store.logo}
                      </div>
                      <span className="text-xs font-medium text-foreground text-center truncate w-full">
                        {store.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Stores */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground">
                    All Stores
                  </h2>
                  <button className="text-xs text-primary font-medium">
                    A-Z
                  </button>
                </div>
                <div className="space-y-4">
                  {Object.entries(groupedStores).map(([letter, stores]) => (
                    <div key={letter}>
                      <div className="sticky top-32 bg-background py-1 z-10">
                        <span className="text-xs font-bold text-primary">
                          {letter}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {stores.map((store: Store) => (
                          <div
                            key={store.name}
                            className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-accent transition-colors"
                          >
                            <span className="text-sm text-foreground">
                              {store.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {store.count} deals
                              </span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Popular Categories Grid */}
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-3">
                  Popular Categories
                </h2>
                <div className="grid grid-cols-4 gap-3">
                  {popularCategories.map((category) => (
                    <div
                      key={category.name}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                        {category.icon}
                      </div>
                      <span className="text-xs font-medium text-foreground text-center truncate w-full">
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Categories */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground">
                    All Categories
                  </h2>
                  <button className="text-xs text-primary font-medium">
                    A-Z
                  </button>
                </div>
                <div className="space-y-4">
                  {Object.entries(groupedCategories).map(
                    ([letter, categories]) => (
                      <div key={letter}>
                        <div className="sticky top-32 bg-background py-1 z-10">
                          <span className="text-xs font-bold text-primary">
                            {letter}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {categories.map((category: Category) => (
                            <div
                              key={category.name}
                              className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-accent transition-colors"
                            >
                              <span className="text-sm text-foreground">
                                {category.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {category.count} deals
                                </span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
