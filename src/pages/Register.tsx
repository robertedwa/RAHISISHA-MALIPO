
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ArrowRight } from "lucide-react";
import PhoneInput from "@/components/PhoneInput";
import { registerUser } from "@/utils/auth";
import { toast } from "sonner";

interface RegisterProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Register = ({ setIsAuthenticated }: RegisterProps) => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting to register user:", { name, phone });
      // Attempt to register user
      const user = registerUser(phone, name);
      
      if (user) {
        console.log("Registration successful, setting authenticated state");
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        console.log("Registration failed, user is null");
      }
    } catch (error) {
      console.error("Unexpected error during registration:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row-reverse">
        {/* Left side - Hero */}
        <div className="flex-1 bg-primary/5 flex items-center justify-center p-8 md:p-16">
          <div className="max-w-md space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Join TanzaPay today
              </h1>
              <p className="text-lg text-muted-foreground">
                Create your account to start making contributions and managing your payments.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border shadow-sm">
                <h3 className="font-medium">Getting Started</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Register with your Tanzanian phone number</li>
                  <li>Make your first contribution via M-Pesa</li>
                  <li>Track your contribution history</li>
                  <li>View detailed reports of your activity</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Registration form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-md space-y-6 animate-slide-up">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Create Account</h2>
              <p className="text-muted-foreground">
                Enter your details to register
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your name"
                  disabled={loading}
                />
              </div>

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
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
