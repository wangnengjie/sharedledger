import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Button, Navigator } from "@tarojs/components";
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
    this.handleSlide = this.handleSlide.bind(this);
    this.handleCloseCurtain = this.handleCloseCurtain.bind(this);
    this.handleInvite = this.handleInvite.bind(this);
    this.onGetUserInfo = this.onGetUserInfo.bind(this);
    this.state = {
      slide: false,
      curtain: {
        isOpened: false,
        msg: "",
        onClose() {},
        onSure() {}
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
    this.setState({
      run: run.slice().unshift(ledgerId, ledgerName, done),
      ...ledger
    });
  }

  handleSlide() {
    this.setState(prevState => ({ slide: !prevState.slide }));
  }

  handleCloseCurtain() {
    this.setState({
      curtain: {
        isOpened: false,
        msg: "",
        onClose() {},
        onSure() {}
      }
    });
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
    if (!this.state.auth && userInfo) {
      events.trigger("setUserInfo", userInfo);
      events.trigger("setAuth", !this.state.auth);
      this.setState(prevState => ({
        auth: !prevState.auth,
        userInfo
      }));
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
    //用户登录
    await myLogin();
    //获取用户授权信息
    const auth = (await getAuth()) || false;
    this.setState({ auth });
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
        curtain: {
          isOpened: true,
          msg: `确认加入账本 ${ledgerName} 吗`,
          onClose: that.handleCloseCurtain,
          onSure: () => {
            that.handleInvite(invitationKey);
          }
        }
      });
    }
  }

  componentWillUnmount() {
    events.off("getIndex", this.eventsGetIndex);
    events.off("successInvite", this.eventsSuccessInvite);
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
    const _run = run.slice();
    let i = _run.findIndex(e => e.ledgerId === ledgerId);
    _run.unshift(_run[i]);
    _run.splice(i + 1, 1);

    return (
      <View>
        {/* 幕帘 */}

        {curtain.isOpened && (
          <Curtain curtain={curtain} onGetUserInfo={this.onGetUserInfo} />
        )}

        {/* welcome */}

        {run.length === 0 && (
          <View>
            <View className='welcome-bar'>
              <Image src={welcome} />
              <Text>还没有账本，快去创建你的账本吧！</Text>
              <Button
                hover-class='none'
                openType='getUserInfo'
                bindgetuserinfo={this.onGetUserInfo}
                onClick={this.navigateToCreateLedger}
              >
                <Text>创建账本</Text>
              </Button>
            </View>
          </View>
        )}

        {/* 账目详情 */}
        {run.length > 0 && (
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
                        onClick={this.handleSlide}
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
