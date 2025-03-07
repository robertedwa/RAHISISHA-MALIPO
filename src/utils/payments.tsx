
import { toast } from "sonner";
import { updateUserBalance, getCurrentUser, User } from "./auth";

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  type: "contribution" | "withdrawal";
  status: "pending" | "completed" | "failed";
  date: string;
  reference: string;
  network?: string; // Add network field to track which payment network was used
}

// Mock payments database
let payments: Payment[] = [];

// Generate reference number
const generateReference = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Simulate Mobile Money payment (formerly M-Pesa only)
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

  // Add to payments
  payments = [...payments, pendingPayment];

  // Simulate payment processing
  toast.info(`Processing ${getNetworkName(network)} payment...`);

  return new Promise((resolve) => {
    setTimeout(() => {
      // 90% success rate for demo
      const success = Math.random() < 0.9;

      if (success) {
        // Update payment status
        const completedPayment: Payment = { ...pendingPayment, status: "completed" };
        payments = payments.map((p) =>
          p.id === pendingPayment.id ? completedPayment : p
        );

        // Update user balance
        updateUserBalance(user.id, amount);

        toast.success(`${getNetworkName(network)} payment successful`);
        callback?.(true);
        resolve(completedPayment);
      } else {
        // Update payment status
        const failedPayment: Payment = { ...pendingPayment, status: "failed" };
        payments = payments.map((p) =>
          p.id === pendingPayment.id ? failedPayment : p
        );

        toast.error(`${getNetworkName(network)} payment failed. Please try again.`);
        callback?.(false);
        resolve(failedPayment);
      }
    }, 2000); // 2 seconds delay to simulate processing
  });
};

// Get user payments
export const getUserPayments = (userId: string): Payment[] => {
  return payments.filter((payment) => payment.userId === userId);
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
