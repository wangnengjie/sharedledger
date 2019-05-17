import Taro, { Events } from "@tarojs/taro";

const events = new Events();
const globalData = {};
const tempBillData = {};
const tempLedgerData = {};

events.on("getIndex", obj => {
  const { done, run, ledger } = JSON.parse(JSON.stringify(obj));
  globalData.run = run;
  globalData.done = done;
  globalData.ledger = ledger;
});

events.on("createLedger", obj => {
  const newRun = globalData.run.concat();
  newRun.unshift({ ...obj, done: false });
  globalData.run = newRun;
});

events.on("switchLedger", ledger => {
  globalData.ledger = JSON.parse(JSON.stringify(ledger));
});

events.on("successInvite", ledger => {
  const newRun = globalData.run.concat();
  const { ledgerName, ledgerId, done } = JSON.parse(JSON.stringify(ledger));
  newRun.unshift({ ledgerId, ledgerName, done });
  globalData.run = newRun;
  globalData.ledger = ledger;
});

events.on("addOne", detail => {
  if (detail.ledgerId === globalData.ledger.ledgerId) {
    globalData.ledger.bills.unshift(detail.bill);
  }
});

// events.on("fix", this.handleFix);

export default events;
export { globalData, tempBillData, tempLedgerData };
