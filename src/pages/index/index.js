import Taro, { Component } from "@tarojs/taro";
import { View, Navigator, Button } from "@tarojs/components";
import "./index.scss";
import events, { globalData } from "../../utils/events";
import BillCard from "../../Components/BillCard/BillCard";

class Index extends Component {
  config = {
    navigationBarTitleText: "首页"
  };

  constructor(props) {
    super(props);
    this.state = {
      uid: "member1",
      condition: "",
      ledgerName: "",
      ledgerId: "",
      members: [],
      bill: []
    };
    this.eventsGetLedger = this.eventsGetLedger.bind(this);
  }

  componentWillMount() {
    events.on("getLedger", this.eventsGetLedger);
    let obj = {
      auth: true,
      uid: "member1",
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
      uid,
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
        {!auth&&(<View></View>)}
        
        {}

        {auth && run.length > 0 && (
          <View>
            {bill.map(e => (
              <BillCard
                cardInfo={e}
                members={userIn}
                key={e.billId}
                uid={uid}
              />
            ))}
          </View>
        )}

        
      </View>
    );
  }
}

export default Index;
