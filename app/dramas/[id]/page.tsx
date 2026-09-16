import { use } from "react";
import type { Metadata } from "next";
import { DEMO_DRAMAS } from "@/lib/demo-data";
import { DramaSeriesJsonLd } from "@/components/seo/JsonLd";
import { DramaDetailView } from "@/components/dramas/DramaDetailView";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const drama = DEMO_DRAMAS.find((d) => d.id === id) || DEMO_DRAMAS[0];

  const title = `${drama.titleEn} (${drama.titleKr}) — K-Drama Details & Puzzles`;
  const description = `Explore K-drama scene cuts, OSTs, cast info, and daily trivia for ${drama.titleEn} (${drama.titleKr}, ${drama.year}). Test your knowledge on Dramacut!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "video.tv_show",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            drama.titleEn
          )}&drama=${encodeURIComponent(drama.titleKr)}&date=${drama.year}`,
          width: 1200,
          height: 630,
          alt: `${drama.titleEn} on Dramacut`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `/api/og?title=${encodeURIComponent(
          drama.titleEn
        )}&drama=${encodeURIComponent(drama.titleKr)}&date=${drama.year}`,
      ],
    },
  };
}

export default function DramaDetailPage({ params }: Props) {
  const { id } = use(params);
  const drama = DEMO_DRAMAS.find((d) => d.id === id) || DEMO_DRAMAS[0];

  return (
    <>
      <DramaSeriesJsonLd
        titleEn={drama.titleEn}
        titleKr={drama.titleKr}
        year={drama.year}
        network={drama.network}
        slug={drama.id}
      />
      <DramaDetailView drama={drama} />
    </>
  );
}
