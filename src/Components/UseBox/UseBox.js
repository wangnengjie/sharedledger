import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./UseBox.scss";

class UseBox extends Component {
  render() {
    const { category, onClick, index } = this.props;
    const className = `UseBox ${
      category.selected ? "UseBox-selected" : "UseBox-unselected"
    }`;
    return (
      <View className={className} onClick={() => onClick(index)}>
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
  onClick() {}
};

export default UseBox;
