export class FriendRepository {
    static instance;
    friends = [];
    static getInstance() {
        if (!FriendRepository.instance) {
            FriendRepository.instance = new FriendRepository();
        }
        return FriendRepository.instance;
    }
    constructor() { }
    addFriend(friend) {
        this.friends.push(friend);
        console.log('Friend added to repository:', friend);
    }
    findFriendByEmail(email) {
        return this.friends.find(friend => friend.email === email);
    }
    findFriendByPhone(phone) {
        return this.friends.find(friend => friend.phone === phone);
    }
    searchFriends(query, pageOption) {
        const lowerQuery = query.toLowerCase();
        const filtered = this.friends.filter(friend => {
            friend.name.toLowerCase().includes(lowerQuery) ||
                friend.email.toLowerCase().includes(lowerQuery) ||
                friend.phone.toLowerCase().includes(lowerQuery);
        });
        return {
            data: filtered.slice((pageOption?.offset || 0), (pageOption?.offset || 0) + (pageOption?.limit || 5)),
            matched: filtered.length,
            total: this.friends.length
        };
    }
}
//# sourceMappingURL=friends.repository.js.map