import { Button } from "#components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ViewButton({ page }: { page: string }) {
  const navigate = useNavigate();
  return (
    <Button variant="outline" size="sm" onClick={() => navigate(page)}>
      <Eye className="size-4" />
      View
    </Button>
  );
}
