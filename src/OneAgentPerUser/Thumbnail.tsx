import React from "react";
import { ThumbnailImage } from "../components/ThumbnailImage";
import { STORIES, type StoryKey } from "./stories";

/** The original video (Mei on the flat ground) is the overview: the website's title for the stories section */
const OVERVIEW = { title: "One agent per user, not one sequence for everyone", story: "mei" as StoryKey };

/**
 * A "One agent per user" video's thumbnail: the blog and OG thumbnail design
 * (ThumbnailImage) on the story's sky, with the story's person as the dotted
 * portrait and the website's headline for the story as the title. Without a
 * story, the original overview video's.
 */
export const OneAgentPerUserThumbnail: React.FC<{ story?: StoryKey }> = ({ story }) => {
  const s = STORIES[story ?? OVERVIEW.story];
  return <ThumbnailImage title={story ? s.headline : OVERVIEW.title} sky={s.sky} person={s.key} />;
};
