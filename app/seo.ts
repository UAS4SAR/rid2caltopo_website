import type { Metadata } from "next";

export const siteName = "RID2Caltopo";

export const homeTitle =
  "RID2Caltopo — Track drone assignments and search coverage in real time";

/** Relative URLs resolve against `metadataBase`, which the root layout sets
 *  per host, so og:url / og:image always match the host's canonical URL. */
const socialImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "RID2Caltopo: track drone assignments and search coverage in real time",
};

type PageSeo = {
  /** Page title. Rendered as "<title> | RID2Caltopo" unless `absoluteTitle`. */
  title: string;
  description: string;
  /** Route path, e.g. "/tips". Used for the canonical and og:url. */
  path: string;
  /** Use the title exactly as written (homepage). */
  absoluteTitle?: boolean;
};

/** Per-page metadata with unique Open Graph / Twitter cards and og:url. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageSeo): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} | ${siteName}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName,
      url: path,
      title: socialTitle,
      description,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage.url],
    },
  };
}
