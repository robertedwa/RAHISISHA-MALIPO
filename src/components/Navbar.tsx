
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, CreditCard, PieChart, LogOut, Menu, X } from "lucide-react";
import { logoutUser } from "@/utils/auth";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="h-5 w-5" />
    },
    {
      name: "Contribute",
      path: "/contribute",
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <PieChart className="h-5 w-5" />
    }
  ];

  return (
    <nav className={cn(
      "w-full py-3 fixed top-0 left-0 right-0 z-50 border-b transition-all duration-200 ease-in-out",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "glass border-border/50"
    )}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/dashboard" className="font-bold text-lg tracking-tight">
          TanzaPay
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center space-x-1 font-medium transition-colors py-1",
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-border/50 animate-slide-down shadow-md">
          <div className="container mx-auto py-3 px-4 flex flex-col space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center space-x-2 py-2.5 px-3 rounded-md",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center space-x-2 py-2.5 px-3 rounded-md text-foreground hover:bg-red-50 hover:text-red-600 w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
