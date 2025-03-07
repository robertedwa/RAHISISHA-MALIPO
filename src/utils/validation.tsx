
// Validate Tanzanian phone number (255XXXXXXXXX)
export const isValidTanzanianPhone = (phone: string): boolean => {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, "");
  
  // Check if it starts with 255 and has 12 digits total
  return /^255\d{9}$/.test(cleanPhone);
};

// Format phone number for display (255XXXXXXXXX -> 255 XXX XXX XXX)
export const formatPhone = (phone: string): string => {
  if (!phone) return "";
  
  const cleanPhone = phone.replace(/\D/g, "");
  
  if (cleanPhone.length !== 12) return phone;
  
  // Format 255XXXXXXXXX as 255 XXX XXX XXX
  return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 9)} ${cleanPhone.slice(9)}`;
};

// Format currency (amount in TZS)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
