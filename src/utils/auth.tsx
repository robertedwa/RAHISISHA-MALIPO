
import { toast } from "sonner";
import { isValidTanzanianPhone } from "./validation";

export interface User {
  id: string;
  phone: string;
  name: string;
  createdAt: string;
  balance: number;
}

// Mock database for demo
let users: User[] = [
  {
    id: "1",
    phone: "255123456789",
    name: "Demo User",
    createdAt: new Date().toISOString(),
    balance: 50000,
  },
];

// Register a new user
export const registerUser = (phone: string, name: string): User | null => {
  if (!isValidTanzanianPhone(phone)) {
    toast.error("Please enter a valid Tanzanian phone number");
    return null;
  }

  if (!name || name.trim().length < 2) {
    toast.error("Please enter a valid name");
    return null;
  }

  // Check if user already exists
  const existingUser = users.find((user) => user.phone === phone);
  if (existingUser) {
    toast.error("Phone number already registered");
    return null;
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    phone,
    name,
    createdAt: new Date().toISOString(),
    balance: 0,
  };

  // Add to mock database
  users = [...users, newUser];
  
  // Save to localStorage
  localStorage.setItem("user", JSON.stringify(newUser));
  
  toast.success("Registration successful");
  return newUser;
};

// Login user
export const loginUser = (phone: string): User | null => {
  if (!isValidTanzanianPhone(phone)) {
    toast.error("Please enter a valid Tanzanian phone number");
    return null;
  }

  // Find user
  const user = users.find((user) => user.phone === phone);
  if (!user) {
    toast.error("Phone number not registered");
    return null;
  }

  // Save to localStorage
  localStorage.setItem("user", JSON.stringify(user));
  
  toast.success("Login successful");
  return user;
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem("user");
  toast.success("Logged out successfully");
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

// Update user balance
export const updateUserBalance = (userId: string, amount: number): User | null => {
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) return null;
  
  // Update user balance
  const updatedUser = { 
    ...users[userIndex], 
    balance: users[userIndex].balance + amount 
  };
  
  // Update mock database
  users = [
    ...users.slice(0, userIndex),
    updatedUser,
    ...users.slice(userIndex + 1)
  ];
  
  // Update localStorage if it's the current user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
  
  return updatedUser;
};
