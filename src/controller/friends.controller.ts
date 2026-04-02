import type { iFriend } from "../models/friend.model.js";
import { FriendRepository } from "../repositories/friends.repository.js";
import emailValidator from '../core/validators/email.validator.js'
import phoneValidator from "../core/validators/phone.validator.js";
import displayTable from "../core/page-option.js";

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

    async searchFriendReferenceToRepository(value: string) {
        const repo = FriendRepository.getInstance();
        const response = repo.findFriends(value)
        await displayTable((await response).data)
    }
}