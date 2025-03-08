
// Simple mock SQL database implementation
// In a real app, this would be replaced with actual database connections

interface DbUser {
  id: string;
  phone: string;
  name: string;
  created_at: string;
  balance: number;
  password_hash?: string;
}

// Mock database tables
const tables = {
  users: [] as DbUser[],
  transactions: [] as any[],
};

// Initialize with demo data
const initDatabase = () => {
  // Only initialize if empty
  if (tables.users.length === 0) {
    tables.users.push({
      id: "1",
      phone: "255123456789",
      name: "Demo User",
      created_at: new Date().toISOString(),
      balance: 50000,
    });
  }
};

// Run a SQL-like query (very simplified mock)
export const executeQuery = (query: string, params: any[] = []): any[] => {
  // Initialize database if needed
  initDatabase();
  
  console.log('Executing query:', query, 'with params:', params);
  
  // Very basic SQL parser (DO NOT use in production - this is just a demo)
  if (query.toLowerCase().includes('select * from users')) {
    return [...tables.users];
  }
  
  if (query.toLowerCase().includes('select * from users where phone =')) {
    const phone = params[0];
    return tables.users.filter(user => user.phone === phone);
  }
  
  if (query.toLowerCase().includes('insert into users')) {
    const [id, phone, name, created_at] = params;
    const newUser: DbUser = {
      id,
      phone,
      name,
      created_at,
      balance: 0,
    };
    tables.users.push(newUser);
    return [newUser];
  }
  
  if (query.toLowerCase().includes('update users set balance')) {
    const balance = params[0];
    const userId = params[1];
    const userIndex = tables.users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      tables.users[userIndex].balance = balance;
      return [tables.users[userIndex]];
    }
    return [];
  }
  
  return [];
};

// Transaction management (simplified)
export const transaction = async (callback: () => Promise<any>) => {
  // In a real DB this would start a transaction
  try {
    const result = await callback();
    // In a real DB this would commit the transaction
    return result;
  } catch (error) {
    // In a real DB this would rollback the transaction
    console.error('Transaction failed:', error);
    throw error;
  }
};
