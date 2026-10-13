"use client";

import React from "react";
import { HeroSection } from "@/components/home/hero-section";
import { BenefitsSection } from "@/components/home/benefits-section";
import { CategoriesShowcase } from "@/components/home/categories-showcase";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { CultivatorsSpotlight } from "@/components/home/cultivators-spotlight";
import { FarmerBanner } from "@/components/home/farmer-banner";
import { WhyUsSection } from "@/components/home/why-us-section";
import { NewsletterSection } from "@/components/home/newsletter-section";

export default function HomePage() {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Full Screen Immersive Agricultural Hero Banner */}
      <HeroSection />

      {/* 2. Direct Value Propositions */}
      <BenefitsSection />

      {/* 3. Agriculture Categories Showcase with Real Produce Photos */}
      <CategoriesShowcase />

      {/* 4. Featured 4 products side by side from Database */}
      <FeaturedProductsSection />

      {/* 5. Meet Real Cultivators & Farmers Community Spotlight */}
      <CultivatorsSpotlight />

      {/* 6. Farmer Call To Action Banner */}
      <FarmerBanner />

      {/* 7. Why AgroTrade Purpose & Syndicate Comparison */}
      <WhyUsSection />

      {/* 8. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
}
