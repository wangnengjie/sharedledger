import Taro, { Events } from "@tarojs/taro";

const events = new Events();
const globalData = {};
const tempBillData = {};
const tempLedgerData = {};
events.on("getIndex", obj => {
  const { done, run, ledger } = obj;
  Object.assign(globalData, done, run, ledger);
});

export default events;
export { globalData, tempBillData, tempLedgerData };
