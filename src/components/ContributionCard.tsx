
import { formatCurrency } from "@/utils/validation";
import { Payment } from "@/utils/payments";
import { Check, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContributionCardProps {
  payment: Payment;
}

const ContributionCard = ({ payment }: ContributionCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-TZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const getStatusIcon = () => {
    switch (payment.status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (payment.status) {
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      default:
        return "Processing";
    }
  };

  const getStatusColor = () => {
    switch (payment.status) {
      case "completed":
        return "bg-green-50 text-green-600 border-green-100";
      case "failed":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-yellow-50 text-yellow-600 border-yellow-100";
    }
  };

  // Get network display name
  const getNetworkName = (networkId?: string): string => {
    if (!networkId) return "Mobile Money";
    
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
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden animate-scale-in hover:shadow-md transition-shadow">
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{formatCurrency(payment.amount)}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(payment.date)}
            </p>
          </div>
          <div className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1 border",
            getStatusColor()
          )}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Network: {getNetworkName(payment.network)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Reference: {payment.reference}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContributionCard;
