
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
    console.log("Attempting to register user:", { phone, name });
    
    if (!isValidTanzanianPhone(phone)) {
      toast.error("Please enter a valid Tanzanian phone number");
      console.error("Invalid phone number format:", phone);
      return null;
    }

    if (!name || name.trim().length < 2) {
      toast.error("Please enter a valid name (at least 2 characters)");
      console.error("Invalid name (too short):", name);
      return null;
    }

    // Check if user already exists
    const existingUsers = executeQuery(
      "SELECT * FROM users WHERE phone = ?", 
      [phone]
    );
    
    if (existingUsers.length > 0) {
      toast.error("Phone number already registered");
      console.error("Phone number already registered:", phone);
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
      console.error("Database insertion failed for user registration");
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
    try {
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
      // Continue anyway, as this might just be a localStorage issue
    }
    
    toast.success("Registration successful");
    console.log("User registered successfully:", newUser.id);
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
    console.log("Attempting to login user with phone:", phone);
    
    if (!isValidTanzanianPhone(phone)) {
      toast.error("Please enter a valid Tanzanian phone number");
      console.error("Invalid phone number format for login:", phone);
      return null;
    }

    // Find user
    const userArray = executeQuery(
      "SELECT * FROM users WHERE phone = ?", 
      [phone]
    );
    
    if (userArray.length === 0) {
      toast.error("Phone number not registered");
      console.error("Phone number not found in database:", phone);
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
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user to localStorage during login:", error);
      // Continue anyway, as this might just be a localStorage issue
    }
    
    toast.success("Login successful");
    console.log("User logged in successfully:", user.id);
    return user;
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Login failed. Please try again.");
    return null;
  }
};

// Logout user
export const logoutUser = (): void => {
  try {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error during logout:", error);
    toast.error("Logout failed. Please try again.");
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  try {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      console.log("No user found in localStorage");
      return null;
    }
    
    const user = JSON.parse(userJson) as User;
    console.log("Retrieved current user from localStorage:", user.id);
    return user;
  } catch (error) {
    console.error("Error retrieving user from localStorage:", error);
    try {
      localStorage.removeItem("user");
    } catch (localStorageError) {
      console.error("Error removing invalid user data:", localStorageError);
    }
    return null;
  }
};

// Update user balance
export const updateUserBalance = (userId: string, amount: number): User | null => {
  try {
    console.log("Updating user balance:", { userId, amount });
    
    const userArray = executeQuery(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );
    
    if (userArray.length === 0) {
      console.error("User not found for balance update:", userId);
      return null;
    }
    
    const dbUser = userArray[0];
    const newBalance = dbUser.balance + amount;
    
    const result = executeQuery(
      "UPDATE users SET balance = ? WHERE id = ?",
      [newBalance, userId]
    );
    
    if (!result || result.length === 0) {
      console.error("Database update failed for user balance");
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
    try {
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error updating user in localStorage:", error);
      // Continue anyway, as this might just be a localStorage issue
    }
    
    console.log("User balance updated successfully:", { userId, newBalance });
    return updatedUser;
  } catch (error) {
    console.error("Update balance error:", error);
    return null;
  }
};
