import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./UseBox.scss";

class UseBox extends Component {
  render() {
    const { category, handleClick, index } = this.props;
    const className = `UseBox ${
      category.selected ? "UseBox-selected" : "UseBox-unselected"
    }`;
    return (
      <View className={className} onClick={e => handleClick(index, e)}>
        <Text>{category.categoryName}</Text>
      </View>
    );
  }
}

UseBox.defaultProps = {
  category: {
    selected: false,
    categoryName: "",
    categoryId:0
  },
  index: 0,
  handleClick() {}
};

export default UseBox;
