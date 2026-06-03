import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedListings from "@/components/home/FeaturedListings";
import FlashSales from "@/components/home/FlashSales";
import HagglingBanner from "@/components/home/HagglingBanner";
import UniqueFeatures from "@/components/home/UniqueFeatures";
import TrustedSellers from "@/components/home/TrustedSellers";
import Newsletter from "@/components/home/Newsletter";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import LiveActivity from "@/components/home/LiveActivity";
import TrendingSection from "@/components/home/TrendingSection";
import BazaarLiveBanner from "@/components/home/BazaarLiveBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BazaarLiveBanner />
      <LiveActivity />
      <Categories />
      <RecentlyViewed />
      <FeaturedListings />
      <FlashSales />
      <TrendingSection />
      <HagglingBanner />
      <UniqueFeatures />
      <TrustedSellers />
      <Newsletter />
    </>
  );
}
