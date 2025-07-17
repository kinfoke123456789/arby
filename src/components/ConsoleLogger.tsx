import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export const ConsoleLogger = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const newLog: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    
    setLogs(prev => [...prev.slice(-49), newLog]); // Keep last 50 logs
  };

  useEffect(() => {
    // Initial system logs
    addLog("System initialized", "success");
    addLog("ERC-4337 Account Abstraction enabled", "info");
    addLog("Flash loan protocols connected", "success");
    addLog("Scanner ready for operation", "info");

    // Simulate periodic logs
    const interval = setInterval(() => {
      const messages = [
        { msg: "Scanning Uniswap V3 pools...", type: "info" as const },
        { msg: "Flash loan opportunity detected", type: "success" as const },
        { msg: "Gas price optimization in progress", type: "warning" as const },
        { msg: "Arbitrage path calculated", type: "success" as const },
        { msg: "MEV protection enabled", type: "info" as const },
        { msg: "Transaction simulation completed", type: "success" as const }
      ];
      
      if (Math.random() > 0.6) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        addLog(randomMessage.msg, randomMessage.type);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
    addLog("Console cleared", "info");
  };

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getLogPrefix = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "[SUCCESS]";
      case "warning":
        return "[WARNING]";
      case "error":
        return "[ERROR]";
      default:
        return "[INFO]";
    }
  };

  return (
    <Card className="bg-card border-border h-96">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Terminal className="h-5 w-5" />
            Console Logs
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={clearLogs}
            className="h-8 px-3"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={scrollRef}
          className="h-80 overflow-y-auto p-4 bg-background/50 font-mono text-sm space-y-1"
        >
          {logs.map((log) => (
            <div key={log.id} className="flex gap-2 items-start">
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                [{log.timestamp}]
              </span>
              <span className={cn("text-xs font-medium", getLogColor(log.type))}>
                {getLogPrefix(log.type)}
              </span>
              <span className={cn("text-xs", getLogColor(log.type))}>
                {log.message}
              </span>
              {log.type === "success" && (
                <span className="text-success animate-terminal-blink">●</span>
              )}
            </div>
          ))}
          <div className="flex items-center gap-1 text-primary">
            <span className="text-xs">$</span>
            <span className="animate-terminal-blink">_</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};