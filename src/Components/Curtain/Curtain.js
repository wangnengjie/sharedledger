import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import "./Curtain.scss";

class Curtain extends Component {
  render() {
    const { msg, onSure, onClose,onGetUserInfo } = this.props;
    return (
      <View className='curtain-bar'>
        <View className='curtain-main'>
          <View className='curtain-msg'>
            <Text>{msg}</Text>
          </View>
          <View className='curtain-btn'>
            <Button
              onClick={onSure}
              hover-class='none'
              openType='getUserInfo'
              onGetUserInfo={onGetUserInfo}
              className='curtain-btn-sure'
            >
              <Text>确定</Text>
            </Button>
            <Button
              className='curtain-btn-cancel'
              onClick={onClose}
              hover-class='none'
            >
              <Text>取消</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

Curtain.defaultProps = {
  msg: "",
  onGetUserInfo: null,
  onSure: null,
  onClose: null
};

export default Curtain;
