import { readFileSync } from "node:fs";

const pathPrefix = "/parchment/";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/assets/scripts");
  eleventyConfig.addPassthroughCopy("src/assets/uploads");

  eleventyConfig.addShortcode("inlineAsset", (path) => readFileSync(path, "utf8"));

  eleventyConfig.addFilter("readableDate", (d) =>
    new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(d)
  );
  eleventyConfig.addFilter("isoDate", (d) => d.toISOString().slice(0, 10));
  eleventyConfig.addFilter("prettyBytes", (n) =>
    typeof n === "number" ? (n / 1024).toFixed(1) + " KB" : "—"
  );
  const stripAndTruncate = (str, length) => {
    if (!str) return "";
    const plain = String(str).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return plain.length > length ? plain.slice(0, length).trim() + "…" : plain;
  };
  eleventyConfig.addFilter("truncate", stripAndTruncate);

  eleventyConfig.addFilter("toSearchIndex", (items) =>
    JSON.stringify(
      items.map((item) => ({
        title:
          item.data.title ||
          "Note — " +
            new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(item.date),
        url: pathPrefix.slice(0, -1) + item.url,
        tags: item.data.tags || [],
        excerpt: item.data.excerpt || stripAndTruncate(item.templateContent, 160),
      }))
    )
  );

  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());
  eleventyConfig.addGlobalData("buildTime", () => new Date());

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    pathPrefix,
    // admin/index.html must stay a raw file (Decap's own shell, not ours to template) -
    // passthrough copy alone doesn't stop Eleventy from ALSO compiling a .html file
    // it finds inside the input tree, so "html" is deliberately left out here.
    templateFormats: ["md", "njk"],
  };
}
