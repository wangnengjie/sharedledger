import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";

class Curtain extends Component {
  render() {
    const { msg, onClose, onSure } = this.props.curtain;
    console.log(this.props.curtain);
    const onGetUserInfo = this.props.onGetUserInfo;
    return (
      <View>
        <View>
          <Text>{msg}</Text>
        </View>
        <View>
          <Button onClick={onClose} hover-class='none'>取消</Button>
          <Button
            onClick={onSure}
            hover-class='none'
            openType='getUserInfo'
            bindgetuserinfo={onGetUserInfo}
          >
            确定
          </Button>
        </View>
      </View>
    );
  }
}

Curtain.defaultProps = {
  curtain: {
    msg: "",
    onClose() {},
    onSure() {}
  },
  onGetUserInfo() {}
};

export default Curtain;
