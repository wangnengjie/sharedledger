import "@tarojs/async-await";
import Taro, { Component } from "@tarojs/taro";
import { View, Text, Navigator, Button } from "@tarojs/components";
import events, { globalData } from "../../utils/events";

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: globalData.msg
    };
    this.handleTest = this.handleTest.bind(this);
  }
  componentWillMount() {
    events.on("test", this.handleTest);
  }

  componentWillUnmount() {
    events.off("test", this.handleTest);
  }

  handleTest(msg) {
    console.log(this, msg);
    this.setState({ msg });
  }

  onClick() {
    events.trigger("test", "this is a test!!!");
  }

  render() {
    const msg = this.state.msg;
    return (
      <View>
        <Text>{msg}</Text>
        <Button onClick={this.onClick}>广播</Button>
        <Navigator openType='switchTab' url='/pages/index/index'>
          卸载返回
        </Navigator>
      </View>
    );
  }
}
