import enquirer from 'enquirer';
import { readFile, writeFile } from 'node:fs/promises';
import { filePath } from '../index.js';
import type { User } from './createFriend.js';
import { ensureFile } from './createFriend.js';

const emailQuestion = {
    type: 'input', 
    name: 'email' as const, 
    message: 'Enter Email:' 
};

const phoneQuestion = { 
    type: 'input', 
    name: 'phone' as const, 
    message: 'Enter Phone Number:' 
};


export default async function removeFriend() {
    await ensureFile();
    
    try {
        const userDataFromFile = await readFile(filePath, 'utf8');
        const data = JSON.parse(userDataFromFile);
        const users = data.Users as User[];

        // decide how to remove
        const { Select } = enquirer as any;
        const menu = new Select({
            name: 'choice',
            message: 'How would you like to search?',
            choices: ['By Email', 'By Phone']
        });

        const choice = await menu.run();
        let foundUser: User | undefined;

        if (choice === 'By Email') {
            const answer = await enquirer.prompt<Record<string, string>>(emailQuestion);
            const searchTerm = answer.email?.trim().toLowerCase();
            foundUser = users.find(u => u.email?.trim().toLowerCase() === searchTerm);
        } 
        else if (choice === 'By Phone') {
            const answer = await enquirer.prompt<Record<string, string>>(phoneQuestion);
            const searchTerm = String(answer.phone).trim();
            foundUser = users.find(u => String(u.phone).trim() === searchTerm);
        }

        if(foundUser && foundUser.active === true) {
            foundUser.active = false;
            await writeFile(filePath, JSON.stringify(data, null, 2));
        } else {
            console.log("\nFriend not found.\n");
        }
        
    } catch(error) {
        console.error('Error during removal process:', error);
    }
}