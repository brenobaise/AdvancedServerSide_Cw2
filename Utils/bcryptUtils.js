import bcrypt from "bcrypt";

export async function genHashPassword(target, rounds = 10) {
  try {
    const hash = await bcrypt.hash(target, rounds);
    return hash;
  } catch (err) {
    console.error("Error hashing password", err);
  }
}

export async function verifyPassword(value, target) {
  try {
    const isValid = await bcrypt.compare(value, target);
    return isValid;
  } catch (err) {
    console.error(err);
    return false;
  }
}
