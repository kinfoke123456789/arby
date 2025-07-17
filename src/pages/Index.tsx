import { ArbitrageScanner } from "@/components/ArbitrageScanner";
import { ConsoleLogger } from "@/components/ConsoleLogger";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6">
        <ArbitrageScanner />
        <div className="max-w-7xl mx-auto px-6">
          <ConsoleLogger />
        </div>
      </div>
    </div>
  );
};

export default Index;
