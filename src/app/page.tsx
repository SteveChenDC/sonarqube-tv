import HomeContent from "@/components/HomeContent";
import { categories, videos, getFeaturedVideo } from "@/data/videos";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <HomeContent
      categories={categories}
      videos={videos}
      featuredVideo={getFeaturedVideo()}
    />
  );
}
