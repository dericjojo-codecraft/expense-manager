import enquirer from 'enquirer';
import createFriend from './services/createFriend.js';
import searchFriend from './services/searchFriend.js';
import removeFriend from './services/removeFriend.js';
import updateFriendInfo from './services/updateFriendInfo.js';
const { Select } = enquirer as any;

export async function selectAction() {
  const prompt = new Select({
    name: 'Action',
    message: 'Pick action to perform:',
    choices: ['Add Friend', 'Search Friend', 'Remove Friend', 'Update Friend Info']
  });

  try {
    const answer = await prompt.run();
    switch(answer) {
        case 'Add Friend': {
          createFriend();
          break;
        }
        case 'Search Friend': {
          await searchFriend();
          break;
        }
        case 'Remove Friend': {
          await removeFriend();
          break;
        }
        case 'Update Friend Info': {
          updateFriendInfo();
          break;
        }
    }
  } catch (err) {
    console.log('Prompt cancelled.');
  }
}