import { draftEleventyComputed } from "../../_11ty/computed-permalink.mjs";

export default {
  layout: "layouts/note.njk",
  tags: ["writing", "notes"],
  eleventyComputed: draftEleventyComputed("/notes"),
};
