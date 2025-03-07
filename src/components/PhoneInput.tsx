
import { useState } from "react";
import { Phone } from "lucide-react";
import { isValidTanzanianPhone, formatPhone } from "@/utils/validation";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

const PhoneInput = ({
  value,
  onChange,
  className,
  placeholder = "255XXXXXXXXX",
  required = false,
}: PhoneInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digit characters
    const cleanValue = e.target.value.replace(/\D/g, "");
    onChange(cleanValue);
  };

  const isValid = !isTouched || isValidTanzanianPhone(value);

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center border rounded-md transition-all overflow-hidden",
          isFocused
            ? "border-primary shadow-sm ring-1 ring-primary/30"
            : "border-input",
          !isValid && "border-destructive",
          className
        )}
      >
        <div className="flex items-center px-3 py-2 text-muted-foreground bg-muted/50">
          <Phone className="h-4 w-4" />
        </div>
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setIsTouched(true);
          }}
          placeholder={placeholder}
          required={required}
          className="flex-1 bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={!isValid}
        />
      </div>
      
      {isTouched && !isValid && (
        <p className="text-destructive text-sm mt-1 animate-slide-down">
          Please enter a valid Tanzanian phone number (255XXXXXXXXX)
        </p>
      )}
      
      {value && isValid && value.length > 3 && (
        <p className="text-muted-foreground text-sm mt-1">
          {formatPhone(value)}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
