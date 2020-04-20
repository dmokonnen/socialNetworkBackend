/**
 * Utility module for push notification
 */
const {
  PushSubscriptionObject,
} = require("../models/pushSubscriptionObject.js");
const { Notification } = require("../models/notification");
const webpush = require("web-push");

/**
 * Prepare the notifications, store in the respective user's storage
 * and push the notifications if user's are online. Returns nothing
 * @param {*} userList: list of user object id (_id of user object)
 * @param {*} notification: notification message
 * @param {*} notificationType: int representing notification type. 0 for
 */
const push = async (userList, notification, notificationType) => {
  // for each user, store in notification collection, send push request
  const NOTIFICATION_MAP = {
    0: "unhealthy",
    1: "activity",
  };
  const notificationData = {
    notificationType: NOTIFICATION_MAP[notificationType],
    data: notification,
  };
  _insertNotification(userList, notificationData);
  _pushMessages(userList, notification);
};

/**
 * Store notification to user's database
 * @param {*} userList
 * @param {*} notification
 */
const _insertNotification = (userList, notification) => {
  Notification.updateMany(
    { user: { $in: userList } },
    { $push: { notification: notification } },
    { upsert: true }
  )
    .then((c) => console.log("AFTER"))
    .catch((err) => console.log("ERROR ", err));
};

/**
 * Don't call this method directly. It is helper method for push method above. Call push instead.
 * Will push notification to web browsers
 * @param {*} userList list of user object IDs
 * @param {*} notification notification
 */
const _pushMessages = (userList, notification) => {
  // TODO check the query and it's return value
  PushSubscriptionObject.find({
    user: { $in: userList },
  })
    .then((allSubs) => {
      let allSubscriptions = [];
      allSubs.forEach((sub) =>
        allSubscriptions.push({
          endpoint: sub.pushSubscriptionObject.endpoint,
          keys: {
            auth: sub.pushSubscriptionObject.keys.auth,
            p256dh: sub.pushSubscriptionObject.keys.p256dh,
          },
        })
      );
      notify(allSubscriptions, notification);
    })
    .catch();
};

const notify = (allSubscriptions, notification) => {
  const vapidKeys = {
    publicKey:
      "BMhTUkqyjeiXSv0BYTOOPk1TB1cpIpaKhNv5W5BZuxksjfgo9JjQTEeqAC5PqHUoPSPYec7lbnjwOzXfnQHz55s",
    privateKey: "gv41dy6dQ1-Otxa8VMYyrdDqveIYRF1OljIwtjdcq2s",
  };
  webpush.setVapidDetails(
    "http://dagu-social-network-node.s3-website.us-east-2.amazonaws.com/", //TODO add URL or mailto
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
  const notificationPayload = {
    notification: {
      title: "New Message",
      body: "Check it out!",
      //   icon: "assets/main-page-logo-small-hat.png",
      vibrate: [100, 50, 100],
      data: notification,
      //   actions: [
      //     {
      //       action: "explore",
      //       title: "Go to the site",
      //     },
      //   ],
    },
  };
  Promise.all(
    allSubscriptions.map((sub) =>
      webpush.sendNotification(sub, JSON.stringify(notificationPayload))
    )
  )
    .then(() => console.log({ message: "Newsletter sent successfully." }))
    .catch((err) => {
      console.error("Error sending notification, reason: ", err);
    });
};

exports.push = push;
