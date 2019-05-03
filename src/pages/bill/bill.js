import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import events, {
  globalData,
  tempBillData,
  tempLedgerData
} from "../../utils/events";

class Bill extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.initialize = this.initialize.bind(this);
    this.handleAddOne = this.handleAddOne.bind(this);
    this.handleFix = this.handleFix.bind(this);
  }

  initialize(type, page, ledgerId) {
    const uid = Taro.getStorageSync("uid");
    if (type === "add") {
      //加一笔
      events.on("addOne", this.handleAddOne);
      // 从主页进来加一笔
      if (page === "index") {
        console.log(globalData);
        var { categories, ledgerName, users } = globalData.ledger;
      } else {
        // 从账单详情页进来加一笔
        var { categories, ledgerName, users } = tempLedgerData;
      }

      users = JSON.parse(JSON.stringify(users));
      for (let i = 0; i < users.length; i++) {
        users[i].selected = true;
      }

      //默认记账人为付款人
      for (let i = 0; i < users.length; i++) {
        if (users[i].UserId === uid) {
          let user = users.splice(i, 1);
          users.unshift(user[0]);
          break;
        }
      }
      // 初始化数据
      this.setState({
        type,
        page,
        ledgerId,
        ledgerName,
        categories,
        users
      });
    } else if (type === "fix") {
      if (page === "index") {
        // 主页修改明细
        this.setState({
          ...tempBillData,
          categories: globalData.ledger.categories,
          type,
          page
        });
      } else {
        // 详情页修改明细
        this.setState({
          ...tempBillData,
          categories: tempLedgerData.categories,
          type,
          page
        });
      }
    }
  }

  handleAddOne() {}

  handleFix() {}

  componentWillMount() {
    const { type, page, ledgerId } = this.$router.params;
    this.initialize(type, page, ledgerId);
  }

  render() {
    return <View />;
  }
}

export default Bill;
