import type { PageOptions } from "../core/page-option.js";
import type { iFriend } from "../models/friend.model.js";
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const FILE_PATH = join(process.cwd(), 'src/friendsList.json');
const jsonData = await readFile(FILE_PATH, 'utf-8');
const content = JSON.parse(jsonData);

export class FriendRepository {
    private static instance: FriendRepository;
    private currentData = content;

    static getInstance() {
        if(!FriendRepository.instance) {
            FriendRepository.instance = new FriendRepository();
        }
        return FriendRepository.instance;
    }

    private constructor() {}

    async checkEmailInRepository(email: string) {
        if((this.currentData.friends as iFriend[]).some(friendObject => {
            if(friendObject.isActive === true) {
                return friendObject.email.toLowerCase() === email.toLowerCase();
            }
        })) {
            return {success: false, message: "Action failed: Email must be unique"}
        }
    }

    async checkPhoneInRepository(phone: string) {
        if((this.currentData.friends as iFriend[]).some(friendObject => {
            if(friendObject.isActive === true) {
                return friendObject.phone === phone;
            }
        })) {
            return {success: false, message: "Action failed: Phone number must be unique"}
        }
    }

    async addFriendToRepository(friend: iFriend): Promise<{ success: boolean; message: string }> {
        const existingFriendIndex = (this.currentData.friends as iFriend[]).findIndex(friendObject => {
            return friendObject.email === friend.email || friendObject.phone === friend.phone;
        });

        let message = "";
        if (existingFriendIndex !== -1) {
            if (this.currentData.friends[existingFriendIndex].isActive === false) {
                this.currentData.friends[existingFriendIndex].isActive = true;
                message = `Re-activated existing friend: ${friend.name}`;
            } else {
                return { success: false, message: "Action failed: Friend with same email or phone already exists" };
            }
        } else {
            this.currentData.friends.push(friend);
            message = `Added friend to database: ${friend.name}`;
        }

        await writeFile(FILE_PATH, JSON.stringify(this.currentData, null, 4), 'utf-8');
        return { success: true, message };
    }

    async findFriends(value?: string) {
        if(value){
            return this.searchFriends(value);    
        }
        return this.searchFriends();
    }

    // TODO
    async updateFriend(value: string) {
        const friendObject = (this.currentData.friends as iFriend[])[await this.getSpecificFriendObject(value)];
    }

    async removeFriend(value: string): Promise<{ success: boolean; message: string }> {
        const existingFriendIndex = await this.getSpecificFriendObject(value);

        if (existingFriendIndex !== -1) {
            if(this.currentData.friends[existingFriendIndex].balance !== 0) {
                return { success: false, message: "Action failed: Balance needs to be settled before removing a friend."  }
            }

            const name = this.currentData.friends[existingFriendIndex].name;

            this.currentData.friends[existingFriendIndex].isActive = false;

            await writeFile(FILE_PATH, JSON.stringify(this.currentData, null, 4), 'utf-8');
            return { success: true, message: `${name} removed as friend` };
        }
        return { success: false, message: "Action failed: Friend not found. No changes made" };
    }

    private async getSpecificFriendObject(value: string) {
        const lowerValue = value.toLowerCase();

        return (this.currentData.friends as iFriend[]).findIndex(friendObject => {
            return (friendObject.email.toLowerCase() === lowerValue || friendObject.phone === lowerValue) && friendObject.isActive === true;
        });
    }

    private async searchFriends(query?:string, pageOption?: PageOptions) {
        let filtered: iFriend[];

        if(query) {
            const lowerQuery = query.toLowerCase();
            filtered = (this.currentData.friends as iFriend[]).filter(friend => {
                return (friend.name.toLowerCase().includes(lowerQuery) ||
                friend.email.toLowerCase().includes(lowerQuery) ||
                friend.phone.toLowerCase().includes(lowerQuery)) && friend.isActive === true;
            });
        } else {
            filtered = (this.currentData.friends as iFriend[]).filter(friend => {
                return friend.isActive === true;
            });
        }

        return {
            data: filtered.slice((pageOption?.offset || 0),
                (pageOption?.offset || 0) + (pageOption?.limit || 5)),
            matched: filtered.length,
            total: (this.currentData.friends as iFriend[]).reduce(
                (acc, curr) => {
                    if(curr.isActive === true) { acc += 1 }
                    return acc;
                }, 0)
        }
    }
}