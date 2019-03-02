let protocol = window.location.protocol;
let host = window.location.hostname;
let port = window.location.port;
let socketServerUrl = `${protocol}//${host}:${port}/`;

console.info(socketServerUrl);
const socketClient = io.connect(socketServerUrl);
const eventName = "NewCustomerRecordAdded";

if (socketClient) {
  console.info("Web Socket Connection (Client) Established Successfully ...");

  socketClient.on(eventName, eventData => {
    console.info(
      `Push Notification Event Received .... ${JSON.stringify(eventData)}`
    );
  });
}
