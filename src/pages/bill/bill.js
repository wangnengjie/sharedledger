import Taro, { Component } from "@tarojs/taro";
import { View, Input, Text } from "@tarojs/components";
import UserBox from "../../Components/UserBox/UserBox";
import events, {
  globalData,
  tempBillData,
  tempLedgerData
} from "../../utils/events";
import "./bill.scss";

class Bill extends Component {
  config = {
    navigationBarTitleText: "记一笔"
  };
  constructor(props) {
    super(props);
    this.initialize = this.initialize.bind(this);
    this.handleAddOne = this.handleAddOne.bind(this);
    this.handleFix = this.handleFix.bind(this);
    this.state = {
      description: "",
      money: ""
    };
  }

  initialize(page, ledgerId) {
    const uid = Taro.getStorageSync("uid");
    //加一笔
    events.on("addOne", this.handleAddOne);
    // 从主页进来加一笔
    let ledger = null;
    if (page === "index") {
      console.log(globalData);
      ledger = JSON.parse(JSON.stringify(globalData.ledger));
    } else {
      ledger = JSON.parse(JSON.stringify(tempLedgerData));
    }
    let { users, categories, ledgerName } = ledger;
    users = JSON.parse(JSON.stringify(users));
    for (let i = 0; i < users.length; i++) {
      users[i].selected = true;
      users[i].isPayer = false;
    }

    //默认记账人为付款人
    for (let i = 0; i < users.length; i++) {
      if (users[i].UserId === uid) {
        let user = users.splice(i, 1);
        user.isPayer = true;
        users.unshift(user);
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
  }

  handleAddOne() {}

  handleFix() {}

  componentWillMount() {
    const { page, ledgerId } = this.$router.params;
    this.initialize(page, ledgerId);
  }

  render() {
    const payer = this.state.users.map((user, index) => {
      return (
        <UserBox
          key={user.UserId}
          isPayer={user.isPayer}
          index={index}
          nickName={user.nickName}
        />
      );
    });

    return (
      <View>
        <View className='bill-header-bar'>
          <View className='bill-header-bcg' />
          <View className='bill-header-ledgerName'>
            <Text>{this.state.ledgerName}</Text>
          </View>
        </View>

        <View className='bill-input-bar'>
          <View className='bill-input-pl'>
            <Text>请输入金额</Text>
          </View>
          <View className='bill-input-input'>
            <View>
              <Input type='digit' value='123' />
            </View>
            <Text>元</Text>
          </View>
        </View>

        <View className='bill-payer-bar'>
          {this.state.users.map((user, index) => {
            return (
              <UserBox
                key={user.UserId}
                isPayer={user.isPayer}
                index={index}
                nickName={user.nickName}
              />
            );
          })}
        </View>

        <View className='bill-users-bar' />

        <View className='bill-category-bar' />

        <View className='bill-description-bar' />

        <View className='bill-btn-bar' />
      </View>
    );
  }
}

export default Bill;
