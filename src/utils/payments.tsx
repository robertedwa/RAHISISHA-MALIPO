
import { toast } from "sonner";
import { updateUserBalance, getCurrentUser, User } from "./auth";
import { executeQuery, transaction } from "./database";

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  type: "contribution" | "withdrawal";
  status: "pending" | "completed" | "failed";
  date: string;
  reference: string;
  network?: string; // Track which payment network was used
}

// Generate reference number
const generateReference = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Initialize payments table in the database
const initPaymentsTable = () => {
  // In a real application, this would create the table if it doesn't exist
  console.log("Initializing payments table");
};

// Simulate Mobile Money payment (M-Pesa, Airtel Money, etc.)
export const simulateMPesaPayment = async (
  amount: number,
  callback?: (success: boolean) => void,
  network: string = "mpesa"
): Promise<Payment | null> => {
  const user = getCurrentUser();
  if (!user) {
    toast.error("You must be logged in to make a payment");
    callback?.(false);
    return null;
  }

  if (amount <= 0) {
    toast.error("Amount must be greater than 0");
    callback?.(false);
    return null;
  }

  // Get network display name
  const getNetworkName = (networkId: string): string => {
    const networks: Record<string, string> = {
      mpesa: "M-Pesa",
      tigopesa: "Tigo Pesa",
      airtelmoney: "Airtel Money",
      halopesa: "Halo Pesa",
      ezypesa: "Ezy Pesa"
    };
    return networks[networkId] || "Mobile Money";
  };

  try {
    initPaymentsTable();
    
    // Create pending payment
    const pendingPayment: Payment = {
      id: Date.now().toString(),
      userId: user.id,
      amount,
      type: "contribution",
      status: "pending",
      date: new Date().toISOString(),
      reference: generateReference(),
      network
    };

    // In a real app, we would save this to the database
    // For now we're just using our mock system
    
    // Simulate payment processing
    toast.info(`Processing ${getNetworkName(network)} payment...`);

    return new Promise((resolve) => {
      setTimeout(async () => {
        // 90% success rate for demo
        const success = Math.random() < 0.9;

        await transaction(async () => {
          if (success) {
            // Update payment status to completed
            const completedPayment: Payment = { ...pendingPayment, status: "completed" };
            
            // In a real DB, we would update the payment record
            
            // Update user balance
            updateUserBalance(user.id, amount);

            toast.success(`${getNetworkName(network)} payment successful`);
            callback?.(true);
            resolve(completedPayment);
          } else {
            // Update payment status to failed
            const failedPayment: Payment = { ...pendingPayment, status: "failed" };
            
            // In a real DB, we would update the payment record
            
            toast.error(`${getNetworkName(network)} payment failed. Please try again.`);
            callback?.(false);
            resolve(failedPayment);
          }
        });
      }, 2000); // 2 seconds delay to simulate processing
    });
  } catch (error) {
    console.error("Payment error:", error);
    toast.error("Payment processing error. Please try again.");
    callback?.(false);
    return null;
  }
};

// Get user payments (we'll simulate this for now)
export const getUserPayments = (userId: string): Payment[] => {
  // In a real app, this would query the database
  return []; // For demo, return empty array as we're not storing payments in our mock DB yet
};

// Get payment stats
export const getPaymentStats = (userId: string): {
  totalContributions: number;
  successfulPayments: number;
  failedPayments: number;
} => {
  const userPayments = getUserPayments(userId);
  
  const totalContributions = userPayments
    .filter(p => p.status === "completed" && p.type === "contribution")
    .reduce((sum, payment) => sum + payment.amount, 0);
    
  const successfulPayments = userPayments.filter(
    p => p.status === "completed"
  ).length;
  
  const failedPayments = userPayments.filter(
    p => p.status === "failed"
  ).length;
  
  return {
    totalContributions,
    successfulPayments,
    failedPayments
  };
};
