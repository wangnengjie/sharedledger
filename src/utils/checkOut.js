const countMoney = bills => {
  let total = 0;
  for (let i = 0; i < bills.length; i++) {
    total += bills[i].money;
  }
  return total / 100;
};

const checkOutPayment = (bills, userList) => {
  const details = [];
  const uInfo = userList.map(person => {
    return Object.assign({}, person, { money: 0 });
  });
  // 计账
  bills.forEach(bill => {
    const { money, payer, users } = bill;
    const average = money / users.length;
    uInfo.find(person => person.uid === payer.uid).money += money;
    users.forEach(user => {
      uInfo.find(person => person.uid === user.uid).money -= average;
    });
  });
  // 取2位小数
  uInfo.forEach(person => {
    person.money = parseFloat((person.money / 100).toFixed(2));
  });
  // 排序
  uInfo.sort((a, b) => b.money - a.money);
  // 算账
  const mid = uInfo.findIndex(a => a.money < 0);
  for (let i = mid, j = 0; i < uInfo.length && j < mid; i += 1) {
    const lowMoney = uInfo[i].money;
    const upMoney = uInfo[j].money;
    const _money = Math.abs(lowMoney);
    if (upMoney >= _money) {
      details.push({ from: uInfo[i], to: uInfo[j], money: _money });
      uInfo[j].money += lowMoney;
      uInfo[i].money = 0;
    } else {
      details.push({ from: uInfo[i], to: uInfo[j], money: upMoney });
      uInfo[j].money = 0;
      uInfo[i].money += upMoney;
      i--, j++;
    }
  }
  return details;
};

export { countMoney, checkOutPayment };
