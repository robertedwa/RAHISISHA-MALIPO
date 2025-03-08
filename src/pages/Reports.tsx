
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  FileText, 
  Download, 
  Calendar, 
  Wallet, 
  CreditCard, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUser, User } from "@/utils/auth";
import { getUserPayments, Payment, getPaymentStats } from "@/utils/payments";
import { formatCurrency } from "@/utils/validation";
import { toast } from "sonner";

const Reports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalContributions: 0,
    successfulPayments: 0,
    failedPayments: 0,
  });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  // Get the status badge/pill HTML
  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Completed</span>;
    } else if (status === "failed") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Failed</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Calendar className="w-3 h-3 mr-1" /> Pending</span>;
    }
  };

  const getNetworkName = (networkId?: string): string => {
    if (!networkId) return "N/A";
    
    const networks: Record<string, string> = {
      mpesa: "M-Pesa",
      tigopesa: "Tigo Pesa",
      airtelmoney: "Airtel Money",
      halopesa: "Halo Pesa",
      ezypesa: "Ezy Pesa"
    };
    return networks[networkId] || "Mobile Money";
  };

  // Generate PDF report
  const generatePdfReport = () => {
    setIsGeneratingPdf(true);
    
    // In a real app, we would use a PDF library like jspdf
    // For this demo, we'll simulate PDF generation
    setTimeout(() => {
      toast.success("PDF report generated successfully!");
      setIsGeneratingPdf(false);
      
      // In a real app, we would download the PDF here
      // For demo, just log the data
      console.log("Generated PDF with data:", {
        user,
        payments,
        stats,
        generatedAt: new Date().toISOString()
      });
    }, 2000);
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
            <header className="mb-8 mt-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Reports</h1>
                <p className="text-muted-foreground">
                  Generate and download contribution reports
                </p>
              </div>
              <Button 
                onClick={generatePdfReport} 
                className="bg-primary hover:bg-primary/90"
                disabled={isGeneratingPdf}
              >
                {isGeneratingPdf ? (
                  <>Generating...</>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate PDF Report
                  </>
                )}
              </Button>
            </header>

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

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Transaction History
                </CardTitle>
                <CardDescription>
                  A detailed list of all your transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Network</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.date)}</TableCell>
                            <TableCell>{payment.reference}</TableCell>
                            <TableCell>{getNetworkName(payment.network)}</TableCell>
                            <TableCell>{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No transactions found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Make a contribution to see your transaction history
                    </p>
                  </div>
                )}
              </CardContent>
              {payments.length > 0 && (
                <CardFooter className="flex justify-between border-t pt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {payments.length} transactions
                  </p>
                  <Button variant="outline" size="sm" onClick={generatePdfReport} disabled={isGeneratingPdf}>
                    <Download className="mr-2 h-4 w-4" />
                    {isGeneratingPdf ? "Generating..." : "Download PDF"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
