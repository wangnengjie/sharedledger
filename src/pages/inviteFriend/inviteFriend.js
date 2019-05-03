import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import { globalData } from "../../utils/events";
import { myRequest } from "../../utils/myRequest";
import "./inviteFriend.scss";
import invite from "../../images/invite.png";

class inviteFriend extends Component {
  config = {
    navigationBarTitleText: "邀请驴友"
  };

  constructor(props) {
    super(props);
    this.onShareAppMessage = this.onShareAppMessage.bind(this);
  }

  componentWillMount() {
    const { ledgerId, ledgerName } = this.$router.params;
    console.log(ledgerId, ledgerName);
    this.setState({ ledgerName });
    const data = myRequest("/invitation", "POST", { ledgerId });
    if (data !== null) {
      this.setState({ invitationKey: data.invitationKey });
    }
  }

  onShareAppMessage() {
    const { invitationKey, ledgerName } = this.state;
    return {
      title: `${globalData.userInfo.nickName}邀请您加入账本 ${ledgerName}`,
      path: `/pages/index?invitationKey=${invitationKey}&ledgerName=${ledgerName}`
    };
  }

  render() {
    return (
      <View>
        <View className='invite-bar'>
          <Text>{this.state.ledgerName}</Text>
          <Text>创建成功</Text>
          <Image src={invite} />
          <View>
            <Button hover-class='none' openType='share'>
              <Text>邀请好友</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

export default inviteFriend;
