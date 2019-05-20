import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import events, { globalData } from "../../utils/events";
import { myRequest } from "../../utils/myRequest";
import BillCard from "../../Components/BillCard/BillCard";
import User from "../../Components/User/User";
import Curtain from "../../Components/Curtain/Curtain";
import "./ledgerDetail.scss";

import inviteButton from "../../images/inviteButton.png";

class ledgerDetail extends Component {
  config = {
    enablePullDownRefresh: true
  };

  constructor(props) {
    super(props);
    this.eventsAddOne = this.eventsAddOne.bind(this);
    this.eventsDeleteBill = this.eventsDeleteBill.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleOnSure = this.handleOnSure.bind(this);
    this.state = {
      curtain: {
        isOpened: false,
        msg: "",
        type: 0,
        extraMsg: ""
      },
      ledgerId: 0,
      ledgerName: "",
      users: [],
      bills: [],
      done: false
    };
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

  handleActivate() {}

  handleAddOne() {}

  handleDelete(billId, ledgerId) {
    this.setState({
      curtain: {
        isOpened: true,
        msg: "确认要删除该笔账单吗",
        type: 1,
        extraMsg: [billId, ledgerId]
      }
    });
  }

  async handleOnSure() {
    const type = this.state.curtain.type;
    switch (type) {
      case 1:
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

  async onShareAppMessage() {
    const { ledgerId, ledgerName } = this.state;
    const data = await myRequest("/invitation", "POST", { ledgerId });
    if (data) {
      return {
        title: `${globalData.userInfo.nickName}邀请您加入账本 ${ledgerName}`,
        path: `/pages/index/index?invitationKey=${
          data.invitationKey
        }&ledgerName=${ledgerName}`
      };
    }
  }

  eventsAddOne(detail) {
    if (detail.ledgerId === this.state.ledgerId) {
      const bills = this.state.bills.concat();
      bills.unshift(detail.bill);
      this.setState({ bills });
    }
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

  async componentWillMount() {
    events.on("addOne", this.eventsAddOne);
    events.on("deleteBill", this.eventsDeleteBill);
    const ledgerId = this.$router.params.ledgerId;
    const data = await myRequest("/ledger", "GET", { ledgerId });
    if (data) {
      this.setState({
        ...data.ledger,
        ledgerId: parseInt(data.ledger.ledgerId)
      });
      Taro.setNavigationBarTitle({ title: data.ledger.ledgerName });
    }
  }

  componentWillUnmount() {
    events.off("addOne", this.eventsAddOne);
    events.off("deleteBill", this.eventsDeleteBill);
  }

  render() {
    const { ledgerId, users, bills, done, curtain } = this.state;
    return (
      <View>
        {curtain.isOpened && (
          <Curtain onClose={this.handleCloseCurtain} msg={curtain.msg} />
        )}
        <View
          className={
            done ? "ledger-check ledger-done" : "ledger-check ledger-run"
          }
        >
          <View>
            <Text>{done ? "已结" : "未结"}</Text>
          </View>
        </View>

        <View className='detail-participants-bar'>
          <View className='detail-title-bar'>
            <Text>参与人</Text>
          </View>
          <View className='detail-participants-area'>
            {users.map(user => (
              <User
                key={user.uid}
                nickName={user.nickName}
                avatarUrl={user.avatarUrl}
              />
            ))}
            {!done && (
              <View className='invite-btn'>
                <Button hoverClass='none' openType='share'>
                  <Image src={inviteButton} />
                </Button>
              </View>
            )}
          </View>
        </View>

        <View className='detail-billCard-bar'>
          <View className='detail-title-bar'>
            <Text>明细</Text>
            <View className='detail-title-btn-bar'>
              {done ? (
                <View className='title-btn-blue' onClick={this.handleActivate}>
                  <Text>激活</Text>
                </View>
              ) : (
                <View className='title-btn-blue' onClick={this.handleAddOne}>
                  <Text>记一笔</Text>
                </View>
              )}
              <View className='title-btn-white'>
                <Text>图表</Text>
              </View>
            </View>
          </View>

          <View className='detail-billcard-area'>
            {bills.map(bill => (
              <BillCard
                key={bill.billId}
                billInfo={bill}
                done={done}
                onDelete={this.handleDelete.bind(this, bill.billId, ledgerId)}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }
}

export default ledgerDetail;
