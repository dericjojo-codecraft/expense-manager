import { numberValidator } from "../core/validators/number.validator.js";
import { openInteractionManager, type Choice } from "./interaction-manager.js";
import { FriendsController } from '../controller/friends.controller.js';
import type { iFriend } from "../models/friend.model.js";
import emailValidator from "../core/validators/email.validator.js";
import phoneValidator from "../core/validators/phone.validator.js";

const options: Choice[] = [
  { label: "Add Friend",    value: "1" },
  { label: "Search Friend", value: "2" },
  { label: "Update Friend", value: "3" },
  { label: "Remove Friend", value: "4" },
  { label: "Exit",          value: "5" },
];

const searchOptions: Choice[] = [
    {label: "By Email",        value: "1"},
    {label: "By Phone Number", value: "2"},
    {label: "Show all",        value: "3"}
]

const removeOrUpdateOptions: Choice[] = [
    {label: "By Email",        value: "1"},
    {label: "By Phone Number", value: "2"}
]

const {ask, choose, close} = openInteractionManager();

const friendsController = new FriendsController();

const addFriendInterface = async () => {
    const newName = await ask('Enter friend name*: ');
    const newEmail = await ask('Enter friend email: ', {validator: emailValidator});
    const newPhone = await ask('Enter friend phone number: ', {validator: phoneValidator});
    const openingBalance = await ask('Enter opening balance (+ve: they owe you, -ve: you owe them): ',{validator: numberValidator});

    const friend:iFriend = {
        id: Date.now(),
        name: newName!,
        email: newEmail!,
        phone: newPhone!,
        balance: Number(openingBalance),
        isActive: true
    }

    const result = await friendsController.addFriendReferenceToRepository(friend);
    console.log( result.message  );
}

const searchFriendInterface = async (choice: "1" | "2" | "3") => {
    if(choice === "1") {
        const email = await ask('Enter email to search: ');
        if(email && await friendsController.checkEmailExists(email))  {
                await friendsController.searchFriendReferenceToRepository(email)
        } else {
             console.log("Presentation: Email not valid.");
        }
    } else if(choice === "2") {
        const phone = await ask('Enter phone number to search: ');
        if(phone && await friendsController.checkPhoneExists(phone)) {
            await friendsController.searchFriendReferenceToRepository(phone)
        } else {
             console.log("Phone number not valid.");
        }
    } else if(choice === "3") {
        await friendsController.searchFriendReferenceToRepository();
    }
}

const updateFriendInterface = async (choice: "1" | "2") => {
    
    if(choice === "1") {
        const email = await ask('Enter email to remove: ');
        if(email && await friendsController.checkEmailExists(email))  {
            const newName = await ask('Enter friend name: ', {defaultAnswer: "need to keep same name"/**no change */});
            const newPhone = await ask('Enter friend phone number: ', {defaultAnswer: "123456789", validator: phoneValidator});
            const openingBalance = await ask('Enter opening balance (+ve: they owe you, -ve: you owe them): ', {defaultAnswer: "0", validator: numberValidator});

            const friend:iFriend = {
                id: Date.now(),
                email: email,
                name: newName!,
                phone: Number(newPhone!),
                balance: Number(openingBalance),
                isActive: true
            }
            
            await friendsController.updateFriendInterface(email, friend)
        } else {
             console.log("Presentation: Email not valid.");
        }
    } else if(choice === "2") {
        const phone = await ask('Enter phone number to remove: ');
        if(phone && await friendsController.checkPhoneExists(phone)) {
            const newName = await ask('Enter friend name: ', {defaultAnswer: "need to keep same name"/**no change */});
            const newEmail = await ask('Enter friend email: ', {defaultAnswer: "no change", validator: emailValidator});
            const openingBalance = await ask('Enter opening balance (+ve: they owe you, -ve: you owe them): ', {defaultAnswer: "0", validator: numberValidator});

            const friend:iFriend = {
                id: Date.now(),
                name: newName!,
                email: newEmail!,
                phone: Number(phone),
                balance: Number(openingBalance),
                isActive: true
            }

            await friendsController.updateFriendInterface(phone, friend)
        } else {
             console.log("Presentation: Phone number not valid.");
        }
    }
}

const removeFriendInterface = async (choice: "1" | "2") => {
    let result;
    if(choice === "1") {
        const email = await ask('Enter email to remove: ');
        if(email && await friendsController.checkEmailExists(email))  {
                result = await friendsController.removeFriendReferenceToRepository(email)
        } else {
             console.log("Presentation: Email not valid.");
             return;
        }
    } else if(choice === "2") {
        const phone = await ask('Enter phone number to remove: ');
        if(phone && await friendsController.checkPhoneExists(phone)) {
            result = await friendsController.removeFriendReferenceToRepository(phone)
        } else {
            console.log("Presentation: Phone number not valid.");
            return;
        }
    }
    
    if(result) {
        console.log( result.message  );
    }
}

export const manageFriends = async () => {
    while(true) {
        const choice = await choose('\n\nWhat do you want to do?', options, false);
        if (!choice) {
            console.log("Presentation: Invalid selection. Please try again.");
        }

        switch(choice!.value){
            case '1': {
                await addFriendInterface();
                break;
            }
            case '2': {
                const searchChoice = await choose("How do you want to search", searchOptions, false);
                if(searchChoice?.value === "1" || searchChoice?.value ===  "2" || searchChoice?.value ===  "3") {
                    await searchFriendInterface(searchChoice.value);
                } else { console.log("Presentation: Invalid input") };
                break;
            }
            case '3': {
                const updateChoice = await choose("How do you want to update: ", removeOrUpdateOptions, false);
                if(updateChoice?.value === "1" || updateChoice?.value ===  "2") {
                    await updateFriendInterface(updateChoice.value);
                } else { console.log("Presentation: Invalid input") };
                break;
            }
            case '4': {
                const removeChoice = await choose("How do you want to remove: ", removeOrUpdateOptions, false);
                if(removeChoice?.value === "1" || removeChoice?.value ===  "2") {
                    await removeFriendInterface(removeChoice.value);
                } else { console.log("Presentation: Invalid input") };
                break;
            }
            case '5': {
                console.log('Exiting...');
                close();
                await friendsController.closeDBConnection();
                return;
            }
        }
    }
}