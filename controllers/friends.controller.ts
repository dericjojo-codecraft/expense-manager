import type { Friend } from "../model/friend.model.js";

export class FriendsController {
    checkEmailExists(email: string) {
        return false;
    }

    checkPhoneExists(phone: string) {
        return false;
    }

    addFriend(friend: Friend) {
        console.log("Adding friend to database...", friend);
    }
}