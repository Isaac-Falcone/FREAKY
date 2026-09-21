import { createFileRoute } from "@tanstack/react-router";
import { CategoryPageLayout } from "../../components/CategoryPageLayout";

export const Route = createFileRoute("/categoria/acessorios")({
  component: Page,
});

function Page() {
  return <CategoryPageLayout categorySlug="acessorios" />;
}
