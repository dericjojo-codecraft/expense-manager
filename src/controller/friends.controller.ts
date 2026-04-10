import type { iFriend } from "../models/friend.model.js";
import { FriendRepository } from "../repositories/friends.repository.js";
import displayTable from "../core/page-option.js";

export class FriendsController{
    async checkEmailExists(email:string) {
        const repo = FriendRepository.getInstance();
        return await (await repo).checkEmailInRepository(email);
    }

    async checkPhoneExists(phone:string) {
        const repo = FriendRepository.getInstance();
        return await (await repo).checkPhoneInRepository(phone);
    }

    async addFriendReferenceToRepository(friend: iFriend) {
        const repo = FriendRepository.getInstance();
        return await (await repo).addFriendToRepository(friend);
    }

    async searchFriendReferenceToRepository(value?: string) {
        const repo = FriendRepository.getInstance();
        if(value) {
            const response = (await repo).searchFriends(value);
            displayTable((await response));
        } else {
            const response = (await repo).searchFriends();
            displayTable((await response));
        }
    }

    async updateFriendInterface(value: string, friend: iFriend) {
        const repo = FriendRepository.getInstance();
        (await repo).updateFriend(value, friend);
    }

    async removeFriendReferenceToRepository(value: string) {
        const repo = FriendRepository.getInstance();
        return await (await repo).removeFriend(value);
    }

    async closeDBConnection() {
        const repo = FriendRepository.getInstance();
        (await repo).closeConnection();
    }
}