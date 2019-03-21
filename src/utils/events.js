import Taro, { Events } from "@tarojs/taro";

const events = new Events();
const globalData = {
  msg: "hello world"
};

events.on("test", msg => {
  globalData.msg = msg;
});

export default events;
export { globalData };
