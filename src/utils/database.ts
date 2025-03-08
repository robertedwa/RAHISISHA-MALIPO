
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
    
    // Add some sample transactions for demo
    tables.transactions.push(
      {
        id: "t1",
        user_id: "1",
        amount: 15000,
        type: "contribution",
        status: "completed",
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        reference: "REF123456",
        network: "mpesa"
      },
      {
        id: "t2",
        user_id: "1",
        amount: 20000,
        type: "contribution",
        status: "completed",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        reference: "REF789012",
        network: "airtelmoney"
      },
      {
        id: "t3",
        user_id: "1",
        amount: 5000,
        type: "contribution",
        status: "failed",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        reference: "REF345678",
        network: "tigopesa"
      },
      {
        id: "t4",
        user_id: "1",
        amount: 10000,
        type: "contribution",
        status: "completed",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        reference: "REF901234",
        network: "mpesa"
      }
    );
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
