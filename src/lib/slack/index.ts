// const { App } = require('@slack/bolt');

// const token = process.env.SLACK_BOT_TOKEN;
// const signingSecret = process.env.SLACK_SIGNING_SECRET;

// const app = new App({
//   token: token,
//   signingSecret: signingSecret
// });

// // Start the app
// (async () => {
//     await app.start(process.env.PORT ? parseInt(process.env.PORT) : 5000);
//     console.log('⚡️ Bolt app is running!');
// })();

// async function findConversation(name) {
//     try {
//       // Call the conversations.list method using the built-in WebClient
//       const result = await app.client.conversations.list({
//         // The token you used to initialize your app
//       });

//       for (const channel of result.channels) {
//         if (channel.name === name) {
//           const conversationId = channel.id;

//           // Print result
//           return conversationId;
//           // Break from for loop
//           break;
//         }
//       }
//     }
//     catch (error) {
//       console.error(error);
//     }
//   }

// // Find conversation with a specified channel `name`
// // findConversation("test");

//   // Post a message to a channel your app is in using ID and message text
// async function publishMessage(id, text) {
//     try {
//       // Call the chat.postMessage method using the built-in WebClient
//       const result = await app.client.chat.postMessage({
//         // The token you used to initialize your app
//         channel: id,
//         text: text,
//         // You could also use a blocks[] array to send richer content
//       });

//       // Print result, which includes information about the message (like TS)
//       console.log(result);
//     }
//     catch (error) {
//       console.error(error);
//     }
//   }

// // publishMessage("U06HQTYE0ER", "Moi, kiva kun liityit sovellukseen!!! :tada:");

// async function findUserByEmail(email) {
//     try {
//       // Call the users.list method using the built-in WebClient
//       const result = await app.client.users.lookupByEmail({
//         // The token you used to initialize your app
//         email: email
//         });

//         console.log(result.user.id);
//     }
//     catch (error) {
//       console.error(error);
//     }

//     }
// // findUserByEmail("ohtutraininghub@gmail.com");
