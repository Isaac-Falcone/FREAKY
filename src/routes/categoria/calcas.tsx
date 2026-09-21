import { createFileRoute } from "@tanstack/react-router";
import { CategoryPageLayout } from "../../components/CategoryPageLayout";

export const Route = createFileRoute("/categoria/calcas")({
  component: Page,
});

function Page() {
  return <CategoryPageLayout categorySlug="calcas" />;
}
