import Taro, { Component } from "@tarojs/taro";
import { View, Input, Text, Textarea, Image } from "@tarojs/components";
import UserBox from "../../Components/UserBox/UserBox";
import ExtendDots from "../../Components/ExtendDots/ExtendDots";
import UseBox from "../../Components/UseBox/UseBox";
import events, {
  globalData,
  tempBillData,
  tempLedgerData
} from "../../utils/events";
import "./bill.scss";
import setting from "../../images/setting.png";

class Bill extends Component {
  config = {
    navigationBarTitleText: "记一笔"
  };
  constructor(props) {
    super(props);
    this.initialize = this.initialize.bind(this);
    this.handleAddOne = this.handleAddOne.bind(this);
    this.handleFix = this.handleFix.bind(this);
    this.handleTextareaInput = this.handleTextareaInput.bind(this);
    this.handleMoneyInput = this.handleMoneyInput.bind(this);
    this.handlePayerSwitch = this.handlePayerSwitch.bind(this);
    this.state = {
      description: "",
      money: "",
      page: "",
      ledgerId: 0,
      ledgerName: "",
      categories: [],
      users: []
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
      if (users[i].uid === uid) {
        let user = users.splice(i, 1);
        user[0].isPayer = true;
        users.unshift(user[0]);
        break;
      }
    }

    for (let i = 0; i < categories.length; i++) {
      categories[i].selected = false;
    }
    categories.length && (categories[0].selected = true);

    // 初始化数据
    this.setState({
      page,
      ledgerId,
      ledgerName,
      categories,
      users
    });
  }

  handleAddOne() {}

  handleFix() {}

  handleTextareaInput(e) {
    this.setState({ description: e.detail.value });
  }

  handleMoneyInput(e) {
    let money = e.detail.value;
    let input = money.split(".");
    let floatPart = "00";
    this.setState({ money: parseInt(parseFloat(money) * 100) });
    if (input.length > 1) {
      floatPart = input[1].slice(0, 2);
      return `${input[0]}.${floatPart}`;
    }
    return input[0];
  }

  handlePayerSwitch(index) {
    const users = this.state.users;
    for (let i = 0; i < users.length; i++) {
      users[i].isPayer = false;
    }
    users[index].isPayer = true;
    this.setState({ users });
  }

  handleUserSwitch(index) {
    const users = this.state.users;
    users[index].selected = !users[index].selected;
    this.setState({ users });
  }

  componentWillMount() {
    const { page, ledgerId } = this.$router.params;
    this.initialize(page, ledgerId);
  }

  render() {
    const { ledgerId, ledgerName, users, categories } = this.state;

    return (
      <View>
        <View className='bill-header-bar'>
          <View className='bill-header-bcg' />
          <View className='bill-header-ledgerName'>
            <Text>{ledgerName}</Text>
          </View>
        </View>

        <View className='session bill-input-bar'>
          <View className='bill-title'>
            <Text>请输入金额</Text>
          </View>
          <View className='bill-input-input'>
            <View>
              <Input
                type='digit'
                cursor-spacing='15'
                onInput={this.handleMoneyInput}
              />
            </View>
            <Text>元</Text>
          </View>
        </View>

        <View className='session bill-payer-bar'>
          <View className='bill-title'>
            <Text>付款人</Text>
          </View>
          <View className='bill-payer-box'>
            {users.slice(0, 3).map((user, index) => {
              return (
                <UserBox
                  key={user.uid}
                  isPayer={user.isPayer}
                  index={index}
                  nickName={user.nickName}
                  selected={false}
                  onClick={this.handlePayerSwitch}
                />
              );
            })}
            {users.length >= 3 && <ExtendDots />}
          </View>
        </View>

        <View className='session bill-users-bar'>
          <View className='bill-title'>
            <Text>参与人</Text>
          </View>
          <View className='bill-users-box'>
            {users.slice(0, 7).map((user, index) => {
              return (
                <UserBox
                  key={user.uid}
                  index={index}
                  nickName={user.nickName}
                  selected={user.selected}
                  onClick={this.handleUserSwitch}
                />
              );
            })}
            {users.length >= 7 && <ExtendDots />}
          </View>
        </View>

        <View className='session bill-category-bar'>
          <View className='bill-title'>
            <Text>用途（非必选）</Text>
            <View className='bill-category-setting'>
              <Image src={setting} />
              <Text>设置</Text>
            </View>
          </View>
          <View className='bill-category-box'>
            {categories.slice(0, 7).map((category, index) => {
              return (
                <UseBox
                  key={category.categoryId}
                  category={category}
                  index={index}
                />
              );
            })}
            {users.length >= 7 && <ExtendDots />}
          </View>
        </View>

        <View className='session bill-description-bar'>
          <View className='bill-title'>
            <Text>备注（非必填）</Text>
          </View>
          <View className='bill-description-area'>
            <Textarea maxlength='100' onInput={this.handleTextareaInput} />
          </View>
        </View>

        <View className='bill-btn-bar'>
          <View className='bill-btn-sure'>
            <Text>完成</Text>
          </View>
          <View className='bill-btn-cancel'>
            <Text>取消</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Bill;
