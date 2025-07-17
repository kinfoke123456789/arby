import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Wallet, 
  Link, 
  Activity, 
  Settings, 
  Zap, 
  ExternalLink,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface WalletState {
  isConnected: boolean;
  address: string;
  balance: string;
  chainId: number;
  network: string;
}

interface ExecutionSettings {
  autoExecute: boolean;
  maxGasPrice: number;
  minProfitThreshold: number;
  maxSlippage: number;
  flashLoanProvider: "aave" | "compound" | "dydx";
}

export const WalletIntegration = () => {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: "",
    balance: "0.0",
    chainId: 1,
    network: "Ethereum"
  });

  const [settings, setSettings] = useState<ExecutionSettings>({
    autoExecute: false,
    maxGasPrice: 50,
    minProfitThreshold: 0.5,
    maxSlippage: 0.5,
    flashLoanProvider: "aave"
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExecution, setLastExecution] = useState<{
    txHash: string;
    profit: number;
    timestamp: string;
  } | null>(null);

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });

        // Convert hex balance to ETH
        const balanceInEth = (parseInt(balance, 16) / 10**18).toFixed(4);

        setWallet({
          isConnected: true,
          address: accounts[0],
          balance: balanceInEth,
          chainId: parseInt(chainId, 16),
          network: getNetworkName(parseInt(chainId, 16))
        });

        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      } else {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to use this feature",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to wallet",
        variant: "destructive"
      });
    }
  }, [toast]);

  const disconnectWallet = useCallback(() => {
    setWallet({
      isConnected: false,
      address: "",
      balance: "0.0",
      chainId: 1,
      network: "Ethereum"
    });
    setSettings(prev => ({ ...prev, autoExecute: false }));
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  }, [toast]);

  const executeArbitrage = useCallback(async (opportunity: any) => {
    if (!wallet.isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    
    try {
      // Simulate arbitrage execution
      toast({
        title: "Executing Arbitrage",
        description: `Executing ${opportunity.coin} arbitrage via ${settings.flashLoanProvider} flash loan...`,
      });

      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const profit = opportunity.profit * (Math.random() * 0.8 + 0.9); // 90-170% of expected

      setLastExecution({
        txHash: mockTxHash,
        profit,
        timestamp: new Date().toLocaleTimeString()
      });

      toast({
        title: "Arbitrage Executed!",
        description: `Profit: +${profit.toFixed(3)}% | TX: ${mockTxHash.slice(0, 10)}...`,
      });

    } catch (error) {
      console.error('Execution failed:', error);
      toast({
        title: "Execution Failed",
        description: "Arbitrage execution failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  }, [wallet.isConnected, settings.flashLoanProvider, toast]);

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return "Ethereum";
      case 42161: return "Arbitrum";
      case 137: return "Polygon";
      case 10: return "Optimism";
      default: return "Unknown";
    }
  };

  const getNetworkColor = (chainId: number) => {
    switch (chainId) {
      case 1: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case 42161: return "bg-blue-600/20 text-blue-300 border-blue-600/30";
      case 137: return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case 10: return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Wallet Connection */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Wallet className="h-5 w-5" />
            Wallet Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!wallet.isConnected ? (
            <div className="text-center space-y-4">
              <div className="p-6 border-2 border-dashed border-border rounded-lg">
                <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">
                  Connect your wallet to start automated arbitrage execution
                </p>
                <Button 
                  onClick={connectWallet}
                  variant="scanner"
                  className="w-full"
                >
                  <Link className="h-4 w-4" />
                  Connect Wallet
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-success rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
                <Button 
                  onClick={disconnectWallet}
                  variant="outline" 
                  size="sm"
                >
                  Disconnect
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">Address</div>
                  <div className="font-mono text-sm">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Balance</div>
                    <div className="font-mono text-sm font-bold">
                      {wallet.balance} ETH
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Network</div>
                    <Badge className={cn("text-xs", getNetworkColor(wallet.chainId))}>
                      {wallet.network}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto-Execution Settings */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Settings className="h-5 w-5" />
            Execution Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-warning" />
              <div>
                <div className="font-medium">Auto Execute</div>
                <div className="text-xs text-muted-foreground">
                  Automatically execute profitable opportunities
                </div>
              </div>
            </div>
            <Switch
              checked={settings.autoExecute && wallet.isConnected}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, autoExecute: checked }))
              }
              disabled={!wallet.isConnected}
            />
          </div>

          {settings.autoExecute && wallet.isConnected && (
            <div className="space-y-3 p-3 bg-success/5 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Auto-execution enabled</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Min Profit</div>
                  <div className="font-mono">{settings.minProfitThreshold}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Max Gas</div>
                  <div className="font-mono">{settings.maxGasPrice} gwei</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Slippage</div>
                  <div className="font-mono">{settings.maxSlippage}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Flash Loan</div>
                  <div className="font-mono capitalize">{settings.flashLoanProvider}</div>
                </div>
              </div>
            </div>
          )}

          {!wallet.isConnected && (
            <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg text-warning">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Connect wallet to enable auto-execution</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution Status */}
      {wallet.isConnected && (
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Activity className="h-5 w-5" />
              Execution Status
              {isExecuting && (
                <Badge className="bg-warning/20 text-warning border-warning/30 animate-pulse">
                  EXECUTING
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastExecution ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-success/5 border border-success/20 rounded-lg">
                <div>
                  <div className="text-xs text-muted-foreground">Last Execution</div>
                  <div className="font-mono text-sm">{lastExecution.timestamp}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Profit Realized</div>
                  <div className="font-mono text-sm font-bold text-success">
                    +{lastExecution.profit.toFixed(3)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Transaction Hash</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {lastExecution.txHash.slice(0, 10)}...
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No arbitrage executions yet. Enable auto-execution to start trading.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};