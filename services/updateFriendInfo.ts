import inquirer from 'inquirer';
import { readFile, writeFile } from 'node:fs/promises';
import { filePath } from '../index.js';
import type { User } from './createFriend.js';
import { ensureFile, questions } from './createFriend.js';

export default async function updateFriendInfo() {
    await ensureFile();
    
    try {
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

        const existingUser = users.find(u => u.email === newUser.email);

        if(existingUser && existingUser.active) {
            existingUser.name = newUser.name;
            existingUser.phone = newUser.phone;
            console.log(`\nUpdated existing user: ${existingUser.name}`);
        } else {
            console.log(`\nUser not found`);
            return;
        }

        data.Users = users;
        await writeFile(filePath, JSON.stringify(data, null, 2));
    } catch(error) {
        console.error('Error during updating process:', error);
    }
}