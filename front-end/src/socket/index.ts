import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://localhost:3003";

export const socket = io(URL, {
  query: {
    userId: "123",
  },
});

socket.on("connect", function () {
  // eslint-disable-next-line no-console
  console.log("Connected");
});
socket.on("notification_created", function (data) {
  // eslint-disable-next-line no-console
  console.log(data);
});

socket.on("disconnect", function () {
  // eslint-disable-next-line no-console
  console.log("Disconnected");
});
