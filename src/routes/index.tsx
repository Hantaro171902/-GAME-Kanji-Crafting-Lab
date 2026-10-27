import { createFileRoute } from "@tanstack/react-router";
import WelcomeScreen from "@/components/WelcomeScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kanji The Lost World — A Cozy Tanuki Kanji Adventure" },
      { name: "description", content: "Guide a Level 0 tanuki through a forest of lost words: dig radicals, build kanji in a bento box, and practice calligraphy." },
      { property: "og:title", content: "Kanji The Lost World — A Cozy Tanuki Kanji Adventure" },
      { property: "og:description", content: "Dig radicals, build kanji, write them with a brush, and restore the forest." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WelcomeScreen,
});