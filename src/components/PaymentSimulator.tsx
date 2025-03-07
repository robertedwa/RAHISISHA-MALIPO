import { useState } from "react";
import { CreditCard, Check, X } from "lucide-react";
import { simulateMPesaPayment } from "@/utils/payments";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/validation";

interface PaymentSimulatorProps {
  onSuccess?: () => void;
}

const PaymentSimulator = ({ onSuccess }: PaymentSimulatorProps) => {
  const [amount, setAmount] = useState(10000);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    } else {
      setAmount(0);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) return;
    
    setProcessing(true);
    setStatus("idle");
    
    try {
      const result = await simulateMPesaPayment(amount, (success) => {
        setStatus(success ? "success" : "error");
        if (success && onSuccess) {
          onSuccess();
        }
      });
      
      // Reset form on success
      if (result && result.status === "completed") {
        // Keep the success state visible for a moment
        setTimeout(() => {
          setStatus("idle");
        }, 3000);
      }
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="bg-primary/5 p-4 flex items-center space-x-2 border-b">
        <CreditCard className="h-5 w-5 text-primary" />
        <h3 className="font-medium">M-Pesa Payment</h3>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-muted-foreground mb-1">
              Contribution Amount (TZS)
            </label>
            <input
              id="amount"
              type="number"
              min="1000"
              step="1000"
              value={amount}
              onChange={handleAmountChange}
              disabled={processing}
              className="input-primary w-full"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Minimum amount: 1,000 TZS
            </p>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={processing || amount <= 0}
              className={cn(
                "btn-primary w-full relative overflow-hidden",
                processing && "opacity-80"
              )}
            >
              <span className={cn(
                "flex items-center justify-center",
                processing && "invisible"
              )}>
                Pay {formatCurrency(amount)}
              </span>
              
              {processing && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
            </button>
          </div>
          
          {status !== "idle" && (
            <div className={cn(
              "rounded-md p-3 animate-scale-in",
              status === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            )}>
              <div className="flex items-center space-x-2">
                {status === "success" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
                <p className="font-medium">
                  {status === "success" 
                    ? "Payment successful! Your contribution has been received." 
                    : "Payment failed. Please try again."}
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentSimulator;
