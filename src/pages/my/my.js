import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import events, { globalData } from "../../utils/events";

export default class My extends Component {
  config = {
    navigationBarTitleText: "我的",
    usingComponents: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      msg: ""
    };
    this.handleClick = this.handleClick.bind(this);
    events.on("test", this.handleClick);
  }

  handleClick(msg) {
    this.setState({ msg });
  }

  componentWillMount() {
    this.setState({ msg: globalData.msg });
  }

  componentDidMount() {
    
  }

  componentDidShow() {
    this.$scope.getTabBar().setData({
      selected: 1 // 当前页面对应的 index
    });
  }

  componentWillUnmount() {}

  render() {
    return (
      <View>
        ???<Text>???{this.state.msg}</Text>
      </View>
    );
  }
}
