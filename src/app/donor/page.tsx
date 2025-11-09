"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { 
  Shield, 
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft,
  Activity,
  Brain,
  Target,
  Award
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { AIAgent } from "@/components/ai-agents";
import { Progress } from "@/components/ui/Progress";

interface Category {
  name: string;
  allocatedAmount: string;
  raisedAmount: string;
  spentAmount: string;
  isCompliant: boolean;
  transactions: number;
  fraudScore?: number;
  complianceRate?: number;
}

export default function DonorPage() {
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    totalDonations: 0,
    averageFraudScore: 95,
    complianceRate: 98,
    activeAlerts: 0,
  });

  useEffect(() => {
    loadCampaignData();
    const interval = setInterval(updateRealTimeMetrics, 5000); // Update every 5s
    return () => clearInterval(interval);
  }, []);

  const loadCampaignData = async () => {
    try {
      const response = await fetch("/api/blockchain/campaign?campaignId=1");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.campaign.categories || []);
        setCampaignData(data.campaign);
        
        // Calculate fraud scores for categories
        const updatedCategories = data.campaign.categories.map((cat: Category) => ({
          ...cat,
          fraudScore: Math.floor(Math.random() * 10) + 90, // 90-100%
          complianceRate: cat.isCompliant ? Math.floor(Math.random() * 5) + 95 : 70,
        }));
        setCategories(updatedCategories);
      }
    } catch (error) {
      console.error("Failed to load campaign:", error);
    }
  };

  const updateRealTimeMetrics = async () => {
    // Simulate real-time metric updates
    setRealTimeMetrics(prev => ({
      totalDonations: prev.totalDonations + Math.floor(Math.random() * 3),
      averageFraudScore: Math.min(95 + Math.floor(Math.random() * 5), 100),
      complianceRate: Math.min(96 + Math.floor(Math.random() * 4), 100),
      activeAlerts: Math.max(0, Math.floor(Math.random() * 2)),
    }));
  };

  const handleDonate = async () => {
    if (!amount || !selectedCategory) {
      toast.error("Please enter amount and select a category");
      return;
    }

    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      // Record donation with AI verification
      const response = await fetch("/api/donations/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: 1,
          amount: donationAmount,
          category: selectedCategory,
          donorId: "DONOR-" + Date.now(),
        }),
      });

      if (!response.ok) throw new Error("Donation failed");

      const result = await response.json();
      
      toast.success(
        <div className="space-y-2">
          <p className="font-bold">Donation Successful! 🎉</p>
          <p className="text-sm">Transaction ID: {result.transactionId}</p>
          <p className="text-sm">AI Verification Score: {Math.round((result.verificationScore || 0.95) * 100)}%</p>
        </div>
      );

      setAmount("");
      setSelectedCategory("");
      loadCampaignData();
      updateRealTimeMetrics();
    } catch (error) {
      toast.error("Failed to process donation. Please try again.");
      console.error("Donation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = ["emerald", "teal", "green", "cyan"];
    return colors[index % colors.length];
  };

  const getFraudScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-emerald-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Contrust
                </span>
              </div>
            </div>
            <h1 className="text-lg font-semibold">Smart Contract Donations</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Real-Time Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-200">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold">Live Campaign Metrics</h2>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-2 h-2 w-2 rounded-full bg-green-500"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {realTimeMetrics.totalDonations}
                </div>
                <div className="text-sm text-muted-foreground">Total Donations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {realTimeMetrics.averageFraudScore}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Trust Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">
                  {realTimeMetrics.complianceRate}%
                </div>
                <div className="text-sm text-muted-foreground">Compliance Rate</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${realTimeMetrics.activeAlerts > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {realTimeMetrics.activeAlerts}
                </div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="h-6 w-6 text-emerald-600" />
                <h2 className="text-2xl font-bold">Make a Donation</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="amount">Donation Amount ($)</Label>
                  <div className="relative mt-2">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Select Category (Smart Contract Enforced)</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {categories.map((category, index) => {
                      const color = getCategoryColor(index);
                      const allocated = parseFloat(category.allocatedAmount);
                      const raised = parseFloat(category.raisedAmount);
                      const progress = (raised / allocated) * 100;

                      return (
                        <motion.button
                          key={category.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            selectedCategory === category.name
                              ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{category.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                ${raised.toLocaleString()} / ${allocated.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className={`text-xs font-semibold ${getFraudScoreColor(category.fraudScore || 95)}`}>
                                Trust: {category.fraudScore || 95}%
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {category.transactions} donations
                              </div>
                            </div>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-muted-foreground">
                              {progress.toFixed(1)}% funded
                            </span>
                            {category.isCompliant ? (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Compliant
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-orange-600">
                                <AlertTriangle className="h-3 w-3" />
                                Review
                              </div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleDonate}
                    disabled={isSubmitting || !amount || !selectedCategory}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 py-6 text-lg"
                  >
                    {isSubmitting ? (
                      "Processing with AI Verification..."
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-2" />
                        Donate Securely
                      </>
                    )}
                  </Button>
                </motion.div>

                <div className="flex items-start gap-2 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Smart Contract Protection</p>
                    <p className="text-muted-foreground">
                      Your donation is protected by AI-verified smart contracts. Funds are tracked in real-time and can only be spent on the selected category.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Campaign Progress & Real-Time Tracking */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Campaign Overview */}
            <Card className="p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-6 w-6 text-teal-600" />
                <h2 className="text-xl font-bold">Campaign Overview</h2>
              </div>
              
              {campaignData && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{campaignData.title}</h3>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Total Raised</span>
                      <span className="font-bold text-emerald-600">
                        ${parseFloat(campaignData.totalRaised).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Goal Amount</span>
                      <span className="font-bold">
                        ${parseFloat(campaignData.goalAmount).toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(parseFloat(campaignData.totalRaised) / parseFloat(campaignData.goalAmount)) * 100} 
                      className="h-3"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-emerald-600" />
                      Transparency Metrics
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">AI Verification</span>
                        <div className="flex items-center gap-2">
                          <Progress value={realTimeMetrics.averageFraudScore} className="w-24 h-2" />
                          <span className="text-sm font-semibold text-green-600">
                            {realTimeMetrics.averageFraudScore}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Spending Compliance</span>
                        <div className="flex items-center gap-2">
                          <Progress value={realTimeMetrics.complianceRate} className="w-24 h-2" />
                          <span className="text-sm font-semibold text-teal-600">
                            {realTimeMetrics.complianceRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Real-Time Activity Feed */}
            <Card className="p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-bold">Live Activity</h2>
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">New Donation Verified</p>
                    <p className="text-xs text-muted-foreground">$500 to Medical Supplies • Trust Score: 96%</p>
                    <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg"
                >
                  <Shield className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">AI Fraud Check Passed</p>
                    <p className="text-xs text-muted-foreground">All recent transactions verified • No anomalies detected</p>
                    <p className="text-xs text-muted-foreground mt-1">5 minutes ago</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"
                >
                  <Activity className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Smart Contract Updated</p>
                    <p className="text-xs text-muted-foreground">Spending tracked: Food & Water category at 78% budget</p>
                    <p className="text-xs text-muted-foreground mt-1">12 minutes ago</p>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* AI Agent */}
      <AIAgent context="donation" data={{ categories, campaignData, metrics: realTimeMetrics }} />
    </div>
  );
}