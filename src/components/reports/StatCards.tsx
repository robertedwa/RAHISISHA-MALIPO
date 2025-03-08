
import { Wallet, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/validation";

interface StatCardsProps {
  stats: {
    totalContributions: number;
    successfulPayments: number;
    failedPayments: number;
  };
}

const StatCards = ({ stats }: StatCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card className="animate-scale-in" style={{ animationDelay: "0ms" }}>
        <CardHeader className="pb-2">
          <CardDescription>Total Contributions</CardDescription>
          <CardTitle className="text-2xl">{formatCurrency(stats.totalContributions)}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="animate-scale-in" style={{ animationDelay: "100ms" }}>
        <CardHeader className="pb-2">
          <CardDescription>Successful Payments</CardDescription>
          <CardTitle className="text-2xl">{stats.successfulPayments}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
        <CardHeader className="pb-2">
          <CardDescription>Failed Payments</CardDescription>
          <CardTitle className="text-2xl">{stats.failedPayments}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
