import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./UserBox.scss";

class UserBox extends Component {
  render() {
    const { selected, nickName, onClick, index, isPayer } = this.props;
    const className = `UserBox ${
      selected ? "UserBox-selected" : "UserBox-unselected"
    }`;
    return (
      <View
        className={className + (isPayer ? " payer" : "")}
        onClick={() => onClick(index)}
      >
        <Text>{nickName}</Text>
      </View>
    );
  }
}

UserBox.defaultProps = {
  selected: true,
  nickName: "",
  index: 0,
  isPayer: false,
  onClick() {}
};

export default UserBox;
