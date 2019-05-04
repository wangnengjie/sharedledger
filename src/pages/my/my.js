import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import events, { globalData } from "../../utils/events";

class My extends Component {
  config = {
    navigationBarTitleText: "我的账本",
    usingComponents: {}
  };

  constructor(props) {
    super(props);
    const { run, done } = globalData;
    this.state = { run, done };
  }

  componentDidMount() {}

  componentDidShow() {
    this.$scope.getTabBar().setData({
      selected: 1 // 当前页面对应的 index
    });
  }

  componentWillUnmount() {}

  render() {
    return <View />;
  }
}

export default My;
