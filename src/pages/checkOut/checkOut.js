import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import Payment from "../../Components/Payment/Payment";
import { countMoney, checkOutPayment } from "../../utils/checkOut";
import { myRequest } from "../../utils/myRequest";
import "./checkOut.scss";

class checkOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ledgerName: "",
      users: [],
      bills: []
    };
  }

  async componentWillMount() {
    const ledgerId = this.$router.params.ledgerId;
    const data = await myRequest("/ledger", "GET", { ledgerId });
    if (data) {
      this.setState({ ...data.ledger });
    }
  }

  render() {
    const { bills, users, ledgerName } = this.state;
    const totalMoney = countMoney(bills);
    const payments = checkOutPayment(bills, users);
    return (
      <View>
        <View className='check-out-title'>
          <Text className='title-1' space='emsp'>
            {`${ledgerName} 结算结果`}
          </Text>
          <Text className='title-2'>合计金额</Text>
          <View className='title-3'>
            <Text>{totalMoney}</Text>
            <Text className='title-3-yuan'>元</Text>
          </View>
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
        <View className='return-btn' onClick={() => Taro.navigateBack({})}>
          <Text>返回</Text>
        </View>
      </View>
    );
  }
}

export default checkOut;
