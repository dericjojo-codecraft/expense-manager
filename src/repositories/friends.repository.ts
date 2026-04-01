import type { PageOptions } from "../core/page-option.js";
import type { iFriend } from "../models/friend.model.js";
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const FILE_PATH = join(process.cwd(), 'src/friendsList.json');
const fileData = await readFile(FILE_PATH, 'utf-8');

export class FriendRepository {
    private static instance: FriendRepository;
    static getInstance() {
        if(!FriendRepository.instance) {
            FriendRepository.instance = new FriendRepository();
        }
        return FriendRepository.instance;
    }

    private constructor() {}
    async addFriendToRepository(friend: iFriend) {
        const content = JSON.parse(fileData);
        content.friends.push(friend);
        await writeFile(FILE_PATH, JSON.stringify(content, null, 4), 'utf-8');
    }

    findFriendByEmail(email: string) {
        const content = JSON.parse(fileData);
        return (content.friends as iFriend[]).find(friend => friend.email === email);
    }

    findFriendByPhone(phone: string) {
        const content = JSON.parse(fileData);
        return (content.friends as iFriend[]).find(friend => friend.phone === phone);
    }

    searchFriends(query:string,pageOption?: PageOptions) {
        const content = JSON.parse(fileData);
        const lowerQuery = query.toLowerCase();
        const filtered =  (content.friends as iFriend[]).filter(friend => {
            friend.name.toLowerCase().includes(lowerQuery) ||
            friend.email.toLowerCase().includes(lowerQuery) ||
            friend.phone.toLowerCase().includes(lowerQuery)
        });

        return {
            data: filtered.slice((pageOption?.offset || 0),
                  (pageOption?.offset || 0) + (pageOption?.limit || 5)),
            matched: filtered.length,
            total: content.friends.length
        }
    }
}