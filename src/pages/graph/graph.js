import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { tempLedgerData } from "../../utils/events";
import * as graphAnalyze from "../../utils/graph";
import { countMoney } from "../../utils/checkOut";
import Graphs from "../../Components/Graphs/Graphs";
import "./graph.scss";

class graph extends Component {
  config = {
    navigationBarTitleText: "图表"
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      users: [],
      bills: [],
      categories: [],
      ledgerName: "",
      detail: {
        totalMoney: 0,
        date: [],
        category: [],
        pay: []
      }
    };
  }

  switchContent(index) {
    this.setState({ page: index });
  }

  componentWillMount() {
    this.setState({ ...tempLedgerData });
    const { bills, users } = tempLedgerData;
    const totalMoney = countMoney(bills);
    const date = graphAnalyze.percentOfDate(bills, totalMoney);
    const category = graphAnalyze.percentOfCategory(bills, totalMoney);
    const pay = graphAnalyze.percentOfPerson(bills, users, totalMoney);
    this.setState({ detail: { date, category, pay, totalMoney } });
  }

  render() {
    const { ledgerName, page, detail } = this.state;
    return (
      <View>
        <View className='graph-header-bar'>
          <Text className='title-1'>{ledgerName}</Text>
          <Text className='title-2'>总支出</Text>
          <View className='title-3'>
            <Text>{detail.totalMoney}</Text>
            <Text className='title-3-yuan'>元</Text>
          </View>
          <View className='switch-bar'>
            {["时间", "用途", "付款"].map((p, index) => {
              return (
                <View
                  className={page === index ? "switch-btn-selected" : ""}
                  key={index}
                  onClick={this.switchContent.bind(this, index)}
                >
                  <Text>{p}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <View className='graph-body-bar'>
          {page === 0 && <Graphs type='date' details={detail.date} />}
          {page === 1 && <Graphs type='category' details={detail.category} />}
          {page === 2 && <Graphs type='pay' details={detail.pay} />}
        </View>
        <View className='graph-btn' onClick={() => Taro.navigateBack({})}>
          <Text>返回</Text>
        </View>
      </View>
    );
  }
}

export default graph;
