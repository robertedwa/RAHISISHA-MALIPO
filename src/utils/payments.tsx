
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
    // Create pending payment with unique ID
    const paymentId = Date.now().toString();
    const reference = generateReference();
    const pendingPayment: Payment = {
      id: paymentId,
      userId: user.id,
      amount,
      type: "contribution",
      status: "pending",
      date: new Date().toISOString(),
      reference,
      network
    };

    // Save pending payment to database
    executeQuery(
      "INSERT INTO transactions (id, user_id, amount, type, status, date, reference, network) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [paymentId, user.id, amount, "contribution", "pending", pendingPayment.date, reference, network]
    );
    
    // Simulate payment processing
    toast.info(`Processing ${getNetworkName(network)} payment...`);

    return new Promise((resolve) => {
      setTimeout(async () => {
        // 90% success rate for demo
        const success = Math.random() < 0.9;

        await transaction(async () => {
          if (success) {
            // Update payment status to completed
            executeQuery(
              "UPDATE transactions SET status = ? WHERE id = ?",
              ["completed", paymentId]
            );
            
            const completedPayment: Payment = { ...pendingPayment, status: "completed" };
            
            // Update user balance
            updateUserBalance(user.id, amount);

            toast.success(`${getNetworkName(network)} payment successful`);
            callback?.(true);
            resolve(completedPayment);
          } else {
            // Update payment status to failed
            executeQuery(
              "UPDATE transactions SET status = ? WHERE id = ?",
              ["failed", paymentId]
            );
            
            const failedPayment: Payment = { ...pendingPayment, status: "failed" };
            
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

// Get user payments from database
export const getUserPayments = (userId: string): Payment[] => {
  const transactions = executeQuery(
    "SELECT * FROM transactions WHERE user_id = ?",
    [userId]
  );
  
  return transactions.map((t: any) => ({
    id: t.id,
    userId: t.user_id,
    amount: t.amount,
    type: t.type,
    status: t.status,
    date: t.date,
    reference: t.reference,
    network: t.network
  }));
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
