import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TripResult } from "@/components/TripResult";
import type { PlanApiResponse } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

async function getSharedPlan(id: string): Promise<PlanApiResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shared_plans")
    .select("plan")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data.plan as PlanApiResponse;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const plan = await getSharedPlan(id);

  if (!plan) {
    return { title: "ไม่พบแผนทริป" };
  }

  const description =
    plan.summary.length > 155 ? `${plan.summary.slice(0, 155)}…` : plan.summary;

  return {
    title: "แผนทริปน่านที่แชร์ให้คุณ",
    description,
    openGraph: {
      title: "แผนทริปน่านที่แชร์ให้คุณ",
      description,
      type: "article",
    },
  };
}

export default async function SharedPlanPage({ params }: Props) {
  const { id } = await params;
  const plan = await getSharedPlan(id);

  if (!plan) notFound();

  return (
    <section
      style={{
        padding: "2.5rem 1.5rem 5rem",
        background: "var(--nan-cream)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "672px" }}>
        <Link href="/plan" style={{ fontSize: "0.85rem", color: "var(--nan-forest)" }}>
          ← วางแผนทริปของคุณเอง
        </Link>
        <h1 style={{ fontSize: "1.375rem", color: "var(--nan-bark)", marginTop: "0.75rem" }}>
          แผนทริปน่านที่แชร์ให้คุณ
        </h1>
      </div>
      <TripResult result={plan} id={id} />
    </section>
  );
}
