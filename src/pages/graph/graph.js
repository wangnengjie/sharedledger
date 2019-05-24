import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { tempLedgerData } from "../../utils/events";
import * as graphAnalyze from "../../utils/graph";
import { countMoney } from "../../utils/checkOut";
import Graphs from "../../Components/Graphs/Graphs";

class graph extends Component {
  config = {
    navigationBarTitleText: "图表"
  };

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      bills: [],
      categories: []
    };
  }

  componentWillMount() {
    this.setState({ ...tempLedgerData });
  }

  render() {
    const { bills, users } = this.state;
    const totalMoney = countMoney(bills);
    const date = graphAnalyze.percentOfDate(bills, totalMoney);
    const category = graphAnalyze.percentOfCategory(bills, totalMoney);
    const pay = graphAnalyze.percentOfPerson(bills, users, totalMoney);
    return (
      <View>
        <Graphs type='date' details={date} />
        <Graphs type='category' details={category} />
        <Graphs type='pay' details={pay} />
      </View>
    );
  }
}

export default graph;
