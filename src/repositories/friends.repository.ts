import type { PageOptions } from "../core/page-option.js";
import type { iFriend } from "../models/friend.model.js";
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const FILE_PATH = join(process.cwd(), 'src/friendsList.json');

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
        const currentData = await readFile(FILE_PATH, 'utf-8');
        const content = JSON.parse(currentData);
        content.friends.push(friend);
        await writeFile(FILE_PATH, JSON.stringify(content, null, 4), 'utf-8');
    }

    async findFriends(value: string) {
        return this.searchFriends(value);
    }

    private async searchFriends(query:string, pageOption?: PageOptions) {
        const currentData = await readFile(FILE_PATH, 'utf-8');
        const content = JSON.parse(currentData);
        const lowerQuery = query.toLowerCase();
        const filtered = (content.friends as iFriend[]).filter(friend => {
            return friend.name.toLowerCase().includes(lowerQuery) ||
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