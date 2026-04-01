import type { Choice } from './interaction-manager.js';
import { openInteractionManager } from './interaction-manager.js';

const { ask, choose, close } = openInteractionManager();
const addFriend = async () => {
    const name = ask("Enter friend's name: ");
    const email = ask("Enter friend's email: ");
    const phone = ask("Enter friend's phone: ");
    const openingBalance = ask("Enter an Opening Balance: ");


}

const options: Choice[] = [
    { label: "Add Friend",    value: 1 },
    { label: "Search Friend", value: 2 },
    { label: "Update Friend", value: 3 },
    { label: "Remove Friend", value: 4 },
    { label: "Exit",          value: 5 },
]

export const manageFriends = async () => {
    while(true) {
        const choice = await choose('What do you want to do?', options, false);

        switch(choice!.value) {
            case '1': {
                addFriend();
                break;
            }
            case '2': {
                console.log("Searching friend...");
                break;
            }
            case '3': {
                console.log("Updated friend...");
                break;
            }
            case '4': {
                console.log("Removed friend");
                break;
            }
            case '5': {
                console.log("Exited");
                close();
                return;
            }
        }
    }
}