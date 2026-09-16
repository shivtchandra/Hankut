import React from "react";

type JsonLdProps = {
  data: Record<string, any> | Array<Record<string, any>>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebAppJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Dramacut",
    alternateName: "드라마컷",
    url: "https://dramacut.com",
    applicationCategory: "GameApplication",
    genre: "K-Drama Trivia Puzzle",
    operatingSystem: "All",
    description:
      "Daily K-drama scene game. One cinematic cut a day — guess the drama in five tries. 드라마컷: 한 컷만 보고 드라마를 맞혀보세요.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Dramacut",
      url: "https://dramacut.com",
    },
  };

  return <JsonLd data={schema} />;
}

export function GameJsonLd({
  dateLabel,
  dramaTitle,
}: {
  dateLabel?: string;
  dramaTitle?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: `Dramacut Daily Scene — ${dateLabel || "Today"}`,
    description: dramaTitle
      ? `Guess today's featured K-drama: ${dramaTitle}. One cinematic cut, 5 clues.`
      : "Daily K-drama scene cut guessing game.",
    genre: ["Trivia", "Puzzle", "K-Drama"],
    numberOfPlayers: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 1,
    },
    publisher: {
      "@type": "Organization",
      name: "Dramacut",
    },
  };

  return <JsonLd data={schema} />;
}

export function DramaSeriesJsonLd({
  titleEn,
  titleKr,
  year,
  network,
  episodes,
  synopsis,
  coverImage,
  slug,
}: {
  titleEn: string;
  titleKr?: string | null;
  year?: number | null;
  network?: string | null;
  episodes?: number | null;
  synopsis?: string | null;
  coverImage?: string | null;
  slug: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: titleEn,
    alternateName: titleKr,
    url: `https://dramacut.com/dramas/${slug}`,
    ...(year && { startDate: `${year}-01-01` }),
    ...(network && {
      productionCompany: {
        "@type": "Organization",
        name: network,
      },
    }),
    ...(episodes && { numberOfEpisodes: episodes }),
    ...(synopsis && { description: synopsis }),
    ...(coverImage && { image: coverImage }),
  };

  return <JsonLd data={schema} />;
}
