import 'dotenv/config';
import { dbUtils } from './src/api/config/database';

async function testUpdate() {
  try {
    const id = 'EMP001';
    
    console.log("Attempting SQL update for EMP001...");
    
    await dbUtils.execute(
      `UPDATE employees SET 
        password_changed_at = CURRENT_TIMESTAMP,
        first_login = 0,
        must_change_password = 0,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [id]
    );

    console.log("✅ Update successful!");
  } catch (error: any) {
    console.error("❌ Update failed:");
    console.error(error.message);
  }
}

testUpdate();
