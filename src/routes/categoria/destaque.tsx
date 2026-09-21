import { createFileRoute } from "@tanstack/react-router";
import { CategoryPageLayout } from "../../components/CategoryPageLayout";

export const Route = createFileRoute("/categoria/destaque")({
  component: Page,
});

function Page() {
  return <CategoryPageLayout categorySlug="destaque" />;
}
