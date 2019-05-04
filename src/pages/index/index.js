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
    usingComponents: {}
  };

  constructor(props) {
    super(props);
    this.eventsGetIndex = this.eventsGetIndex.bind(this);
    this.eventsSuccessInvite = this.eventsSuccessInvite.bind(this);
    this.eventsCreatLedger = this.eventsCreatLedger.bind(this);
    this.eventsSwitchLedger = this.eventsSwitchLedger.bind(this);
    this.handleSlide = this.handleSlide.bind(this);
    this.handleCloseCurtain = this.handleCloseCurtain.bind(this);
    this.handleInvite = this.handleInvite.bind(this);
    this.handleSwitchLedger = this.handleSwitchLedger.bind(this);
    this.handleOnSure = this.handleOnSure.bind(this);
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
      users: [],
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
    const run = this.state.run;
    const { ledgerName, ledgerId, done } = ledger;
    const newRun = run.concat();
    newRun.unshift(ledgerId, ledgerName, done);
    this.setState({
      run: newRun,
      ...ledger
    });
  }

  async eventsCreatLedger(obj) {
    const run = this.state.run;
    const newRun = run.concat();
    newRun.unshift({ ...obj, done: false });
    this.setState({ run: newRun });
    const data = await myRequest("/ledger", "GET", { ledgerId: obj.ledgerId });
    if (data !== null) {
      events.trigger("switchLedger", data.ledger);
    }
  }

  eventsSwitchLedger(obj) {
    this.setState({ ...obj });
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

  handleOnSure() {
    const type = this.state.curtain.type;
    switch (type) {
      case 1:
        this.handleInvite(this.state.invitationKey);
        break;
      case 2:
        // 结算
        break;
      case 3:
        // 删除bill
        break;
      default:
        break;
    }
  }

  async handleSwitchLedger(ledgerId) {
    const data = await myRequest("ledger", "GET", { ledgerId });
    if (data !== null) {
      events.trigger("switchLedger", data.ledger);
    }
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
        this.handleCloseCurtain();
      }
    }
  }

  onGetUserInfo(e) {
    const userInfo = e.detail.userInfo;
    if (!globalData.auth && userInfo) {
      events.trigger("setUserInfo", userInfo);
      events.trigger("setAuth", true);
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

  async componentWillMount() {
    const that = this;
    const { invitationKey, ledgerName } = this.$router.params;
    //显示加载中
    Taro.showLoading({ title: "程序初始化中", mask: true });
    //事件挂载
    events.on("getIndex", this.eventsGetIndex);
    events.on("successInvite", this.eventsSuccessInvite);
    events.on("createLedger", this.eventsCreatLedger);
    events.on("switchLedger", this.eventsSwitchLedger);
    //用户登录
    await myLogin();
    //获取用户授权信息
    const auth = (await getAuth()) || false;
    events.trigger("setAuth", auth);
    if (auth) {
      //这一步放异步
      Taro.getUserInfo().then(res => {
        const userInfo = res.userInfo;
        that.setState({ userInfo });
        events.trigger("setUserInfo", userInfo);
        myRequest("/user", "PUT", {
          uid: Taro.getStorageSync("uid"),
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        });
      });
    }
    //获取首页信息,事件中会关闭加载中图标
    const data = await myRequest("/index", "GET");
    events.trigger("getIndex", data);
    //处理邀请逻辑
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
  }

  componentDidShow() {
    this.$scope.getTabBar().setData({
      selected: 0 // 当前页面对应的 index
    });
  }

  render() {
    //取参
    const { ledgerId, users, bills, run, curtain } = this.state;
    //创建userInfo键值对
    let userIn = {};
    users.forEach(e => {
      userIn[e.uid] = e;
    });
    //处理账本
    // console.log(run);
    const _run = run.concat();
    let i = _run.findIndex(e => e.ledgerId === ledgerId);
    _run.unshift(_run[i]);
    _run.splice(i + 1, 1);

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
                {_run.map((e, index) =>
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
                        onClick={this.handleSwitchLedger.bind(this, e.ledgerId)}
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
                  members={userIn}
                  key={e.billId}
                  uid={Taro.getStorageSync("uid")}
                  index={index}
                />
              ))}
            </View>
            {/*结算按钮*/}
            <View className='check-out'>
              <Text>结账</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Index;
