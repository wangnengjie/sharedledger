import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { tempLedgerData } from "../../utils/events";
import * as graphAnalyze from "../../utils/graph";
import Graphs from "../../Components/Graphs/Graphs";

class graph extends Component {
  config = {
    navigationBarTitleText: "图表"
  };

  constructor(props) {
    super(props)
    this.state = {
      users:[],
      bills:[],
      categories:[]
    }
  }

  componentWillMount() {
    this.setState({ ...tempLedgerData });
  }

  render() {
    const { bills, users } = this.state;
    console.log(this.state);
    const date = graphAnalyze.persentOfDate(bills);
    return (
      <View>
        <Graphs type='date' details={date} />
      </View>
    );
  }
}

export default graph;
