import { draftEleventyComputed } from "../../_11ty/computed-permalink.mjs";

export default {
  layout: "layouts/post.njk",
  tags: ["writing", "posts"],
  eleventyComputed: draftEleventyComputed("/posts"),
};
