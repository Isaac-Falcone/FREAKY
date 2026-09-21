import { createFileRoute } from "@tanstack/react-router";
import { CategoryPageLayout } from "../../components/CategoryPageLayout";

export const Route = createFileRoute("/categoria/jaquetas")({
  component: Page,
});

function Page() {
  return <CategoryPageLayout categorySlug="jaquetas" />;
}
