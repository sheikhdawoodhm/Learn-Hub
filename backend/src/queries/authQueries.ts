import pool from "../dbSetup/db";


export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
};


export const createUser = async (name: string, email: string, password: string, role: string) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, COALESCE($4, 'student'))
     RETURNING id, name, email, role`,
    [name, email, password, role]
  );
  return result.rows[0];
  }

export const createOAuthUser = async (name: string, email: string, password: string, role: string) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, COALESCE($4, 'student'))
     ON CONFLICT (email)
     DO UPDATE SET
       name = EXCLUDED.name,
       updated_at = CURRENT_TIMESTAMP
     RETURNING id, name, email, role`,
    [name, email, password, role]
  );
  return result.rows[0];
};

export const createSession = async (sessionId: string, userId: number, createdAt: number, expiresAt: number) => {
  await pool.query(
    `INSERT INTO user_sessions (session_id, user_id, created_at, expires_at) VALUES ($1, $2, $3, $4)`,
    [sessionId, userId, createdAt, expiresAt]
  );
};

export const deleteSession = async (sessionId: string) => {
  await pool.query(`DELETE FROM user_sessions WHERE session_id = $1`, [sessionId]);
};

export const findSession = async (sessionId: string) => {
  const result = await pool.query(`SELECT * FROM user_sessions WHERE session_id = $1`, [sessionId]);
  return result.rows[0];
};
