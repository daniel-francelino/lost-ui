import type { Meta, StoryObj } from "@storybook/react-vite";

import { MagicTweet, TweetSkeleton, TweetNotFound } from "./tweet-card";

const sampleTweet = {
  __typename: "Tweet",
  id_str: "1",
  lang: "en",
  favorite_count: 128,
  created_at: "2026-01-15T12:00:00.000Z",
  display_text_range: [0, 52],
  entities: { hashtags: [], urls: [], user_mentions: [], symbols: [] },
  text: "Shipping a component library is mostly naming things.",
  user: {
    id_str: "1",
    name: "Lost UI",
    screen_name: "lostui",
    profile_image_url_https: "",
    is_blue_verified: true,
    profile_image_shape: "Circle",
  },
  edit_control: {
    edit_tweet_ids: ["1"],
    editable_until_msecs: "0",
    is_edit_eligible: false,
    edits_remaining: "0",
  },
  isEdited: false,
  isStaleEdit: false,
  conversation_count: 4,
  news_action_type: "conversation",
  photos: [],
  mediaDetails: [],
} as never;

const meta = {
  title: "Effects/Cards/TweetCard",
  component: MagicTweet,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof MagicTweet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { tweet: sampleTweet, className: "w-96" },
};

export const Loading: Story = {
  args: { tweet: sampleTweet },
  render: () => <TweetSkeleton />,
};

export const NotFound: Story = {
  args: { tweet: sampleTweet },
  render: () => <TweetNotFound />,
};
