const path = require("path");
const file = require("./utils/file_utils.js");
const WebSocket = require("ws");
const wss = new WebSocket.Server({
  host: "192.168.8.108",
  port: 3000,
});

//对客户端的连接事件进行监听
//client：代表的是客户端的连接socket对象
wss.on("connection", (client) => {
  // 监听发来的数据
  client.on("message", async (message) => {
    const msg = JSON.parse(message.toString());
    if (msg.type === "user") {
      await file.addUser(msg.data);
      console.log(msg.data.name + "进入了聊天室");
    } else if (msg.type === "message") {
      await file.addUserMessage(msg.data.name, msg.data.msgList);
      wss.clients.forEach(async (client) => {
        client.send(
          JSON.stringify({
            type: "msg",
            data: {
              name: msg.data.name,
              msg: msg.data.msgList,
            },
          })
        );
      });
      return;
    }
    wss.clients.forEach(async (client) => {
      const data = await file.getData();
      client.send(
        JSON.stringify({
          type: "message",
          data,
        })
      );
    });
  });
});
