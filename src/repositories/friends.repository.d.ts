import type { PageOptions } from "../core/page-option.js";
import type { iFriend } from "../models/friend.model.js";
export declare class FriendRepository {
    private static instance;
    private friends;
    static getInstance(): FriendRepository;
    private constructor();
    addFriend(friend: iFriend): void;
    findFriendByEmail(email: string): iFriend | undefined;
    findFriendByPhone(phone: string): iFriend | undefined;
    searchFriends(query: string, pageOption?: PageOptions): {
        data: iFriend[];
        matched: number;
        total: number;
    };
}
//# sourceMappingURL=friends.repository.d.ts.map