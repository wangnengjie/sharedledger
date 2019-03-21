import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import events,{ globalData } from "../../utils/events";

export default class My extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: ""
    };
    this.handleClick = this.handleClick.bind(this);
    events.on("test", this.handleClick);
  }

  handleClick(msg){
    this.setState({msg});
  }

  componentWillMount() {
    this.setState({ msg: globalData.msg });
    
    // events.trigger("test", "this is a test!!!");
    // events.off("test",test.bind(this));
    // events.trigger("test", "this is a test!!!");
  }

  componentDidMount() {    }

  componentWillUnmount() {
    // events.off("test",test);
  }

  render() {
    return (
      <View>
        ???<Text>???{this.state.msg}</Text>
      </View>
    );
  }
}
