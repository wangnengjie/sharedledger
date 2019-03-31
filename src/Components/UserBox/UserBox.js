import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./UserBox.scss";

class UserBox extends Component {
  render() {
    const { selected, nickName, handleClick, index, isPayer } = this.props;
    const className = `UserBox ${
      selected ? "UserBox-selected" : "UserBox-unselected"
    }`;
    return (
      <View
        className={className + (isPayer ? " payer" : "")}
        onClick={e => handleClick(index, e)}
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
  handleClick() {}
};

export default UserBox;
