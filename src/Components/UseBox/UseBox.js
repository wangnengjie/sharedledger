import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import x from "../../images/x.png";
import xselected from "../../images/xselected.png";
import "./UseBox.scss";

class UseBox extends Component {
  render() {
    const { category, onClick, index, setting, onDelete } = this.props;
    const className = `UseBox ${
      category.selected ? "UseBox-selected" : "UseBox-unselected"
    }`;
    return (
      <View className='category-main'>
        <View className={className} onClick={() => onClick(index)}>
          <Text>{category.categoryName}</Text>
        </View>
        {index > 4 && setting && (
          <View onClick={onDelete} className='delete-btn'>
            <Image src={category.selected ? xselected : x} />
          </View>
        )}
      </View>
    );
  }
}

UseBox.defaultProps = {
  category: {
    selected: false,
    categoryName: "",
    categoryId: 0
  },
  index: 0,
  setting: false,
  onClick() {},
  onDelete() {}
};

export default UseBox;
