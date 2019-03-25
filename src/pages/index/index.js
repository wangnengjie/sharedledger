import Taro, { Component } from "@tarojs/taro";
import { View, Text, Navigator, Button } from "@tarojs/components";
import "./index.scss";
import events, { globalData } from "../../utils/events";
import UserBox from "../../Components/UserBox/UserBox";


class Index extends Component {
  
  config = {
    navigationBarTitleText: "首页"
  };

  constructor(props) {
    super(props);
    this.state = {
      msg: globalData.msg
    };
    this.handleTest = this.handleTest.bind(this);
    events.on("test", this.handleTest);
  }

  componentWillMount() {
    // this.setState({msg:globalData.msg});
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleTest(msg) {
    this.setState({ msg });
  }

  onClick() {
    events.trigger("test", "haha");
  }

  render() {
    const msg = this.state.msg;
    console.log(this.state);
    return (
      <View className='index'>
        <Text>{msg}</Text>
        <Button onClick={this.onClick}>广播</Button>
        <Navigator url='/pages/test/test'>test</Navigator>
        <UserBox nickName='大熊猫' />
        <UserBox nickName='stone-page' />
      </View>
    );
  }
}

export default Index;
