import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <Button>Test Button</Button>
    </MainLayout>
  );
}
