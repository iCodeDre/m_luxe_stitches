import sql from "./db";

export async function createUser(displayName, email, password, phoneNumber) {
  const [user] = await sql`
    INSERT INTO users (display_name, email, password, phone_number)
    VALUES (${displayName}, ${email}, ${password}, ${phoneNumber})
    RETURNING id
  `;

  return user.id;
}

export async function getUserByEmail(email) {
  const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;

  return user;
}
export async function getUserPassword(userId) {
  const [user] = await sql`SELECT password FROM users WHERE id = ${userId}`;
  const storedPassword = user.password;

  return storedPassword;
}

export async function updateUserNames(userDetails) {

  const [user] = await sql`
  UPDATE users
  SET first_name = ${userDetails.firstName},
  last_name = ${userDetails.lastName},
  display_name = ${userDetails.displayName},
  email = ${userDetails.email},
  phone_number = ${userDetails.phoneNumber}
  WHERE id = ${userDetails.userId}
  RETURNING id, first_name, last_name, display_name, email, phone_number, role
  `;

  return user;
}
export async function updateUserPassword(userId, hashedNewPassword) {
  const [user] = await sql`
  UPDATE users
  SET password = ${hashedNewPassword}
  WHERE id = ${userId}
  `;

  return;
}
