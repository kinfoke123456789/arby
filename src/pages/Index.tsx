import { useState, useCallback } from "react";
import { ArbitrageScanner } from "@/components/ArbitrageScanner";
import { WalletIntegration } from "@/components/WalletIntegration";
import { ConsoleLogger } from "@/components/ConsoleLogger";

const Index = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [autoExecute, setAutoExecute] = useState(false);

  const handleExecuteOpportunity = useCallback((opportunity: any) => {
    // This would integrate with the actual blockchain execution
    console.log("Executing opportunity:", opportunity);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6">
        <ArbitrageScanner 
          autoExecute={autoExecute}
          walletConnected={walletConnected}
          onExecute={handleExecuteOpportunity}
        />
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <WalletIntegration />
          <ConsoleLogger />
        </div>
      </div>
    </div>
  );
};

export default Index;
