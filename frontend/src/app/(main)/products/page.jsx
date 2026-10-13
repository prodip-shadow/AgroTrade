"use client";

import React, { useState, useEffect, useMemo } from "react";
import api from "@/lib/axios";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Sprout,
  X,
  Loader2,
} from "lucide-react";

const ITEMS_PER_PAGE = 40;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("price-desc"); // Default price high to low
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch backend products and categories directly from MySQL database
  useEffect(() => {
    let ignore = false;
    Promise.all([
      api.get("/products/categories"),
      api.get("/products?limit=200"),
    ])
      .then(([catRes, prodRes]) => {
        if (!ignore) {
          if (catRes.data?.categories?.length) {
            setCategories(catRes.data.categories);
          }
          if (prodRes.data?.products) {
            setProducts(prodRes.data.products);
          }
        }
      })
      .catch((err) => {
        console.error("Products load error:", err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let result = products.filter((item) => {
      const cat = item.category_name || item.category || "";
      const matchesCategory =
        selectedCategory === "All" ||
        cat.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q) ||
        (item.farmer_name || "").toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    result.sort((a, b) => {
      if (sortOption === "price-desc") return Number(b.price) - Number(a.price); // High to Low
      if (sortOption === "price-asc") return Number(a.price) - Number(b.price); // Low to High
      if (sortOption === "name-asc") return a.name.localeCompare(b.name);
      return b.id - a.id;
    });

    return result;
  }, [products, selectedCategory, searchQuery, sortOption]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val) => {
    setSortOption(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSortOption("price-desc");
    setCurrentPage(1);
  };

  // Pagination calculations (40 items per page)
  const totalItems = processedProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = processedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Category list derived from database
  const categoryNames = useMemo(() => {
    const list = ["All"];
    categories.forEach((c) => {
      if (c.name && !list.includes(c.name)) list.push(c.name);
    });
    return list;
  }, [categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs uppercase font-extrabold tracking-wider text-primary">
          Marketplace Catalog
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          All Farm Produce
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Browse verified organic agricultural crops. Filter by category, sort by price (high to low),
          and purchase directly from local growers.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search produce by name, category, or farmer..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-11"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 shrink-0">
              <ArrowUpDown className="h-3.5 w-3.5" /> Sort By:
            </span>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-11 rounded-xl border border-border bg-card px-3 text-xs font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            >
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="name-asc">Product Name (A-Z)</option>
              <option value="featured">Newest Listing</option>
            </select>
          </div>
        </div>

        {/* Dynamic Category Pills directly from Database */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-muted-foreground shrink-0 mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Category:
          </span>
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/50 text-muted-foreground border-transparent hover:border-border hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong className="text-foreground">{totalItems === 0 ? 0 : startIndex + 1}</strong> -{" "}
          <strong className="text-foreground">{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}</strong> of{" "}
          <strong className="text-foreground">{totalItems}</strong> products ({ITEMS_PER_PAGE} per page)
        </span>
        {selectedCategory !== "All" && (
          <Badge variant="secondary" className="font-bold">
            Filtered by: {selectedCategory}
          </Badge>
        )}
      </div>

      {/* Grid of 4 Products per row */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-96 rounded-3xl bg-muted/40 animate-pulse border border-border flex items-center justify-center text-muted-foreground"
            >
              <Loader2 className="h-8 w-8 animate-spin opacity-40" />
            </div>
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-3xl bg-card border border-border">
          <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No products match your filters</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
            Try adjusting your search criteria or reset category filters.
          </p>
          <Button variant="outline" onClick={handleResetFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination Bar (40 per page) */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Page <strong className="text-foreground">{currentPage}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong> ({ITEMS_PER_PAGE} products/page)
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="gap-1 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`h-9 w-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === num
                      ? "bg-primary text-primary-foreground shadow-xs font-extrabold"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="gap-1 rounded-xl"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
