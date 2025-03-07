
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { 
  CreditCard, 
  TrendingUp, 
  PlusCircle, 
  Calendar, 
  ArrowRight 
} from "lucide-react";
import { getCurrentUser, User } from "@/utils/auth";
import { formatCurrency } from "@/utils/validation";
import { getPaymentStats, getUserPayments, Payment } from "@/utils/payments";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalContributions: 0,
    successfulPayments: 0,
    failedPayments: 0,
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      
      const userPayments = getUserPayments(currentUser.id);
      setPayments(userPayments.slice(0, 3)); // Get last 3 payments
      
      const userStats = getPaymentStats(currentUser.id);
      setStats(userStats);
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!user) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-TZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="animate-slide-up">
            <header className="mb-8 mt-8">
              <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
              <p className="text-muted-foreground">
                Dashboard overview • Member since {formatDate(user.createdAt)}
              </p>
            </header>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <div className="bg-card rounded-lg shadow-sm border p-6 animate-scale-in" style={{ animationDelay: "0ms" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Current Balance</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(user.balance)}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg shadow-sm border p-6 animate-scale-in" style={{ animationDelay: "100ms" }}>
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
              
              <div className="bg-card rounded-lg shadow-sm border p-6 animate-scale-in" style={{ animationDelay: "200ms" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Successful Payments</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.successfulPayments}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <div className="md:col-span-2 bg-card rounded-lg shadow-sm border overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-medium">Recent Contributions</h2>
                  <button 
                    onClick={() => navigate("/reports")}
                    className="text-sm text-primary font-medium flex items-center hover:underline"
                  >
                    View all <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
                
                <div className="p-4">
                  {payments.length > 0 ? (
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center p-3 bg-muted/40 rounded-md">
                          <div>
                            <p className="font-medium">{formatCurrency(payment.amount)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(payment.date).toLocaleDateString("en-TZ")}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            payment.status === "completed" 
                              ? "bg-green-100 text-green-600" 
                              : payment.status === "pending" 
                              ? "bg-yellow-100 text-yellow-600" 
                              : "bg-red-100 text-red-600"
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No payments yet</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-medium">Quick Actions</h2>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate("/contribute")}
                      className="w-full bg-muted/40 hover:bg-muted transition-colors p-3 rounded-md text-left flex items-center"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <PlusCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Make Contribution</p>
                        <p className="text-xs text-muted-foreground">
                          Add funds via M-Pesa
                        </p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => navigate("/reports")}
                      className="w-full bg-muted/40 hover:bg-muted transition-colors p-3 rounded-md text-left flex items-center"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">View Reports</p>
                        <p className="text-xs text-muted-foreground">
                          See payment analytics
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
