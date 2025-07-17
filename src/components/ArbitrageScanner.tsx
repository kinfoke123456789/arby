import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Search, Zap, DollarSign, TrendingUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArbitrageOpportunity {
  id: string;
  coin: string;
  path: string;
  volume: number;
  profit: number;
  status: "active" | "expired" | "pending";
  flashLoanRequired: boolean;
  gasEstimate: number;
}

interface ScannerStats {
  totalOpportunities: number;
  activeScans: number;
  totalProfit: number;
  successRate: number;
}

export const ArbitrageScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [minProfit, setMinProfit] = useState(0.3);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [stats, setStats] = useState<ScannerStats>({
    totalOpportunities: 0,
    activeScans: 0,
    totalProfit: 0,
    successRate: 0
  });

  const profitThresholds = [0.1, 0.3, 0.5, 1.0];

  const generateMockOpportunity = useCallback((): ArbitrageOpportunity => {
    const coins = ["ETH", "USDC", "WBTC", "DAI", "USDT", "UNI", "LINK", "AAVE"];
    const exchanges = ["Uniswap", "SushiSwap", "Curve", "Balancer"];
    const coin = coins[Math.floor(Math.random() * coins.length)];
    const exchange1 = exchanges[Math.floor(Math.random() * exchanges.length)];
    const exchange2 = exchanges.filter(e => e !== exchange1)[Math.floor(Math.random() * 3)];
    
    return {
      id: `arb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      coin,
      path: `${exchange1} → ${exchange2}`,
      volume: Math.random() * 50000 + 1000,
      profit: Math.random() * 2 + minProfit,
      status: Math.random() > 0.8 ? "pending" : "active",
      flashLoanRequired: Math.random() > 0.6,
      gasEstimate: Math.random() * 0.05 + 0.01
    };
  }, [minProfit]);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        if (Math.random() > 0.3 && opportunities.length < 8) {
          const newOpportunity = generateMockOpportunity();
          setOpportunities(prev => [...prev, newOpportunity]);
          
          setStats(prev => ({
            ...prev,
            totalOpportunities: prev.totalOpportunities + 1,
            activeScans: prev.activeScans + 1,
            totalProfit: prev.totalProfit + newOpportunity.profit
          }));
        }
        
        // Remove old opportunities
        setOpportunities(prev => prev.filter((_, index) => index < 6));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isScanning, generateMockOpportunity, opportunities.length]);

  const handleStart = () => {
    setIsScanning(true);
  };

  const handleStop = () => {
    setIsScanning(false);
    setOpportunities([]);
  };

  const getProfitColor = (profit: number) => {
    if (profit >= 1) return "text-success";
    if (profit >= 0.5) return "text-warning";
    return "text-primary";
  };

  const getStatusBadge = (status: ArbitrageOpportunity["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/20 text-success border-success/30">ACTIVE</Badge>;
      case "pending":
        return <Badge className="bg-warning/20 text-warning border-warning/30">PENDING</Badge>;
      case "expired":
        return <Badge variant="outline" className="border-muted text-muted-foreground">EXPIRED</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="h-8 w-8 text-primary animate-pulse-glow" />
            <h1 className="text-4xl font-bold text-foreground">
              DeFi Arbitrage Scanner v2.0
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            ERC-4337 Flash Loan Arbitrage Engine
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        </div>

        {/* Status and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Card */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Activity className="h-5 w-5" />
                Scanner Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "h-3 w-3 rounded-full animate-pulse",
                  isScanning ? "bg-success" : "bg-muted"
                )} />
                <span className="text-lg font-medium">
                  {isScanning ? "SCANNING" : "READY"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Opportunities</div>
                  <div className="text-lg font-bold text-success">{stats.totalOpportunities}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Active Scans</div>
                  <div className="text-lg font-bold text-primary">{stats.activeScans}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Zap className="h-5 w-5" />
                Scanner Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-4">
                <Button
                  variant="scanner"
                  onClick={handleStart}
                  disabled={isScanning}
                  className="flex-1"
                >
                  <Play className="h-4 w-4" />
                  Start
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleStop}
                  disabled={!isScanning}
                  className="flex-1"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Min Profit: <span className="text-primary font-bold">{minProfit}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Profit Thresholds */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                Min Profit Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {profitThresholds.map((threshold) => (
                  <Button
                    key={threshold}
                    variant={minProfit === threshold ? "default" : "terminal"}
                    onClick={() => setMinProfit(threshold)}
                    className="h-10 text-sm"
                  >
                    {threshold}%
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Opportunities Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <DollarSign className="h-5 w-5" />
              Flash Loan Arbitrage Opportunities
              {isScanning && (
                <div className="ml-auto">
                  <div className="h-1 w-32 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-scan-line rounded-full" />
                  </div>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/20">
                  <tr className="text-sm">
                    <th className="text-left p-4 font-medium text-muted-foreground">Asset</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Path</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Volume</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Profit %</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Flash Loan</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-muted-foreground">
                        {isScanning ? "Scanning for opportunities..." : "No opportunities found. Start scanning to begin."}
                      </td>
                    </tr>
                  ) : (
                    opportunities.map((opportunity) => (
                      <tr 
                        key={opportunity.id} 
                        className="border-b border-border hover:bg-muted/10 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                            <span className="font-medium text-foreground">{opportunity.coin}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{opportunity.path}</td>
                        <td className="p-4 text-right font-mono">
                          ${opportunity.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                        <td className={cn("p-4 text-right font-bold", getProfitColor(opportunity.profit))}>
                          +{opportunity.profit.toFixed(2)}%
                        </td>
                        <td className="p-4 text-center">
                          {opportunity.flashLoanRequired ? (
                            <Badge className="bg-warning/20 text-warning border-warning/30">REQUIRED</Badge>
                          ) : (
                            <Badge variant="outline" className="border-muted text-muted-foreground">OPTIONAL</Badge>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {getStatusBadge(opportunity.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};