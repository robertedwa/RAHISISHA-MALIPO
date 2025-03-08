
import { format } from "date-fns";
import { Download, CheckCircle, XCircle, Calendar, CreditCard } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Payment } from "@/utils/payments";
import { formatCurrency } from "@/utils/validation";

interface TransactionTableProps {
  payments: Payment[];
  isGeneratingPdf: boolean;
  generatePdfReport: () => void;
}

const TransactionTable = ({ payments, isGeneratingPdf, generatePdfReport }: TransactionTableProps) => {
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

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
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
  );
};

export default TransactionTable;
