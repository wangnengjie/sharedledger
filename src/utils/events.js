import Taro, { Events } from "@tarojs/taro";

const events = new Events();
const globalData = {};
const tempBillData = {};
const tempLedgerData = {};
events.on("getLedger", obj => {
  Object.assign(globalData, obj);
});

export default events;
export { globalData, tempBillData, tempLedgerData };
