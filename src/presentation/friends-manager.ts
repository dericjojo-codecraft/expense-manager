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
    {label: "By Phone Number", value: "2"}
]

const {ask,choose,close} = openInteractionManager();

const friendsController = new FriendsController();

const addFriendInterface = async () => {
    const newName = await ask('Enter friend name: ');
    const newEmail = await ask('Enter friend email: ', {validator: emailValidator});
    const newPhone = await ask('Enter friend phone number: ', {validator: phoneValidator});
    const openingBalance = await ask('Enter opening balance (+ve: they owe you, -ve: you owe them): ',{validator: numberValidator});

    const friend:iFriend = {
        id: Date.now().toString(),
        name: newName!,
        email: newEmail!,
        phone: newPhone!,
        balance: Number(openingBalance),
        isActive: true
    }

    friendsController.addFriendReferenceToRepository(friend);
}

const searchFriendInterface = async (choice: "1" | "2") => {
    if(choice === "1") {
        const email = await ask('Enter email to search: ');
        if(email && friendsController.checkEmailExists(email))  {
                await friendsController.searchFriendReferenceToRepository(email)
        } else {
             console.log("Email not valid.");
        }
    } else if(choice === "2") {
        const phone = await ask('Enter phone number to search: ');
        if(phone && friendsController.checkPhoneExists(phone)) {
            await friendsController.searchFriendReferenceToRepository(phone)
        } else {
             console.log("Phone number not valid.");
        }
    }
}

export const manageFriends = async () => {
    while(true) {
        const choice = await choose('\n\nWhat do you want to do?', options, false);

        switch(choice!.value){
            case '1': {
                await addFriendInterface();
                break;
            }
            case '2':
                const searchChoice = await choose("How do you want to search", searchOptions, false);
                if(searchChoice?.value === "1" || searchChoice?.value ===  "2") {
                    await searchFriendInterface(searchChoice.value);
                } else { console.log("Invalid input") };
                break;
            case '3':
                console.log('Updating friend...');
                break;
            case '5':
                console.log('Exiting...');
                close();
                return;
        }
    }
}