import Taro, { Events } from "@tarojs/taro";

const events = new Events();
const globalData = {};
const tempBillData = {};
const tempLedgerData = {};

events.on("getIndex", obj => {
  const { done, run, ledger } = obj;
  Object.assign(globalData, done, run, ledger);
});

events.on("setAuth", auth => {
  globalData.auth = auth;
})

events.on("setUserInfo", userInfo => {
  Object.assign(globalData, userInfo);
})

// events.on("addOne", this.handleAddOne);

// events.on("fix", this.handleFix);

export default events;
export { globalData, tempBillData, tempLedgerData };
