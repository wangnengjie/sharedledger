import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./ExtendDots.scss";

class ExtendDots extends Component {
  render() {
    return (
      <View className='extend-dots' onClick={this.props.onClick}>
        {Array(4).map((e, index) => (
          <View key={index} />
        ))}
      </View>
    );
  }
}

ExtendDots.defaultProps = {
  onClick() {}
};

export default ExtendDots;
