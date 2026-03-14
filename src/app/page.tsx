import HomeContent from "@/components/HomeContent";
import { categories, videos, getFeaturedVideo } from "@/data/videos";

export default function Home() {
  return (
    <HomeContent
      categories={categories}
      videos={videos}
      featuredVideo={getFeaturedVideo()}
    />
  );
}
