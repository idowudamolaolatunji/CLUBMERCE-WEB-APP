const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.APP_CHAT_ID,
  key: process.env.APP_CHAT_KEY,
  secret: process.env.APP_CHAT_SECRET,
  cluster: process.env.APP_CHAT_CLUSTER,
  useTLS: true
});

module.exports = pusher;