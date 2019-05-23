const persentOfCategory = bills => {
  if (!bills.length) return [];
  const map = new Map();
  bills.forEach(bill => {
    let category = bill.category;
    category.categoryId === 0
      ? (category = "其他")
      : (category = category.categoryName);
    let money = bill.money / 100;
    if (map.has(category)) {
      map.set(category, map.get(category) + money);
    } else {
      map.set(category, money);
    }
  });
  const details = Array.from(map);
  details.sort((a, b) => b[1] - a[1]);
  const fir = details[0][1];
  details.forEach(detail => {
    detail.push(Math.round((detail[1] / fir)*100));
    detail[1] = Number.parseFloat((detail[1]).toFixed(2));
  });
  return details;
};

const persentOfDate = bills => {
  if (!bills.length) return [];
  const map = new Map();
  bills.forEach(bill => {
    const money = bill.money / 100;
    const date = new Date(bill.createTime);
    const dayStr = `${date.getMonth() + 1}.${date.getDate()}`;
    if (map.has(dayStr)) {
      map.set(dayStr, map.get(dayStr) + money);
    } else {
      map.set(dayStr, money);
    }
  });
  const details = Array.from(map);
  details.sort((a, b) => b[1] - a[1]);
  const fir = details[0][1];
  details.forEach(detail => {
    detail.push(Math.round((detail[1] / fir)*100));
    detail[1] = Number.parseFloat((detail[1]).toFixed(2));
  });
  return details;
};

const persentOfPerson = (bills, userList) => {
  if (!bills.length) return [];
  const uInfo = userList.map(person => {
    return Object.assign({}, person, { money: 0 });
  });
  bills.forEach(bill => {
    const { money, users } = bill;
    const average = money / users.length;
    users.forEach(user => {
      uInfo.find(person => person.uid === user).money += average;
    });
  });
  uInfo.forEach(person => {
    person.money = Number.parseFloat((person.money / 100).toFixed(2));
  });
  uInfo.sort((a, b) => b.money - a.money);
  const fir = uInfo[0].money;
  uInfo.forEach(person => {
    uInfo.persent = Math.round((person.money / fir)*100);
  });
  return uInfo;
};

export { persentOfCategory, persentOfDate, persentOfPerson };
