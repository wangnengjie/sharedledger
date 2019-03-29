import Taro, { Component } from "@tarojs/taro";
import { View, Navigator, Button } from "@tarojs/components";
import "./index.scss";
import events, { globalData } from "../../utils/events";
import BillCard from "../../Components/BillCard/BillCard";

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
      condition: "",
      ledgerName: "",
      ledgerId: "",
      members: [],
      bill: []
    };
    this.eventsGetLedger = this.eventsGetLedger.bind(this);
  }

  async componentWillMount() {
    //事件挂载
    events.on("getLedger", this.eventsGetLedger);

    //获取用户授权信息
    //TODO:接口可用后记得改成false
    const auth = await getAuth()||true;
    console.log(auth)
    await this.setState({auth});
    console.log(auth);
    //是否跳转授权页
    if(auth){

    }else{

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

  eventsGetLedger(obj) {
    this.setState({ ...obj });
  }

  render() {
    const {
      condition,
      ledgerName,
      ledgerId,
      members,
      bill,
      run,
      auth
    } = this.state;
    let userIn = {};
    members.forEach(e => {
      userIn[e.uid] = e;
    });
    console.log(userIn);
    return (
      <View>
        {auth && run.length === 0 && <View />}

        {auth && run.length > 0 && (
          <View>
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
        )}
      </View>
    );
  }
}

export default Index;
