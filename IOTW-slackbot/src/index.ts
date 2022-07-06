// External modules
import { App } from "@slack/bolt";
// Local modules
import Config from "./config";
import { postFormData } from "./requests";

const COMPETITION_DTL = 7; // Days to live, rounds up to hour 0 of next day

const app = new App({
  signingSecret: Config.slackbot.signingSecret,
  token: Config.slackbot.token,
  appToken: Config.slackbot.appToken,
  socketMode: true,
});

interface ResponseOptions {
  chatResponse?: string;
  callback?: (sayResult: any, ...args: any[]) => any;
  callbackArgs?: any[];
}

interface TriggerOptions {
  onMentionOnly: boolean;
  onFileOnly: boolean;
  enforceWhitespace: boolean; // force trigger word to be surrounded by whitespace (for example, if your trigger word was 'balm', a message containing 'embalming' would not trigger)
  enforceCaseSensitivity: boolean; // force trigger word to match exact case
}

export async function getUserProfileDataFromUID(uid: string) {
  const userInfo = await app.client.users.profile.get({
    user: uid,
    include_labels: false,
  });
  return userInfo.profile;
}

export async function getBotChannels() {
  /*l
   * Gets a list of channels of which the bot is a member
   */
  let list = await app.client.conversations.list();
  return list.channels?.filter((_channel: any) => _channel.is_member);
}

export async function sendMessage(text: string, channels?: string[]) {
  /*
   * Sends a one-shot message to every channel specified in the 'channels' array.
   */
  let botChannels = await getBotChannels();
  if (!channels) channels = botChannels?.map((_channel: any) => _channel.id);
  if (!channels) {
    const errMsg =
      "Bot either not a member of or not allowed to post in any channels.";
    console.error(errMsg);
    return new Error(errMsg);
  }
  for (let channel of channels) {
    // Grab ID if given channel name
    app.client.chat.postMessage({
      channel: channel,
      text: text,
    });
  }
}

function addTrigger(
  triggerPhrase: string | null,
  triggerOptions: TriggerOptions,
  responseOptions: ResponseOptions
) {
  /*
   * Adds a trigger that triggers on the given 'triggerPhrase'.
   * Upon activation, performs the following operations (if specified in responseOptions)
   *  - Responds in the relevant channel with the 'chatResponse' message.
   *  - Runs 'callback' with 'callbackArgs'
   * Note: listeners must be added before starting the app
   */
  async function onTriggered(responseParams: any) {
    try {
      console.log("PAYLOAD: ");
      console.log(responseParams.payload);
      const messageText = responseParams.payload.text;
      if (triggerPhrase) {
        if (!messageText.toLowerCase().includes(triggerPhrase)) return; // Includes trigger phrase?
        if (
          triggerOptions.enforceWhitespace &&
          !messageText.toLowerCase().split(" ").includes(triggerPhrase)
        )
          return; // Whitespace enforcement
        if (triggerOptions.enforceCaseSensitivity) {
          // Case sensitivity enforcement
          let matches = messageText.match(new RegExp(triggerPhrase, "gi"));
          if (!matches || !(<Array<string>>matches).includes(triggerPhrase))
            return;
        }
      }
      //if(triggerOptions.onFileOnly && responseParams.payload.)
      await responseParams.say({
        channel: responseParams.payload.channel,
        text: responseOptions.chatResponse,
      });
      responseOptions.callback?.call(
        null,
        responseParams,
        responseOptions.callbackArgs
      );
    } catch (error) {
      console.error(error);
    }
  }
  app.event(
    triggerOptions.onMentionOnly ? "app_mention" : "message", // Mention resolution
    onTriggered
  );
}

/*
 * Slackbot Setup
 */
/* Upload trigger */
addTrigger(
  null,
  {
    onMentionOnly: true,
    onFileOnly: true,
    enforceWhitespace: false,
    enforceCaseSensitivity: false,
  },
  {
    chatResponse: "Received!",
    callback: async (eventResponse: any) => {
      if (eventResponse.payload.files) console.log(eventResponse.payload.files);
      postFormData("upload", {
        userID: eventResponse.payload.user,
        userProfileData: await getUserProfileDataFromUID(
          eventResponse.payload.user
        ),
        files: eventResponse.payload.files,
      }).then((postResponse) => console.log(postResponse));
    },
  }
);

/* End of competition timer */
// Get COMPETITION_DTL days from now
let competitionEndDate = new Date(Date.now() + 8.64e7 * COMPETITION_DTL);
// Floor to start of day (hour 0)
competitionEndDate.setHours(0, 0, 0 ,0);
const competitionEndHandler = () => {
  sendMessage(`COMPETITION OVER! Here are this week's results:`);
  // Generate result image and send file
  // Reset timer
  competitionEndDate = new Date(Date.now() + 8.64e7 * COMPETITION_DTL);
competitionEndDate.setHours(0, 0, 0, 0);
  setTimeout(competitionEndHandler, competitionEndDate.getMilliseconds());
};
// Runs on competition end
setTimeout(competitionEndHandler, competitionEndDate.getMilliseconds());

app.start(`${Config.slackbot.host}:${Config.slackbot.port}`);
console.log("⚡️ IOTW-slackbot booted up! ⚡️");
