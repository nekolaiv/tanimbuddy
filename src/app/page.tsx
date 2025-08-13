import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import SMSTester from "@/components/shared/sms-tester";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">TanimBuddy Dashboard</h2>
          <p className="text-gray-600">AI-powered SMS advisory for Filipino farmers 🌾</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                View Recent Messages
              </Button>
              <Button className="w-full" variant="outline">
                Send Alert Broadcast
              </Button>
              <Button className="w-full" variant="outline">
                Check System Health
              </Button>
            </div>
          </div>
          
          <SMSTester />
        </div>
      </div>
    </MainLayout>
  );
}