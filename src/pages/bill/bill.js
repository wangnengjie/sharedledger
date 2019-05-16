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
import { myRequest } from "../../utils/myRequest";
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
    this.handleTextareaInput = this.handleTextareaInput.bind(this);
    this.handleMoneyInput = this.handleMoneyInput.bind(this);
    this.handlePayerSwitch = this.handlePayerSwitch.bind(this);
    this.handleSwitchCategory = this.handleSwitchCategory.bind(this);
    this.state = {
      description: "",
      money: "",
      ledgerId: 0,
      ledgerName: "",
      categories: [],
      users: [],
      extendUsers: false,
      extendCategories: false
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

    // 初始化数据
    this.setState({
      ledgerId: parseInt(ledgerId),
      ledgerName,
      categories,
      users
    });
  }

  async handleAddOne() {
    const { ledgerId, money, users, categories, description } = this.state;
    if (money === "" || Number.isNaN(money)) {
      Taro.showToast({ title: "请输入正确的金额", icon: "none" });
      return;
    }
    let payer = null;
    let participants = [];
    users.forEach(user => {
      let temp = JSON.parse(JSON.stringify(user));
      user.selected && participants.push(temp);
      user.isPayer && (payer = temp);
    });
    if (!payer || !participants.length) {
      Taro.showToast({
        title: "至少需要一位付款人和一位参与人哦~",
        icon: "none"
      });
      return;
    }
    participants.forEach(participant => {
      delete participant.selected;
      delete participant.isPayer;
    });
    delete payer.selected;
    delete payer.isPayer;
    let category = categories.find(e => e.selected) || {};
    const body = {
      ledgerId,
      bill: {
        payer,
        money,
        category,
        description,
        users: participants
      }
    };
    console.log(body);
    const data = await myRequest("/bill", "POST", body);
    if (data) {
      events.trigger("addOne", {
        ledgerId,
        bill: { billId: data.billId, createTime: data.createTime, ...body.bill }
      });
    }
  }

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

  handleSwitchCategory(index) {
    const categories = this.state.categories;
    const state = categories[index].selected;
    for (let i = 0; i < categories.length; i++) {
      categories[i].selected = false;
    }
    categories[index].selected = !state;
    this.setState({ categories });
  }

  goBack() {
    Taro.navigateBack({});
  }

  extendCategories() {
    const state = this.state.extendCategories;
    this.setState({ extendCategories: !state });
  }

  extendUsers() {
    const state = this.state.extendUsers;
    this.setState({ extendUsers: !state });
  }

  componentWillMount() {
    const { page, ledgerId } = this.$router.params;
    this.initialize(page, ledgerId);
  }

  render() {
    const {
      ledgerName,
      users,
      categories,
      extendCategories,
      extendUsers
    } = this.state;

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
            {users
              .slice(0, extendUsers ? users.length : 7)
              .map((user, index) => {
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
            {users.length >= 7 && extendUsers && (
              <ExtendDots onClick={this.extendUsers} />
            )}
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
            {categories
              .slice(0, extendCategories ? categories.length : 7)
              .map((category, index) => {
                return (
                  <UseBox
                    key={category.categoryId}
                    category={category}
                    index={index}
                    onClick={this.handleSwitchCategory}
                  />
                );
              })}
            {categories.length >= 7 && extendCategories && (
              <ExtendDots onClick={this.extendCategories} />
            )}
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
          <View className='bill-btn-sure' onClick={this.handleAddOne}>
            <Text>完成</Text>
          </View>
          <View className='bill-btn-cancel' onClick={this.goBack}>
            <Text>取消</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Bill;
