import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./ExtendBtn.scss";

class ExtendBtn extends Component {
  render() {
    return (
      <View
        className={`extend-btn ${this.props.theme}`}
        onClick={this.props.onClick}
      >
        <Text>{this.props.extended ? "收起<<" : "更多>>"}</Text>
      </View>
    );
  }
}

ExtendBtn.defaultProps = {
  theme: String,
  extended: false,
  onClick() {}
};

export default ExtendBtn;
