
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PaymentSimulator from "@/components/PaymentSimulator";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { getCurrentUser, User } from "@/utils/auth";
import { getUserPayments, Payment } from "@/utils/payments";
import { formatCurrency } from "@/utils/validation";

const Contribute = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      
      // Get recent payments
      const userPayments = getUserPayments(currentUser.id);
      setPayments(userPayments.slice(0, 5));
    } else {
      navigate("/");
    }
  }, [navigate, refreshKey]);

  const handlePaymentSuccess = () => {
    // Refresh data
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 1000);
  };

  if (!user) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="animate-slide-up">
            <header className="mb-8 mt-8">
              <h1 className="text-3xl font-bold">Make a Contribution</h1>
              <p className="text-muted-foreground">
                Add funds to your account via M-Pesa
              </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Contributions</h2>
                  
                  {payments.length > 0 ? (
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div 
                          key={payment.id} 
                          className="bg-card rounded-lg border p-4 flex justify-between items-center animate-scale-in"
                        >
                          <div className="flex items-center">
                            {payment.status === "completed" ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            ) : payment.status === "failed" ? (
                              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                            ) : (
                              <CreditCard className="h-5 w-5 text-yellow-500 mr-3" />
                            )}
                            <div>
                              <p className="font-medium">{formatCurrency(payment.amount)}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(payment.date).toLocaleString("en-TZ")}
                              </p>
                            </div>
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
                    <div className="text-center py-8 bg-muted/30 rounded-lg border">
                      <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No payments yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your contribution history will appear here
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-muted/20 rounded-lg border">
                  <h3 className="font-medium mb-2">How It Works</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Enter the amount you wish to contribute</li>
                    <li>Click the "Pay" button to initiate the M-Pesa payment</li>
                    <li>In a real application, you would receive an M-Pesa prompt on your phone</li>
                    <li>Once the payment is complete, your balance will be updated</li>
                  </ol>
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                <PaymentSimulator onSuccess={handlePaymentSuccess} />
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-medium text-blue-700">Your Current Balance</h3>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {formatCurrency(user.balance)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contribute;
