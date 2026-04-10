import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { FriendsController } from "../controller/friends.controller.js";

export interface AskOptions {
  defaultAnswer?: string | undefined;
  validator?: ((s: string) => boolean) | undefined;
}

export interface Choice {
  label: string;
  value: string;
}

export const openInteractionManager = () => {
  const rl = readline.createInterface({ input, output });

  const ask: (question: string, options?: AskOptions) => Promise<string | undefined> = async (question: string, options?: AskOptions) => {
    const { defaultAnswer, validator } = options || {};
    return new Promise((resolve) => {
      rl.question(
        question + `${defaultAnswer ? "(" + defaultAnswer + ")" : ""}`,
        async (answer: string) => {
          if (validator && !validator(answer)) {
            resolve(ask(question, { defaultAnswer, validator }));
          } else {
            resolve(answer || defaultAnswer);
          }
        },
      );
    });
  };

  const choose:(question: string, choices: Choice[],optional?:boolean) => Promise<Choice|undefined>=async (question: string, choices: Choice[], optional) => {
    console.log(question);
    choices.forEach((choice) => {
      console.log(`${choice.value}. ${choice.label}`);
    });
    const choice = await ask("Enter your choice: ", {
      validator: (input) => {
        if(optional && input.trim()=== ''){
          return true;
        }
        return choices.some((choice) => choice.value === input)},
    });
    return choices!.find(c => c.value === choice)
  };

  const close = () => {
    rl.close();
    const controller = new FriendsController;
    controller.closeDBConnection();
  };

  return { ask, choose, close };
};