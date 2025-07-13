const pool = require("./pool");
async function addUser(username, password) {
  await pool.query("INSERT INTO users(username,password) VALUES($1,$2)", [
    username,
    password,
  ]);
  await pool.query("INSERT INTO membership(username) VALUES($1)", [username]);
}

async function checkMemberShip(username) {
  const { rows } = await pool.query(
    "SELECT status FROM membership WHERE username = $1 ",
    [username]
  );
  if (rows[0].status === false) {
    return 0;
  } else {
    return 1;
  }
}

async function checkUser(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows.length;
}
async function addMessage(username, message) {
  await pool.query("INSERT INTO messages(username,message) VALUES($1,$2)", [
    username,
    message,
  ]);
}

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function makeMember(username) {
  await pool.query(
    "UPDATE membership SET status = NOT status WHERE username = $1",
    [username]
  );
}

async function checkAdmin(username) {
  const { rows } = await pool.query("SELECT * FROM admin where username = $1", [
    username,
  ]);
  return rows.length;
}

async function deleteMessage(messageid) {
  await pool.query("DELETE FROM messages where id = $1", [messageid]);
}

module.exports = {
  addUser,
  checkMemberShip,
  addMessage,
  getAllMessages,
  makeMember,
  checkUser,
  checkAdmin,
  deleteMessage,
};
