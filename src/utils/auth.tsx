import { toast } from "sonner";
import { isValidTanzanianPhone } from "./validation";
import { executeQuery } from "./database";

export interface User {
  id: string;
  phone: string;
  name: string;
  createdAt: string;
  balance: number;
}

// Register a new user
export const registerUser = (phone: string, name: string): User | null => {
  try {
    if (!isValidTanzanianPhone(phone)) {
      toast.error("Please enter a valid Tanzanian phone number");
      return null;
    }

    if (!name || name.trim().length < 2) {
      toast.error("Please enter a valid name (at least 2 characters)");
      return null;
    }

    // Check if user already exists
    const existingUsers = executeQuery(
      "SELECT * FROM users WHERE phone = ?", 
      [phone]
    );
    
    if (existingUsers.length > 0) {
      toast.error("Phone number already registered");
      return null;
    }

    // Generate a new ID
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    
    // Insert new user
    const result = executeQuery(
      "INSERT INTO users (id, phone, name, created_at, balance) VALUES (?, ?, ?, ?, ?)",
      [id, phone, name, createdAt, 0]
    );
    
    if (!result || result.length === 0) {
      toast.error("Registration failed");
      return null;
    }
    
    const newUser: User = {
      id,
      phone,
      name,
      createdAt,
      balance: 0
    };
    
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(newUser));
    
    toast.success("Registration successful");
    return newUser;
  } catch (error) {
    console.error("Registration error:", error);
    toast.error("Registration failed. Please try again.");
    return null;
  }
};

// Login user
export const loginUser = (phone: string): User | null => {
  try {
    if (!isValidTanzanianPhone(phone)) {
      toast.error("Please enter a valid Tanzanian phone number");
      return null;
    }

    // Find user
    const userArray = executeQuery(
      "SELECT * FROM users WHERE phone = ?", 
      [phone]
    );
    
    if (userArray.length === 0) {
      toast.error("Phone number not registered");
      return null;
    }
    
    const dbUser = userArray[0];
    
    const user: User = {
      id: dbUser.id,
      phone: dbUser.phone,
      name: dbUser.name,
      createdAt: dbUser.created_at,
      balance: dbUser.balance || 0,
    };
    
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    
    toast.success("Login successful");
    return user;
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Login failed. Please try again.");
    return null;
  }
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
  try {
    const userArray = executeQuery(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );
    
    if (userArray.length === 0) {
      return null;
    }
    
    const dbUser = userArray[0];
    const newBalance = dbUser.balance + amount;
    
    const result = executeQuery(
      "UPDATE users SET balance = ? WHERE id = ?",
      [newBalance, userId]
    );
    
    if (!result || result.length === 0) {
      return null;
    }
    
    const updatedUser: User = {
      id: userId,
      phone: dbUser.phone,
      name: dbUser.name,
      createdAt: dbUser.created_at,
      balance: newBalance
    };
    
    // Update localStorage if it's the current user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    
    return updatedUser;
  } catch (error) {
    console.error("Update balance error:", error);
    return null;
  }
};
