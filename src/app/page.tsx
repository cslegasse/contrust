import Link from "next/link";
import { Button } from "@/components/ui/Button"
import { Sparkles, TrendingUp, Shield, Brain } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ConTrust
              </span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link href="/donor">Donate</Link>
              </Button>
              <Button asChild>
                <Link href="/ngo">NGO</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Transparency
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            for Charitable Donation Contracts
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            Know exactly where your money goes and how it's spent. Leverage AI to ensure complete transparency in charitable giving.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/donor" className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                I Want to Donate
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/ngo" className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                I'm an NGO
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Advanced AI analyzes campaigns, detects fraud, and provides optimization recommendations.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Financial Security</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Every transaction is recorded on Knot for complete transparency and immutability.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track how your donations are being spent in real-time with detailed category breakdowns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
