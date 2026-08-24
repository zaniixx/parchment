import { draftEleventyComputed } from "../../_11ty/computed-permalink.mjs";

export default {
  layout: "layouts/gallery.njk",
  tags: ["writing", "galleries"],
  eleventyComputed: draftEleventyComputed("/galleries"),
};
