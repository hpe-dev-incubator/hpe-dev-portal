export default function getPlatformShareLinks(siteUrl, source, slug, title) {
  const url = new URL(`/${source}${slug}`, siteUrl).href;
  const encodedUrl = encodeURIComponent(url);
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedUrl}`,
  };
}
