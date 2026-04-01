import { FriendRepository } from "../repositories/friends.repository.js";
export class FriendsController {
    checkEmailExists(email) {
        return false;
    }
    checkPhoneExists(phone) {
        return false;
    }
    addFriend(friend) {
        if (!FriendRepository.getInstance()) {
            return { success: false };
        }
        console.log('Adding friend to database...', friend);
        FriendRepository.getInstance().addFriend(friend);
    }
}
//# sourceMappingURL=friends.controller.js.map