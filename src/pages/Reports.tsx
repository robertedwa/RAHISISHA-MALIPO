
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Chart from "@/components/Chart";
import ContributionCard from "@/components/ContributionCard";
import { CreditCard, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { getCurrentUser, User } from "@/utils/auth";
import { getUserPayments, Payment, getPaymentStats } from "@/utils/payments";
import { formatCurrency } from "@/utils/validation";

const Reports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalContributions: 0,
    successfulPayments: 0,
    failedPayments: 0,
  });
  const [chartData, setChartData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "failed">("all");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      
      // Get all payments
      const userPayments = getUserPayments(currentUser.id);
      setPayments(userPayments);
      
      // Get payment stats
      const userStats = getPaymentStats(currentUser.id);
      setStats(userStats);
      
      // Set chart data
      const completedPaymentsAmount = userPayments
        .filter(p => p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0);
        
      const pendingPaymentsAmount = userPayments
        .filter(p => p.status === "pending")
        .reduce((sum, p) => sum + p.amount, 0);
        
      const failedPaymentsAmount = userPayments
        .filter(p => p.status === "failed")
        .reduce((sum, p) => sum + p.amount, 0);
      
      // Only add chart data segments that have values
      const data = [];
      if (completedPaymentsAmount > 0) {
        data.push({
          name: "Completed",
          value: completedPaymentsAmount,
          color: "#22c55e", // green-500
        });
      }
      if (pendingPaymentsAmount > 0) {
        data.push({
          name: "Pending",
          value: pendingPaymentsAmount,
          color: "#facc15", // yellow-400
        });
      }
      if (failedPaymentsAmount > 0) {
        data.push({
          name: "Failed",
          value: failedPaymentsAmount,
          color: "#ef4444", // red-500
        });
      }
      
      setChartData(data);
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!user) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  // Filter payments based on active tab
  const filteredPayments = payments.filter(payment => {
    if (activeTab === "all") return true;
    if (activeTab === "completed") return payment.status === "completed";
    if (activeTab === "failed") return payment.status === "failed";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="animate-slide-up">
            <header className="mb-8 mt-8">
              <h1 className="text-3xl font-bold">Reports</h1>
              <p className="text-muted-foreground">
                View your contribution history and analytics
              </p>
            </header>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <div className="bg-card rounded-lg shadow-sm border p-6 animate-scale-in" style={{ animationDelay: "0ms" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Total Contributions</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalContributions)}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg shadow-sm border p-6 animate-scale-in" style={{ animationDelay: "100ms" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Successful Payments</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.successfulPayments}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg shadow-sm border p-6 animate-scale-in" style={{ animationDelay: "200ms" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Failed Payments</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.failedPayments}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <div className="bg-card rounded-lg shadow-sm border overflow-hidden md:col-span-2">
                <div className="p-4 border-b">
                  <h2 className="font-medium">Contribution Analytics</h2>
                </div>
                
                <div className="p-4">
                  {chartData.length > 0 ? (
                    <Chart data={chartData} />
                  ) : (
                    <div className="text-center py-12 bg-muted/20 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No contribution data yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Make a contribution to see analytics
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-medium">Payment Breakdown</h2>
                </div>
                
                <div className="p-4">
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Completed</span>
                      </div>
                      <span className="font-medium">{stats.successfulPayments}</span>
                    </li>
                    
                    <li className="flex justify-between items-center p-3 bg-yellow-50 rounded-md">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                        <span>Pending</span>
                      </div>
                      <span className="font-medium">
                        {payments.filter(p => p.status === "pending").length}
                      </span>
                    </li>
                    
                    <li className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                      <div className="flex items-center">
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span>Failed</span>
                      </div>
                      <span className="font-medium">{stats.failedPayments}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm border overflow-hidden mb-8">
              <div className="border-b">
                <div className="flex">
                  <button 
                    className={`px-4 py-3 font-medium text-sm ${activeTab === "all" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                    onClick={() => setActiveTab("all")}
                  >
                    All Payments
                  </button>
                  <button 
                    className={`px-4 py-3 font-medium text-sm ${activeTab === "completed" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                    onClick={() => setActiveTab("completed")}
                  >
                    Completed
                  </button>
                  <button 
                    className={`px-4 py-3 font-medium text-sm ${activeTab === "failed" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                    onClick={() => setActiveTab("failed")}
                  >
                    Failed
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="font-medium mb-4">Contribution History</h2>
                
                {filteredPayments.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPayments.map((payment) => (
                      <ContributionCard key={payment.id} payment={payment} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No payments found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activeTab === "all" 
                        ? "Make a contribution to see your history" 
                        : `No ${activeTab} payments yet`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
