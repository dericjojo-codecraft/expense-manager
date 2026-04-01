import type { iFriend } from "../models/friend.model.js";
export declare class FriendsController {
    checkEmailExists(email: string): boolean;
    checkPhoneExists(phone: string): boolean;
    addFriend(friend: iFriend): {
        success: boolean;
    } | undefined;
}
//# sourceMappingURL=friends.controller.d.ts.map