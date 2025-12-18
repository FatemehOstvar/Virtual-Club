const bcrypt = require('bcryptjs');
const { pool } = require('./pool');


async function addUser({username, firstName, lastName, plainPassword, roleName = 'spectator'}) {
  const hash = await bcrypt.hash(plainPassword, 10);
  const result = await pool.query(
    `INSERT INTO users (username,firstname, lastname, password, rolename)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, username, firstName, lastName, roleName`,
    [username,firstName, lastName, hash, roleName]
  );

  return result.rows[0];
}

// 2. Add a message
async function addMessage({ title, content}, user_id ) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

   const user = await findById(user_id);
    if (!user) throw new Error("User does not exist(dead error)");

    const msgRes = await client.query(
      `INSERT INTO messages (title, content)
       VALUES ($1, $2)
       RETURNING message_id`,
      [title, content]
    );

    const message_id = msgRes.rows[0].message_id;

    await client.query(
      `INSERT INTO users_messages (user_id, message_id)
       VALUES ($1, $2)`,
      [user_id, message_id]
    );

    await client.query("COMMIT");
    return { message_id };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


// 3. Delete a message
async function deleteMessage(messageId) {
  await pool.query(
    `DELETE FROM messages WHERE message_id = $1`,
    [messageId]
  );

  return { deleted: true };
}

// 4. View all message content
async function getAllMessageContent() {
  const result = await pool.query(
    `SELECT content FROM messages ORDER BY message_id ASC`
  );

  return result.rows;
}

// 5. View all message content *and date*
// async function getAllMessages() {
//   const result = await pool.query(
//     `SELECT message_id, content, creationDate, user_id
//        FROM messages JOIN users_messages ON messages.message_id = users_messages.message_id
//        ORDER BY creationDate DESC`
//   );
//
//   return result.rows;
// }

async function getAllMessages() {
  const result = await pool.query(
    `SELECT
    m.message_id,m.title, m.content,
    m.creationdate, u.firstname, u.lastname
    FROM users AS u
    JOIN users_messages AS um ON u.id = um.user_id JOIN messages AS m
    ON um.message_id = m.message_id
    ORDER BY m.creationdate ASC;`
  );
  return result.rows;
}
// 6. Upgrade role (spectator → user)
async function upgradeRole(userId) {
  const result = await pool.query(
    `UPDATE users
       SET roleName = 'user'
       WHERE id = $1 AND roleName = 'spectator'
       RETURNING id,username, firstName, lastName, roleName`,
    [userId]
  );

  return result.rows[0];
}

async function checkUserExists(username) {
    const result = await pool.query(
        `SELECT * FROM users WHERE username = $1`,[username]
    );
    return result.rows[0];
}

async function findById(id) {
    const result = await pool.query(
        `SELECT * FROM users WHERE id = $1`,[id]
    );
    return result.rows[0];
}

module.exports = {
  addUser,
  addMessage,
  deleteMessage,
  getAllMessageContent,
  getAllMessages,
  upgradeRole,findById,
    checkUserExists
};
