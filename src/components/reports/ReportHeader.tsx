
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportHeaderProps {
  isGeneratingPdf: boolean;
  generatePdfReport: () => void;
}

const ReportHeader = ({ isGeneratingPdf, generatePdfReport }: ReportHeaderProps) => {
  return (
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
  );
};

export default ReportHeader;
