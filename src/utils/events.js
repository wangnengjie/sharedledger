import Taro, { Events } from "@tarojs/taro";

const events = new Events();
const globalData = {};
const tempBillData = {};
const tempLedgerData = {};
const tempUserList = {};

events.on("getIndex", obj => {
  const { done, run, ledger } = JSON.parse(JSON.stringify(obj));
  globalData.run = run;
  globalData.done = done;
  globalData.ledger = ledger;
});

events.on("createLedger", obj => {
  const run = globalData.run.concat();
  run.unshift({ ...obj, done: false });
  globalData.run = run;
});

events.on("switchLedger", ledger => {
  globalData.ledger = JSON.parse(JSON.stringify(ledger));
});

events.on("successInvite", ledger => {
  const run = globalData.run.concat();
  const { ledgerName, ledgerId, done } = JSON.parse(JSON.stringify(ledger));
  run.unshift({ ledgerId, ledgerName, done });
  globalData.run = run;
  globalData.ledger = ledger;
});

events.on("addOne", detail => {
  if (detail.ledgerId === globalData.ledger.ledgerId) {
    globalData.ledger.bills.unshift(detail.bill);
  }
});

events.on("deleteBill", (ledgerId, billId) => {
  if (ledgerId === globalData.ledger.ledgerId) {
    const bills = globalData.ledger.bills.concat();
    const index = bills.findIndex(bill => billId === bill.billId);
    if (index < 0) return;
    bills.splice(index, 1);
    globalData.ledger.bills = bills;
  }
});

events.on("deleteLedger", (ledgerId, isDone) => {
  let array = isDone ? globalData.done.concat() : globalData.run.concat();
  array = array.filter(e => e.ledgerId !== ledgerId);
  isDone ? (globalData.done = array) : (globalData.run = array);
});

events.on("ledgerActive", ledgerId => {
  const run = globalData.run.concat();
  const done = globalData.done.concat();
  const index = done.findIndex(obj => {
    return obj.ledgerId === ledgerId;
  });
  if (index < 0) return;
  const ledger = done.splice(index, 1);
  ledger[0].done = false;
  run.unshift(...ledger);
  globalData.run = run;
  globalData.done = done;
});

events.on("ledgerCheckOut", ledgerId => {
  const run = globalData.run.concat();
  const done = globalData.done.concat();
  const index = run.findIndex(obj => {
    return obj.ledgerId === ledgerId;
  });
  if (index < 0) return;
  const ledger = run.splice(index, 1);
  ledger[0].done = true;
  done.unshift(...ledger);
  globalData.run = run;
  globalData.done = done;
});

events.on("deleteCategory", (categoryId, ledgerId) => {
  if (globalData.ledger.ledgerId === ledgerId) {
    globalData.ledger.categories.splice(
      globalData.ledger.categories.findIndex(
        category => category.categoryId === categoryId
      ),
      1
    );
  } else if (
    Reflect.has(tempLedgerData, "ledgerId") &&
    Reflect.has(tempLedgerData, "categories")
  ) {
    tempLedgerData.categories.splice(
      tempLedgerData.categories.findIndex(
        category => category.categoryId === categoryId
      ),
      1
    );
  }
});

events.on("addCategory", (body, ledgerId) => {
  if (globalData.ledger.ledgerId === ledgerId) {
    let category = JSON.parse(JSON.stringify(body));
    delete category["selected"];
    globalData.ledger.categories.push(category);
  } else if (
    Reflect.has(tempLedgerData, "ledgerId") &&
    Reflect.has(tempLedgerData, "categories")
  ) {
    let category = JSON.parse(JSON.stringify(body));
    delete category["selected"];
    tempLedgerData.categories.push(category);
  }
});

events.on("modifyBill", body => {
  const { ledgerId, bill } = body;
  if (ledgerId === globalData.ledger.ledgerId) {
    Object.assign(
      globalData.ledger.bills.find(b => b.billId === bill.billId),
      bill
    );
  } else if (
    Reflect.has(tempLedgerData, "ledgerId") &&
    tempLedgerData === ledgerId
  ) {
    Object.assign(
      tempLedgerData.bills.find(b => b.billId === bill.billId),
      JSON.parse(JSON.stringify(bill))
    );
  }
});

// events.on("fix", this.handleFix);

export default events;
export { globalData, tempBillData, tempLedgerData, tempUserList };
