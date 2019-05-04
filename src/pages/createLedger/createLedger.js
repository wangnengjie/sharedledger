import Taro, { Component } from "@tarojs/taro";
import { View, Text, Input, Button, Navigator } from "@tarojs/components";
import "./createLedger.scss";
import { myRequest } from "../../utils/myRequest";
import events, { globalData } from "../../utils/events";

class CreateLedger extends Component {
  config = {
    navigationBarTitleText: "创建账本"
  };

  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.createLedger = this.createLedger.bind(this);
    this.state = {
      ledgerName: "",
      focus: false
    };
  }

  onGetUserInfo(e) {
    const userInfo = e.detail.userInfo;
    if (!globalData.auth && userInfo) {
      events.trigger("setUserInfo", userInfo);
      events.trigger("setAuth", !this.state.auth);
      myRequest("/user", "PUT", {
        uid: Taro.getStorageSync("uid"),
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      });
    }
  }

  handleInput(e) {
    const text = e.detail.value;
    let slength = 0;
    for (i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) >= 0 && text.charCodeAt(i) <= 255)
        slength = slength + 1;
      else slength = slength + 2;
      if (slength > 20) {
        this.setState({ ledgerName: text.slice(0, i) });
        return text.slice(0, i);
      }
    }

  }

  handleFocus() {
    this.setState({ focus: true });
  }

  handleBlur() {
    this.setState({ focus: false });
  }

  async createLedger() {
    if (!globalData.auth) return;
    const ledgerName = this.state.ledgerName;
    const data = await myRequest("/ledger", "POST", { ledgerName });
    if (data !== null) {
      events.trigger("createLedger", { ledgerName, ledgerId: data.ledgerId });
      Taro.redirectTo({
        url: `/pages/inviteFriend/inviteFriend?ledgerId=${
          data.ledgerId
        }&ledgerName=${ledgerName}`
      });
    }
  }

  navigateBack() {
    Taro.navigateBack();
  }

  render() {
    return (
      <View>
        <Text className='crte-text'>输入账本名称</Text>
        <Input
          className='input-bar'
          maxlength='10'
          onInput={this.handleInput}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          style={
            this.state.focus
              ? "border-bottom:1px solid #5B78F9"
              : "border-bottom:1px solid #adadad"
          }
        />
        <Button
          className='btn-sure'
          hover-class='none'
          openType='getUserInfo'
          bindgetuserinfo={this.onGetUserInfo}
          onClick={this.createLedger}
        >
          <Text>创建账本</Text>
        </Button>
        <Button
          hover-class='none'
          className='btn-cancel'
          onClick={this.navigateBack}
        >
          <Text>返回</Text>
        </Button>
      </View>
    );
  }
}

export default CreateLedger;
