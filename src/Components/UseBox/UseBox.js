import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./UseBox.scss";

class UseBox extends Component {
  render() {
    const { use, selected, handleClick, index } = this.props;
    const className = `UseBox ${
      selected ? "UseBox-selected" : "UseBox-unselected"
      }`;
    return (
      <View className={className} onClick={e => handleClick(index, e)}>
        <Text>{use}</Text>
      </View>
    );
  }
}

UseBox.defaultProps = {
  selected: true,
  use: "",
  index: 0,
  handleClick() { }
};

export default UseBox;