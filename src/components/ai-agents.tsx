"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Brain, X, Loader2, MessageSquare, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/TextArea";
import { toast } from "sonner";

interface AIAgentProps {
  context?: "donation" | "campaign" | "general";
  data?: any;
}

export function AIAgent({ context = "general", data }: AIAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [aiInsights, setAiInsights] = useState<any>(null);

  useEffect(() => {
    if (isOpen && context !== "general" && data) {
      loadContextInsights();
    }
  }, [isOpen, context, data]);

  const loadContextInsights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, data }),
      });
      
      if (response.ok) {
        const insights = await response.json();
        setAiInsights(insights);
      }
    } catch (error) {
      console.error("Failed to load AI insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage,
          context,
          data,
        }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const result = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: result.explanation }]);
    } catch (error) {
      toast.error("Failed to get AI response");
      console.error("AI response error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Agent Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Brain className="h-8 w-8 text-white" />
          </motion.div>
          
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>

        {/* Tooltip */}
        <motion.div
          className="absolute bottom-20 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? 10 : 0 }}
          transition={{ delay: 2 }}
        >
          Ask AI Assistant
          <div className="absolute -bottom-1 right-6 w-2 h-2 bg-gray-900 transform rotate-45" />
        </motion.div>
      </motion.div>

      {/* AI Agent Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-6 z-50 w-96 max-h-[600px]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-2 border-emerald-200 dark:border-emerald-800 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-white" />
                  <h3 className="font-bold text-white">Contrust AI Assistant</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* AI Insights Summary */}
              {aiInsights && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-b">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold">{aiInsights.fraudScore || "95"}%</span>
                      <span className="text-xs text-muted-foreground">Trust Score</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-semibold">{aiInsights.compliance || "98"}%</span>
                      <span className="text-xs text-muted-foreground">Compliant</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-xs font-semibold">{aiInsights.alerts || "0"}</span>
                      <span className="text-xs text-muted-foreground">Alerts</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Ask me anything about donations, fraud detection, or campaign progress!</p>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                      <span className="text-sm text-muted-foreground">AI is thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask about fraud detection, spending, or progress..."
                    className="min-h-[60px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}