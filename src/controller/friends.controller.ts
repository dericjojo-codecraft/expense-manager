import type { iFriend } from "../models/friend.model.js";
import { FriendRepository } from "../repositories/friends.repository.js";
import displayTable from "../core/page-option.js";

export class FriendsController{
    async checkEmailExists(email:string) {
        const repo = FriendRepository.getInstance();
        return await repo.checkEmailInRepository(email);
    }

    async checkPhoneExists(phone:string) {
        const repo = FriendRepository.getInstance();
        return await repo.checkPhoneInRepository(phone);
    }

    async addFriendReferenceToRepository(friend: iFriend) {
        const repo = FriendRepository.getInstance();
        return await repo.addFriendToRepository(friend);
    }

    async searchFriendReferenceToRepository(value?: string) {
        const repo = FriendRepository.getInstance();
        if(value) {
            const response = repo.searchFriends(value);
            displayTable((await response));
        } else {
            const response = repo.searchFriends();
            displayTable((await response));
        }
    }

    async updateFriendInterface(value: string) {
        const repo = FriendRepository.getInstance();
        //repo.updateFriend(value);
    }

    async removeFriendReferenceToRepository(value: string) {
        const repo = FriendRepository.getInstance();
        return await repo.removeFriend(value);
    }
}