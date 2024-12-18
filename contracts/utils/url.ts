export function normalizeURI(uri: string) {
  // Use the URL constructor to parse the given URI
  const url = new URL(uri);

  // Normalize the scheme and host
  url.protocol = url.protocol.toLowerCase(); // e.g. "HTTP:" -> "http:"
  url.hostname = url.hostname.toLowerCase(); // e.g. "Example.COM" -> "example.com"

  // Leave the path, search (query), and hash (fragment) as is
  // because they may be case-sensitive.

  // Return the normalized URI as a string
  return url.toString();
}
