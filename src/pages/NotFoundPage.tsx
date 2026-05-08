import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";

export function NotFoundPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        title="404 — Sayfa bulunamadı"
        description="Bu adres mevcut değil."
        action={
          <Link
            to="/events"
            className="text-sm text-[var(--color-fg)] underline"
          >
            Events sayfasına dön
          </Link>
        }
      />
    </div>
  );
}
