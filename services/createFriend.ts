import inquirer from 'inquirer';
import { readFile, writeFile, access } from 'node:fs/promises';
import { filePath } from '../index.js';
import { constants } from 'node:fs';

export const questions = [
  {
    type: 'input', 
    name: 'name',
    message: 'Name*: ',
    validate: validateName
  },
  {
    type: 'number',
    name: 'phone',
    message: 'Phone Number: ',
    validate: validatePhone
  },
  {
    type: 'input',
    name: 'email',
    message: 'Email: ',
    validate: validateEmail
  },
];

export type User = {
  name: string,
  phone: number | null,
  email: string | null,
  active: boolean
}


export async function ensureFile() {
  try {
    await access(filePath, constants.F_OK);
  } catch {
    await writeFile(filePath, JSON.stringify([], null, 2));
  }
}

export function validateName(name: string) {
  if(typeof name === 'string' && name.trim().length > 0) {
    return true;
  }
  return false;
}

export function validatePhone(number: Number) {
  if(typeof number === "number" && number.toString().length === 9) {
    return true;
  }
  return false;
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(email);
}

export default async function createFriend() {
  try {

    await ensureFile();

    const answers = await inquirer.prompt(questions);

    const newUser: User = {
      name: answers.name,
      phone: answers.phone,
      email: answers.email,
      active: true
    };

    const userDataFromFile = await readFile(filePath, 'utf8');
    const data = JSON.parse(userDataFromFile);
    const users = data.Users as User[];

    // check if user data exists
    const existingUser = users.find(u => u.email === newUser.email);

    if(existingUser) {
      if(!existingUser.active) {
        existingUser.active = true;
        existingUser.name = newUser.name;
        existingUser.phone = newUser.phone;
        console.log(`\nReactivated existing user: ${existingUser.name}`);
      } else {
        console.log(`\nUser already exists`);
        return;
      }
    } else {
      users.push(newUser);
      console.log('\nUser Saved Successfully:');
    }

    await writeFile(filePath, JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error during prompt:', error);
  }
}