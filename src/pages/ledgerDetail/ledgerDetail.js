import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import events, { globalData } from "../../utils/events";
import { myRequest } from "../../utils/myRequest";
import BillCard from "../../Components/BillCard/BillCard";
import "./ledgerDetail.scss";

class LedgerDetail extends Component {
  config = {
    enablePullDownRefresh: true
  };

  constructor(props) {
    super(props);
    this.state = {
      ledgerId: 0,
      ledgerName: "",
      categories: [],
      users: [],
      bills: [],
      done: false
    };
  }

  async componentWillMount() {
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

  render() {
    const { ledgerId, ledgerName, users, bills, done } = this.state;
    return (
      <View>

        <View
          className={
            done ? "ledger-check ledger-done" : "ledger-check ledger-run"
          }
        >
          <View>
            <Text>{done ? "已结" : "未结"}</Text>
          </View>
        </View>

        

      </View>
    );
  }
}

export default LedgerDetail;
