// src/utils/auth.ts
import * as bcrypt from 'bcryptjs';

// export async function hashPassword(password: string) {
//     const hashedPassword = await bcrypt.hash(password, 8);
//     return hashedPassword;
// }

export async function comparePassword(password: string, hashedPassword: string) {
    return password === hashedPassword;
}

export function generatePassword(nik:any, birthdate: string){
    return String(nik) + birthdate.slice(2, 4) + birthdate.slice(5, 7) + birthdate.slice(8, 10);
}