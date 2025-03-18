
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

interface DbTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "contribution" | "withdrawal";
  status: "pending" | "completed" | "failed";
  date: string;
  reference: string;
  network?: string;
}

// Mock database tables
const tables = {
  users: [] as DbUser[],
  transactions: [] as DbTransaction[],
};

// Initialize database (no demo data for production)
const initDatabase = () => {
  console.log("Production database initialized");
  // No demo data for production environment
};

// Run a SQL-like query (very simplified mock)
export const executeQuery = (query: string, params: any[] = []): any[] => {
  // Make sure database is initialized
  if (tables.users.length === 0) {
    initDatabase();
  }
  
  console.log('Executing query:', query, 'with params:', params);
  
  try {
    // Very basic SQL parser (DO NOT use in production - this is just a demo)
    if (query.toLowerCase().includes('select * from users')) {
      return [...tables.users];
    }
    
    if (query.toLowerCase().includes('select * from users where phone =')) {
      const phone = params[0];
      return tables.users.filter(user => user.phone === phone);
    }
    
    if (query.toLowerCase().includes('select * from users where id =')) {
      const id = params[0];
      return tables.users.filter(user => user.id === id);
    }
    
    if (query.toLowerCase().includes('insert into users')) {
      const [id, phone, name, created_at, balance] = params;
      const newUser: DbUser = {
        id,
        phone,
        name,
        created_at,
        balance: balance || 0,
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
    
    // Transactions related queries
    if (query.toLowerCase().includes('select * from transactions where user_id =')) {
      const userId = params[0];
      return [...tables.transactions.filter(t => t.user_id === userId)];
    }
    
    if (query.toLowerCase().includes('insert into transactions')) {
      const [id, userId, amount, type, status, date, reference, network] = params;
      const newTransaction: DbTransaction = {
        id,
        user_id: userId,
        amount,
        type,
        status,
        date,
        reference,
        network
      };
      tables.transactions.push(newTransaction);
      return [newTransaction];
    }
    
    if (query.toLowerCase().includes('update transactions set status')) {
      const status = params[0];
      const transactionId = params[1];
      const transactionIndex = tables.transactions.findIndex(t => t.id === transactionId);
      
      if (transactionIndex !== -1) {
        tables.transactions[transactionIndex].status = status;
        return [tables.transactions[transactionIndex]];
      }
      return [];
    }
    
    return [];
  } catch (error) {
    console.error('Database query error:', error);
    return [];
  }
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
