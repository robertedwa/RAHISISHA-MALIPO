
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PhoneInput from "@/components/PhoneInput";
import { loginUser } from "@/utils/auth";
import { toast } from "sonner";

interface IndexProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Index = ({ setIsAuthenticated }: IndexProps) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Attempting to log in with phone:", phone);
      const user = loginUser(phone);
      
      if (user) {
        console.log("Login successful, setting authenticated state");
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        console.log("Login failed, user is null");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-slide-up">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Sign In</h2>
          <p className="text-muted-foreground">
            Enter your phone number to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <PhoneInput
              value={phone}
              onChange={setPhone}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Format: 255XXXXXXXXX (Tanzanian phone number)
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
