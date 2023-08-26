//#####··········读取文件的工具方法··········#####//
const path = require("path");
const fs = require("fs");
function getData() {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, "../data/db.json"),
      "utf-8",
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      }
    );
  });
}
function editData(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.join(__dirname, "../data/db.json"),
      JSON.stringify(data, null, 2),
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve("写入成功");
        }
      }
    );
  });
}

module.exports = {
  /* 读取数据库 */
  getData,
  addUser(data) {
    return new Promise((resolve, reject) => {
      getData().then((res) => {
        const isExist = res.userList.findIndex((item) => {
          return item.id === data.id;
        });
        if (isExist === -1) res.userList.push(data);
        editData(res).then(() => {
          resolve();
        });
      });
    });
  },
  addUserMessage(name, message) {
    return new Promise((resolve, reject) => {
      getData().then((res) => {
        res.msgList.push({
          name,
          time: Date.now().toString(),
          msg: message,
        });
        editData(res).then(() => {
          resolve();
        });
      });
    });
  },
};
