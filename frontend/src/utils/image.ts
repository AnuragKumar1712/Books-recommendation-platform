export function getImageUrl(url?: string) {
  if (!url) return "/placeholder.png";

  return url.replace("http://", "https://").replace("&zoom=1", "&zoom=2");
}
