import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedListings from "@/components/home/FeaturedListings";
import HagglingBanner from "@/components/home/HagglingBanner";
import UniqueFeatures from "@/components/home/UniqueFeatures";
import TrustedSellers from "@/components/home/TrustedSellers";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedListings />
      <HagglingBanner />
      <UniqueFeatures />
      <TrustedSellers />
      <Newsletter />
    </>
  );
}
