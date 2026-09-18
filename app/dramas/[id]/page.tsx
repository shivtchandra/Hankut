import { use } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DRAMA_CATALOG } from "@/lib/drama-catalog";
import { DramaSeriesJsonLd } from "@/components/seo/JsonLd";
import { DramaDetailView } from "@/components/dramas/DramaDetailView";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const drama = DRAMA_CATALOG.find((d) => d.id === id);
  if (!drama) return {};

  const title = `${drama.titleEn} (${drama.titleKr}) — K-Drama Scenes & Puzzles · Dramacut`;
  const description = drama.descriptionEn;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "video.tv_show",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(drama.titleEn)}&drama=${encodeURIComponent(drama.titleKr)}&date=${drama.year}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function DramaDetailPage({ params }: Props) {
  const { id } = use(params);
  const drama = DRAMA_CATALOG.find((d) => d.id === id);
  if (!drama) notFound();

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
