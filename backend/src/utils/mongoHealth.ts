import mongoose from 'mongoose';

export async function ensureMongoConnection(retries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Check if mongoose is connected
      if (mongoose.connection.readyState === 1) {
        return true;
      }

      // If not connected, try to ping the database
      if (mongoose.connection.readyState === 0) {
        console.log(`⚠️ MongoDB not connected. Attempting connection... (${attempt}/${retries})`);
        
        // Force reconnection if needed
        if (global.mongooseConnection?.promise) {
          await global.mongooseConnection.promise;
        }
        
        // Verify connection with a simple ping
        await mongoose.connection.db?.admin().ping();
        return true;
      }

      // Connection is in connecting/disconnecting state, wait a bit
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ MongoDB health check failed (${attempt}/${retries}):`, error);
      
      if (attempt === retries) {
        return false;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  return false;
}

export function getConnectionStatus(): string {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
}

export async function closeConnection(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  // Clear global connection cache
  if (global.mongooseConnection) {
    global.mongooseConnection.promise = null;
    global.mongooseConnection.conn = null;
  }
}