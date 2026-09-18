import type { Metadata } from "next";
import { PolicyView } from "@/components/policy-view";

export const metadata: Metadata = {
  title: "Maison Policies & Legal Standards | MAH Diamonds London",
  description: "Explore MAH Diamonds client guarantees, British Hallmarking Act compliance, complimentary 30-day resizing, insured delivery, and lifetime craftsmanship warranty.",
};

export default function PoliciesIndexPage() {
  return (
    <main id="main-content">
      <PolicyView activeSlug="delivery-collection" />
    </main>
  );
}
