import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import "./index.scss";
import "./welcome.scss";
import events, { globalData } from "../../utils/events";
import { myLogin, myRequest } from "../../utils/myRequest";
import getAuth from "../../utils/getAuth";
import BillCard from "../../Components/BillCard/BillCard";
import Curtain from "../../Components/Curtain/Curtain";
import arrow from "../../images/arrow.png";
import welcome from "../../images/welcome.png";

class Index extends Component {
  config = {
    navigationBarTitleText: "共享账本",
    usingComponents: {},
    enablePullDownRefresh: true
  };

  constructor(props) {
    super(props);
    this.eventsGetIndex = this.eventsGetIndex.bind(this);
    this.eventsSuccessInvite = this.eventsSuccessInvite.bind(this);
    this.eventsCreatLedger = this.eventsCreatLedger.bind(this);
    this.eventsSwitchLedger = this.eventsSwitchLedger.bind(this);
    this.eventsAddOne = this.eventsAddOne.bind(this);
    this.eventsDeleteLedger = this.eventsDeleteLedger.bind(this);
    this.eventsDeleteBill = this.eventsDeleteBill.bind(this);
    this.eventsLedgerActive = this.eventsLedgerActive.bind(this);
    this.eventsLedgerCheckOut = this.eventsLedgerCheckOut.bind(this);
    this.handleSlide = this.handleSlide.bind(this);
    this.handleCloseCurtain = this.handleCloseCurtain.bind(this);
    this.handleInvite = this.handleInvite.bind(this);
    this.handleSwitchLedger = this.handleSwitchLedger.bind(this);
    this.handleOnSure = this.handleOnSure.bind(this);
    this.handleDeleteBill = this.handleDeleteBill.bind(this);
    this.onGetUserInfo = this.onGetUserInfo.bind(this);
    this.state = {
      slide: false,
      curtain: {
        isOpened: false,
        msg: "",
        type: 0,
        extraMsg: ""
      },
      run: [],
      ledgerId: "",
      bills: []
    };
  }

  eventsGetIndex(obj) {
    let { run, ledger } = obj;
    this.setState(
      {
        run,
        ...ledger
      },
      () => {
        Taro.hideLoading();
      }
    );
  }

  eventsSuccessInvite(ledger) {
    const run = this.state.run.concat();
    const { ledgerName, ledgerId, done } = ledger;
    run.unshift({ ledgerId, ledgerName, done });
    this.setState({
      run,
      ...ledger
    });
  }

  async eventsCreatLedger(obj) {
    const run = this.state.run.concat();
    run.unshift({ ...obj, done: false });
    this.setState({ run });
    const data = await myRequest("/ledger", "GET", { ledgerId: obj.ledgerId });
    if (data !== null) {
      events.trigger("switchLedger", data.ledger);
    }
  }

  eventsSwitchLedger(obj) {
    this.setState({ ...obj });
  }

  eventsAddOne(detail) {
    if (detail.ledgerId === this.state.ledgerId) {
      const bills = this.state.bills;
      bills.unshift(detail.bill);
      this.setState({ bills });
    }
  }

  eventsDeleteLedger(ledgerId, isDone) {
    if (isDone) return;
    let run = this.state.run.concat();
    run = run.filter(e => e.ledgerId !== ledgerId);
    this.handleSwitchLedger(run[0].ledgerId);
    this.setState({ run });
  }

  eventsDeleteBill(ledgerId, billId) {
    if (ledgerId === this.state.ledgerId) {
      const bills = this.state.bills;
      const index = bills.findIndex(bill => billId === bill.billId);
      if (index < 0) return;
      bills.splice(index, 1);
      this.setState({ bills });
    }
  }

  async eventsLedgerActive(ledgerId) {
    const run = this.state.run.concat();
    const index = run.findIndex(e => e.ledgerId === ledgerId);
    if (index < 0) {
      const data = await myRequest("/ledger", "GET", { ledgerId });
      if (data) {
        run.unshift({
          ledgerId,
          ledgerName: data.ledger.ledgerName,
          done: false
        });
        this.setState({ run });
        this.eventsSwitchLedger(data.ledger);
      }
    }
  }

  eventsLedgerCheckOut(ledgerId) {
    const run = this.state.run.concat();
    run.splice(run.findIndex(e => e.ledgerId === ledgerId), 1);
    this.setState({ run });
    this.handleSwitchLedger(run[0].ledgerId);
  }

  handleSlide() {
    this.setState(prevState => ({ slide: !prevState.slide }));
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
        await this.handleInvite(this.state.invitationKey);
        this.handleCloseCurtain();
        break;
      case 2:
        const _ledgerId = this.state.curtain.extraMsg;
        const _data = await myRequest("/ledger", "PUT", {
          done: true,
          ledgerId: _ledgerId
        });
        if (_data) {
          events.trigger("ledgerCheckOut", _ledgerId);
          Taro.navigateTo({
            url: `/pages/checkOut/checkOut?ledgerId=${_ledgerId}`
          });
        }
        this.handleCloseCurtain();
        break;
      case 3:
        const [billId, ledgerId] = this.state.curtain.extraMsg;
        const data = await myRequest("/bill", "DELETE", { billId, ledgerId });
        if (data) {
          events.trigger("deleteBill", ledgerId, billId);
        }
        this.handleCloseCurtain();
        break;
      default:
        break;
    }
  }

  async handleSwitchLedger(ledgerId) {
    const data = await myRequest("/ledger", "GET", { ledgerId });
    if (data !== null) {
      events.trigger("switchLedger", data.ledger);
    }
    this.setState({ slide: false });
  }

  async handleInvite(invitationKey) {
    if (!globalData.auth) return;
    const data = await myRequest("/participation", "POST", { invitationKey });
    if (data) {
      const ledger = await myRequest("/ledger", "GET", {
        ledgerId: data.ledgerId
      });
      if (ledger) {
        events.trigger("successInvite", ledger.ledger);
        Taro.showToast({ title: "成功加入账本", icon: "none" });
      }
    }
  }

  handleDeleteBill(billId, ledgerId) {
    this.setState({
      curtain: {
        isOpened: true,
        msg: "确认要删除该笔账单吗",
        type: 3,
        extraMsg: [billId, ledgerId]
      }
    });
  }

  handleCheckOut() {
    const ledgerId = this.state.ledgerId;
    this.setState({
      curtain: {
        isOpened: true,
        msg: "确定要结算账本吗",
        type: 2,
        extraMsg: ledgerId
      }
    });
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

  async onPullDownRefresh() {
    const data = await myRequest("/ledger", "GET", {
      ledgerId: this.state.ledgerId
    });
    events.trigger("switchLedger", data.ledger);
    Taro.stopPullDownRefresh();
  }

  navigateToCreateLedger() {
    if (!globalData.auth) return;
    Taro.navigateTo({
      url: "/pages/createLedger/createLedger"
    });
  }

  async componentWillMount() {
    //显示加载中
    Taro.showLoading({ title: "程序初始化中", mask: true });
    //事件挂载
    events.on("getIndex", this.eventsGetIndex);
    events.on("successInvite", this.eventsSuccessInvite);
    events.on("createLedger", this.eventsCreatLedger);
    events.on("switchLedger", this.eventsSwitchLedger);
    events.on("addOne", this.eventsAddOne);
    events.on("deleteLedger", this.eventsDeleteLedger);
    events.on("deleteBill", this.eventsDeleteBill);
    events.on("ledgerActive", this.eventsLedgerActive);
    events.on("ledgerCheckOut", this.eventsLedgerCheckOut);
    const storage = Taro.getStorageInfoSync();
    const auth = (await getAuth()) || false;
    globalData.auth = auth;
    if (!storage.keys.includes("uid") || !storage.keys.includes("sessionId")) {
      await myLogin(auth);
    }
    //获取首页信息,事件中会关闭加载中图标
    const data = await myRequest("/index", "GET");
    if (data) {
      events.trigger("getIndex", data);
    }
    //处理邀请逻辑
    const { invitationKey, ledgerName } = this.$router.params;
    if (invitationKey) {
      this.setState({
        invitationKey,
        curtain: {
          isOpened: true,
          msg: `确认加入账本 ${ledgerName} 吗`,
          type: 1,
          extraMsg: ""
        }
      });
    }
  }

  componentWillUnmount() {
    events.off("getIndex", this.eventsGetIndex);
    events.off("successInvite", this.eventsSuccessInvite);
    events.off("createLedger", this.eventsCreatLedger);
    events.off("switchLedger", this.eventsSwitchLedger);
    events.off("addOne", this.eventsAddOne);
    events.off("deleteLedger", this.eventsDeleteLedger);
    events.off("deleteBill", this.eventsDeleteBill);
    events.off("ledgerActive", this.eventsLedgerActive);
    events.off("ledgerCheckOut", this.eventsLedgerCheckOut);
  }

  componentDidShow() {
    this.$scope.getTabBar().setData({
      selected: 0 // 当前页面对应的 index
    });
  }

  render() {
    //取参
    const { ledgerId, bills, run, curtain } = this.state;
    //处理账本
    // console.log(run);
    const _run = run.concat();
    const i = _run.findIndex(e => e.ledgerId === ledgerId);
    _run.unshift(..._run.splice(i, 1));
    return (
      <View>
        {/* 幕帘 */}

        {curtain.isOpened && (
          <Curtain
            msg={curtain.msg}
            onSure={this.handleOnSure}
            onClose={this.handleCloseCurtain}
            onGetUserInfo={this.onGetUserInfo}
          />
        )}

        {/* welcome */}

        {!run.length && (
          <View>
            <View className='welcome-bar'>
              <Image src={welcome} />
              <Text>还没有账本，快去创建你的账本吧！</Text>
              <View>
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
          </View>
        )}

        {/* 账目详情 */}
        {run.length && (
          <View>
            {/* slideBar */}
            <View className='head-bar'>
              <View className='back-div' />
              <View
                className={`account-bar ${
                  this.state.slide ? "view-slide" : ""
                }`}
              >
                {_run
                  .slice(0, this.state.slide ? _run.length : 1)
                  .map((e, index) =>
                    index === 0 ? (
                      <View
                        key={e.ledgerId}
                        className='account-line'
                        onClick={this.handleSlide}
                      >
                        <Text>{e.ledgerName}</Text>
                      </View>
                    ) : (
                      <fragment>
                        <View className='line' />
                        <View
                          key={e.ledgerId}
                          className='account-line'
                          onClick={this.handleSwitchLedger.bind(
                            this,
                            e.ledgerId
                          )}
                        >
                          <Text>{e.ledgerName}</Text>
                        </View>
                      </fragment>
                    )
                  )}
                <View className='slide-button' onClick={this.handleSlide}>
                  <Image
                    src={arrow}
                    className={this.state.slide ? "img-slide" : ""}
                  />
                </View>
              </View>
            </View>
            {/* BillCard */}
            <View className='billCard-bar'>
              {bills.map((e, index) => (
                <BillCard
                  billInfo={e}
                  key={e.billId}
                  index={index}
                  onDelete={this.handleDeleteBill.bind(
                    this,
                    e.billId,
                    ledgerId
                  )}
                />
              ))}
            </View>
            {/*结算按钮*/}
            <View className='check-out' onClick={this.handleCheckOut}>
              <Text>结账</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Index;
