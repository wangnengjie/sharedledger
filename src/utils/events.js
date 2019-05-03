import Taro, { Events } from "@tarojs/taro";

const events = new Events();
const globalData = {};
const tempBillData = {};
const tempLedgerData = {};

events.on("getIndex", obj => {
  const { done, run, ledger } = obj;
  globalData.run = run;
  globalData.done = done;
  globalData.ledger = ledger;
});

events.on("setAuth", auth => {
  globalData.auth = auth;
});

events.on("setUserInfo", userInfo => {
  globalData.userInfo = userInfo;
});

events.on("createLedger", obj => {
  const newRun = globalData.run.concat();
  newRun.unshift({ ...obj, done: false });
  globalData.run = newRun;
});

events.on("switchLedger", ledger => {
  globalData.ledger = ledger;
});

// events.on("addOne", this.handleAddOne);

// events.on("fix", this.handleFix);

export default events;
export { globalData, tempBillData, tempLedgerData };
