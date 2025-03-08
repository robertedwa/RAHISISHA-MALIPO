
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCurrentUser, User } from "@/utils/auth";
import { getUserPayments, Payment, getPaymentStats } from "@/utils/payments";

export const useReportData = () => {
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

  return {
    user,
    payments,
    stats,
    isGeneratingPdf,
    generatePdfReport
  };
};
