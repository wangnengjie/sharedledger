import Taro, { Component } from "@tarojs/taro";
import { View, Text, Navigator, Button } from "@tarojs/components";
import events, { globalData } from "../../utils/events";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: ""
    };
    this.handleTest = this.handleTest.bind(this);
    events.on("test", this.handleTest);
  }

  handleTest(msg) {
    console.log(this, msg);
    this.setState({ msg });
  }

  onClick() {
    events.trigger("test", "this is a test!!!");
  }

  componentWillMount() {
    this.setState({ msg: globalData.msg });
  }

  componentDidMount() {}

  componentWillUnmount() {
    events.off("test", this.handleTest);
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

export default Test;
