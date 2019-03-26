import Taro, { Events } from "@tarojs/taro";

const events = new Events();
const globalData = {
  
};

events.on("getLedger", obj => {
  Object.assign(globalData,obj);
});

export default events;
export { globalData };
