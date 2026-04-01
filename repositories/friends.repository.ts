import { Friend } from "../model/friend.model.js";

export class FriendsRepository {
    static friends: Friend[];

    static getInstance() {
        if(!FriendsRepository.instance) {
            FriendsRepository.instance = new FriendsRepository();
        }
        return FriendsRepository.instance;
    }

    private constructor() {};

    addFriend(friend: Friend) {
        this.friends.push(friend);
        console.log("Added friend...");
    }

    findFriendByEmail(email: string) {

    }

    findFriendByPhone(phone: string) {
        
    }
}