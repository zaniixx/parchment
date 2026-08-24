function isDraftInProduction(data) {
  return Boolean(data.draft) && process.env.ELEVENTY_ENV === "production";
}

export function collectionPermalink(basePath) {
  return (data) => {
    if (isDraftInProduction(data)) return false;
    const slug = data.page.fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
    return `${basePath}/${slug}/`;
  };
}

// Drafts must be excluded from collections too, not just skipped at output time -
// `permalink: false` alone only stops Eleventy from writing a file for the page,
// it does NOT remove the page from collections.* (tags, RSS, the homepage feed).
// Without this, a draft would still show up in the feed with a link to a page
// that doesn't exist in the build output.
export function draftEleventyComputed(basePath) {
  return {
    permalink: collectionPermalink(basePath),
    eleventyExcludeFromCollections: isDraftInProduction,
  };
}
