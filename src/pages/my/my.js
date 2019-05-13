import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import events, { globalData } from "../../utils/events";
import { myRequest } from "../../utils/myRequest";
import "./my.scss";
import LedgerCard from "../../Components/LedgerCard/LedgerCard";

class My extends Component {
  config = {
    navigationBarTitleText: "我的账本",
    usingComponents: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      run: [],
      done: []
    };
  }

  onGetUserInfo(e) {
    const userInfo = e.detail.userInfo;
    if (!globalData.auth && userInfo) {
      globalData.userInfo = userInfo;
      globalData.auth = true;
      myRequest("/user", "PUT", {
        uid: Taro.getStorageSync("uid"),
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      });
    }
  }

  navigateToCreateLedger() {
    if (!globalData.auth) return;
    Taro.navigateTo({
      url: "/pages/createLedger/createLedger"
    });
  }

  handleDetail(ledgerId) {
    console.log("aaa");
  }

  handleCheck(ledgerId) {
    console.log("aaa");
  }

  handleDelete(ledgerId) {
    console.log("aaa");
  }

  componentWillMount() {
    const { run, done } = globalData;
    this.setState({ run, done });
  }

  componentDidShow() {
    this.$scope.getTabBar().setData({
      selected: 1 // 当前页面对应的 index
    });
  }

  render() {
    return (
      <View className='my-main'>
        {this.state.run.map(ledger => {
          return (
            <LedgerCard
              key={ledger.ledgerId}
              ledger={ledger}
              onCheck={this.handleCheck}
              onDelete={this.handleDelete}
              onDetail={this.handleDetail}
            />
          );
        })}
        {this.state.done.map(ledger => {
          return (
            <LedgerCard
              key={ledger.ledgerId}
              ledger={ledger}
              onCheck={this.handleCheck}
              onDelete={this.handleDelete}
              onDetail={this.handleDetail}
            />
          );
        })}
        <View className='my-createLedger-btn'>
          <Button
            hover-class='none'
            openType='getUserInfo'
            onGetUserInfo={this.onGetUserInfo}
            onClick={this.navigateToCreateLedger}
          >
            <Text>创建账本</Text>
          </Button>
        </View>
      </View>
    );
  }
}

export default My;
