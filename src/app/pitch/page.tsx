import type { Metadata } from "next";
import { PitchDeck } from "@/components/PitchDeck";

export const metadata: Metadata = {
  title: "มนต์น่าน 365 — Slide Pitch",
};

export default function PitchPage() {
  return <PitchDeck />;
}
