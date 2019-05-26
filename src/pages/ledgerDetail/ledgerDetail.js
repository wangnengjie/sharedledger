import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import events, { globalData, tempLedgerData } from "../../utils/events";
import { myRequest } from "../../utils/myRequest";
import { checkOutPayment } from "../../utils/checkOut";
import BillCard from "../../Components/BillCard/BillCard";
import User from "../../Components/User/User";
import Curtain from "../../Components/Curtain/Curtain";
import Payment from "../../Components/Payment/Payment";
import "./ledgerDetail.scss";
import inviteIcon from "../../images/inviteIcon.png";
import inviteButton from "../../images/inviteButton.png";

class ledgerDetail extends Component {
  config = {
    enablePullDownRefresh: true
  };

  constructor(props) {
    super(props);
    this.eventsAddOne = this.eventsAddOne.bind(this);
    this.eventsDeleteBill = this.eventsDeleteBill.bind(this);
    this.eventsLedgerActive = this.eventsLedgerActive.bind(this);
    this.eventsLedgerCheckOut = this.eventsLedgerCheckOut.bind(this);
    this.eventsModifyBill = this.eventsModifyBill.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleOnSure = this.handleOnSure.bind(this);
    this.handleAddOne = this.handleAddOne.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.state = {
      curtain: {
        isOpened: false,
        msg: "",
        type: 0,
        extraMsg: ""
      },
      ledgerId: 0,
      ledgerName: "",
      categories: [],
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

  async handleActivate() {
    const ledgerId = this.state.ledgerId;
    const data = await myRequest("/ledger", "PUT", { done: false, ledgerId });
    if (data) {
      events.trigger("ledgerActive", ledgerId);
      this.setState({ done: false });
    }
  }

  handleAddOne() {
    const { users, categories, ledgerId, ledgerName } = this.state;
    Object.assign(tempLedgerData, { users, categories, ledgerId, ledgerName });
    Taro.navigateTo({
      url: `/pages/bill/bill?page=ledgerDetail&ledgerId=${ledgerId}`
    });
  }

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

  handleCheck(ledgerId) {
    this.setState({
      curtain: {
        isOpened: true,
        msg: "确定要结算账本吗",
        type: 2,
        extraMsg: ledgerId
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
      default:
        this.handleCloseCurtain();
        break;
    }
  }

  onShareAppMessage() {
    const { ledgerName, invitationKey } = this.state;
    return {
      title: `${globalData.userInfo.nickName}邀请您加入账本 ${ledgerName}`,
      path: `/pages/index/index?invitationKey=${invitationKey}&ledgerName=${ledgerName}&uid=${Taro.getStorageSync(
        "uid"
      )}`,
      imageUrl: inviteIcon
    };
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

  eventsLedgerActive(ledgerId) {
    if (ledgerId === this.state.ledgerId) {
      this.setState({ done: false });
    }
  }

  eventsLedgerCheckOut(ledgerId) {
    if (ledgerId === this.state.ledgerId) {
      this.setState({ done: true });
    }
  }

  eventsModifyBill(body) {
    if (body.ledgerId === this.state.ledgerId) {
      const bills = this.state.bills.concat();
      Object.assign(
        bills.find(bill => bill.billId === body.bill.billId),
        JSON.parse(JSON.stringify(body.bill))
      );
      this.setState({ bills });
    }
  }

  naviToGraph() {
    const { users, categories, ledgerId, ledgerName, bills } = this.state;
    Object.assign(tempLedgerData, {
      users,
      categories,
      ledgerId,
      ledgerName,
      bills
    });
    Taro.navigateTo({
      url: "/pages/graph/graph"
    });
  }

  async componentWillMount() {
    events.on("addOne", this.eventsAddOne);
    events.on("deleteBill", this.eventsDeleteBill);
    events.on("ledgerActive", this.eventsLedgerActive);
    events.on("ledgerCheckOut", this.eventsLedgerCheckOut);
    events.on("modifyBill", this.eventsModifyBill);
    const ledgerId = this.$router.params.ledgerId;
    let data = await myRequest("/ledger", "GET", { ledgerId });
    const ledgerName = data.ledger.ledgerName;
    if (data) {
      this.setState({
        ...data.ledger
      });
      Taro.setNavigationBarTitle({ title: ledgerName });
    }
    data = await myRequest("/invitation", "POST", { ledgerId });
    if (data) {
      this.setState({ invitationKey: data.invitationKey });
    }
  }

  componentWillUnmount() {
    events.off("addOne", this.eventsAddOne);
    events.off("deleteBill", this.eventsDeleteBill);
    events.off("ledgerActive", this.eventsLedgerActive);
    events.off("ledgerCheckOut", this.eventsLedgerCheckOut);
    events.off("modifyBill", this.eventsModifyBill);
  }

  render() {
    const { ledgerId, users, bills, done, curtain } = this.state;
    let payments = [];
    done && (payments = checkOutPayment(bills, users));
    return (
      <View>
        {curtain.isOpened && (
          <Curtain
            onSure={this.handleOnSure}
            onClose={this.handleCloseCurtain}
            msg={curtain.msg}
          />
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

        {done && (
          <View>
            <View className='detail-title-bar'>
              <Text>结算结果</Text>
            </View>
            <View>
              {payments.map((payment, index) => {
                return (
                  <Payment
                    from={payment.from}
                    to={payment.to}
                    money={payment.money}
                    key={index}
                  />
                );
              })}
            </View>
          </View>
        )}

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
              <View className='title-btn-white' onClick={this.naviToGraph}>
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
                ledgerId={ledgerId}
                page='ledgerDetail'
                onDelete={this.handleDelete.bind(this, bill.billId, ledgerId)}
              />
            ))}
          </View>
        </View>

        <View className='detail-btn-bar'>
          {!done && (
            <View
              className='detail-btn-checkout'
              onClick={this.handleCheck.bind(this, ledgerId)}
            >
              <Text>结账</Text>
            </View>
          )}
          <View
            className='detail-btn-return'
            onClick={() => Taro.navigateBack({})}
          >
            <Text>返回</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default ledgerDetail;
