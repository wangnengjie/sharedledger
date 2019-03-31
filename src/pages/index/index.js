import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Navigator,
  Text,
  Image,
  MovableArea,
  MovableView
} from "@tarojs/components";
import "./index.scss";
import events, { globalData } from "../../utils/events";
import BillCard from "../../Components/BillCard/BillCard";
import arrow from "../../images/arrow.png";
import addOneBall from "../../images/addOneBall.png";

const getAuth = async () => {
  return await Taro.getSetting().then(res => res.authSetting["scope.userInfo"]);
};

class Index extends Component {
  config = {
    navigationBarTitleText: "首页"
  };

  constructor(props) {
    super(props);
    this.state = {
      slide: false,
      condition: "",
      ledgerName: "",
      ledgerId: "",
      members: [],
      bill: []
    };
    this.eventsGetLedger = this.eventsGetLedger.bind(this);
    this.handleSlide = this.handleSlide.bind(this);
  }

  eventsGetLedger(obj) {
    this.setState({ ...obj });
  }

  handleSlide() {
    this.setState(prevState => ({ slide: !prevState.slide }));
  }

  test() {
    console.log("click!");
  }

  async componentWillMount() {
    //事件挂载
    events.on("getLedger", this.eventsGetLedger);

    //获取用户授权信息
    //TODO:接口可用后记得改成false
    const auth = (await getAuth()) || true;
    console.log(auth);
    await this.setState({ auth });
    console.log(auth);
    //是否跳转授权页
    if (auth) {
    } else {
    }

    Taro.setStorageSync("uid", "member1");
    let obj = {
      run: [
        {
          ledgerId: "aaaaaaaaaa",
          ledgerName: "test1"
        },
        {
          ledgerId: "b",
          ledgerName: "test2"
        }
      ],
      done: [
        {
          ledgerId: "c",
          ledgerName: "test3"
        },
        {
          ledgerId: "d",
          ledgerName: "test4"
        }
      ],
      condition: "run",
      ledgerName: "test1",
      ledgerId: "aaaaaaaaaa",
      createTime: new Date(),
      use:["恰饭","测试","长度测试"],
      members: [
        {
          uid: "member1",
          nickName: "大熊猫",
          avatarUrl: "nothing"
        },
        {
          uid: "member2",
          nickName: "stone-page",
          avatarUrl: "nothing"
        },
        {
          uid: "member3",
          nickName: "测试号",
          avatarUrl: "nothing"
        },
        {
          uid: "member4",
          nickName: "测试号2",
          avatarUrl: "nothing"
        }
      ],
      bill: [
        {
          billId: "bill1",
          payer: "member1",
          maker: "member1",
          participant: ["member1", "member2", "member3", "member4"],
          money: 11.3,
          use: "",
          comment: "test",
          date: new Date().toUTCString()
        },
        {
          billId: "bill2",
          payer: "member2",
          maker: "member1",
          participant: ["member1", "member2"],
          money: 12.3,
          use: "恰饭",
          comment: "",
          date: new Date().toUTCString()
        }
      ]
    };
    events.trigger("getLedger", obj);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    //取参
    const {
      condition,
      ledgerName,
      ledgerId,
      members,
      bill,
      run,
      auth
    } = this.state;
    //创建userInfo键值对
    let userIn = {};
    members.forEach(e => {
      userIn[e.uid] = e;
    });

    return (
      <View>
        {auth && run.length === 0 && <View />}

        {auth && run.length > 0 && (
          <View>
            {/* slideBar */}
            <View className='head-bar'>
              <View className='back-div' />
              <View
                className={`account-bar ${
                  this.state.slide ? "view-slide" : ""
                }`}
              >
                {run.map((e, index) =>
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
              {bill.map((e, index) => (
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
            {/* 全局拖动球 */}
            <MovableArea>
              <MovableView
                x='690px'
                y='66666px'
                inertia='true'
                direction='all'
                out-of-bounds='true'
              >
                <Navigator url={`/pages/bill/bill?type=add&page=index&ledgerId=${ledgerId}`} openType='navigate' hover-class='none'>
                  <Image src={addOneBall} />
                </Navigator>
              </MovableView>
            </MovableArea>
          </View>
        )}
      </View>
    );
  }
}

export default Index;
