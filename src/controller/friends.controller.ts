import type { iFriend } from "../models/friend.model.js";
import { FriendRepository } from "../repositories/friends.repository.js";
import emailValidator from '../core/validators/email.validator.js'
import phoneValidator from "../core/validators/phone.validator.js";

export class FriendsController{
    checkEmailExists(email:string) {
        return emailValidator(email);
    }

    checkPhoneExists(phone:string) {
        return phoneValidator(phone);
    }

    addFriendReferenceToRepository(friend:iFriend) {
        if(!FriendRepository.getInstance()) {
            return { success: false };
        }
        console.log('Adding friend to database...', friend);
        FriendRepository.getInstance().addFriendToRepository(friend);
    }

    searchFriendReferenceToRepository(friend:iFriend, criteria: "email" | "phone") {
        if(!FriendRepository.getInstance()) {
            return { success: false };
        }
        console.log('Finding friend from database...');
        if(criteria === "email") {
            FriendRepository.getInstance().findFriendByEmail()
        }
    }
}