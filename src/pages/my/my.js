import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import events, { globalData, tempLedgerData } from "../../utils/events";
import { myRequest } from "../../utils/myRequest";
import "./my.scss";
import LedgerCard from "../../Components/LedgerCard/LedgerCard";
import Curtain from "../../Components/Curtain/Curtain";

class My extends Component {
  config = {
    navigationBarTitleText: "我的账本",
    usingComponents: {}
  };

  constructor(props) {
    super(props);
    this.eventsSuccessInvite = this.eventsSuccessInvite.bind(this);
    this.eventsCreateLedger = this.eventsCreateLedger.bind(this);
    this.handleCloseCurtain = this.handleCloseCurtain.bind(this);
    this.state = {
      run: [],
      done: [],
      curtain: {
        isOpened: false,
        msg: "",
        type: 0,
        extraMsg: ""
      }
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

  eventsSuccessInvite(ledger) {
    const run = this.state.run.concat();
    const { ledgerName, ledgerId, done } = JSON.parse(JSON.stringify(ledger));
    run.unshift({ ledgerName, ledgerId, done });
    this.setState({ run });
  }

  eventsCreateLedger(obj) {
    const run = this.state.run.concat();
    run.unshift({ ...obj, done: false });
    this.setState({ run });
  }

  async handleDetail(ledgerId) {
    Taro.navigateTo({
      url: `/pages/ledgerDetail/ledgerDetail?ledgerId=${ledgerId}`
    });
  }

  handleCheck(ledgerId) {
    console.log("aaa");
  }

  handleDelete(ledgerId, isDone) {
    this.setState({
      curtain: {
        isOpened: true,
        msg: "确定要删除账本吗",
        type: 1,
        extraMsg: [ledgerId, isDone]
      }
    });
  }

  async handleSuccessDelete(ledgerId, isDone) {
    const data = await myRequest("/ledger", "DELETE", { ledgerId });
    if (data) {
      let array = isDone ? this.state.done.concat() : this.state.run.concat();
      array = array.filter(e => e.ledgerId !== ledgerId);
      isDone ? this.setState({ done: array }) : this.setState({ run: array });
      events.trigger("deleteLedger", ledgerId, isDone);
    }
  }

  handleCloseCurtain() {
    this.setState({
      curtain: {
        isOpened: false,
        msg: "",
        type: 0,
        extraMsg: ""
      }
    });
  }

  async handleOnSure() {
    const type = this.state.curtain.type;
    switch (type) {
      case 1:
        // 删除账本
        await this.handleSuccessDelete(...this.state.curtain.extraMsg);
        this.handleCloseCurtain();
        break;
      default:
        break;
    }
  }

  componentWillMount() {
    events.on("successInvite", this.eventsSuccessInvite);
    events.on("createLedger", this.eventsCreateLedger);
    const { run, done } = JSON.parse(JSON.stringify(globalData));
    this.setState({ run, done });
  }

  componentDidShow() {
    this.$scope.getTabBar().setData({
      selected: 1 // 当前页面对应的 index
    });
  }

  componentWillUnmount() {
    events.off("successInvite", this.eventsSuccessInvite);
    events.off("createLedger", this.eventsCreateLedger);
  }

  render() {
    const { curtain, run, done } = this.state;
    return (
      <View className='my-main'>
        {curtain.isOpened && (
          <Curtain
            msg={curtain.msg}
            onSure={this.handleOnSure}
            onClose={this.handleCloseCurtain}
            onGetUserInfo={this.onGetUserInfo}
          />
        )}

        {run.map(ledger => {
          return (
            <LedgerCard
              key={ledger.ledgerId}
              ledger={ledger}
              onCheck={this.handleCheck.bind(this, ledger.ledgerId)}
              onDelete={this.handleDelete.bind(
                this,
                ledger.ledgerId,
                ledger.done
              )}
              onDetail={this.handleDetail.bind(this, ledger.ledgerId)}
            />
          );
        })}
        {done.map(ledger => {
          return (
            <LedgerCard
              key={ledger.ledgerId}
              ledger={ledger}
              onCheck={this.handleCheck.bind(this, ledger.ledgerId)}
              onDelete={this.handleDelete.bind(
                this,
                ledger.ledgerId,
                ledger.done
              )}
              onDetail={this.handleDetail.bind(this, ledger.ledgerId)}
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
