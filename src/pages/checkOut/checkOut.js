import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import { countMoney, checkOutPayment } from "../../utils/checkOut";
import { myRequest } from "../../utils/myRequest";

class checkOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ledgerId: 0,
      ledgerName: "",
      users: [],
      bills: [],
      done: true,
      categories: []
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
    return <View />;
  }
}

export default checkOut;
