import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { AtCurtain } from "taro-ui";

class Curtain extends Component {
  render() {
    const { isOpened, msg, onClose, onSure } = this.props.Curtain;
    return (
      <AtCurtain isOpened={isOpened}>
        <View>
          <Text>{msg}</Text>
        </View>
        <View>
          <Button onClick={onClose}>取消</Button>
          <Button onClick={onSure}>确定</Button>
        </View>
      </AtCurtain>
    );
  }
}

Curtain.defaultProps = {
  isOpened: false,
  msg: "",
  onClose() {},
  onSure() {}
};

export default Curtain;
