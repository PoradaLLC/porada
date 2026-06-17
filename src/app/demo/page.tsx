import {
  About,
  Faq,
  GroupsAndGifts,
  Hero,
  LeaderboardTeaser,
  ReviewsStrip,
  RoomsGrid,
  Spotlight,
  StatBand,
} from "@/components/demo/home/sections";

export default function DemoHomePage() {
  return (
    <>
      <Hero />
      <StatBand />
      <Spotlight />
      <RoomsGrid />
      <About />
      <ReviewsStrip />
      <GroupsAndGifts />
      <Faq />
      <LeaderboardTeaser />
    </>
  );
}
