
import Navbar from "@/components/Navbar";
import { useReportData } from "@/hooks/useReportData";
import ReportHeader from "@/components/reports/ReportHeader";
import StatCards from "@/components/reports/StatCards";
import TransactionTable from "@/components/reports/TransactionTable";

const Reports = () => {
  const { 
    user, 
    payments, 
    stats, 
    isGeneratingPdf, 
    generatePdfReport 
  } = useReportData();

  if (!user) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="animate-slide-up">
            <ReportHeader 
              isGeneratingPdf={isGeneratingPdf} 
              generatePdfReport={generatePdfReport}
            />
            
            <StatCards stats={stats} />
            
            <TransactionTable 
              payments={payments}
              isGeneratingPdf={isGeneratingPdf}
              generatePdfReport={generatePdfReport}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
