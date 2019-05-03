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

  handleInput(e) {
    const text = e.detail.value;
    this.setState({ ledgerName: text });
  }

  handleFocus() {
    this.setState({ focus: true });
  }

  handleBlur() {
    this.setState({ focus: false });
  }

  createLedger() {
    if (!globalData.auth) return;
    const ledgerName = this.state.ledgerName;
    const data = myRequest("/ledger", "POST", { ledgerName });
    if (data !== null) {
      events.trigger("createLedger", { ledgerName, ledgerId: data.ledgerId });
      Taro.navigateTo({
        path: "/pages/inviteFriend/inviteFriend"
      });
    }
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
        <Button hover-class='none' className='btn-cancel'>
          <Navigator openType='navigateBack'>
            <Text>返回</Text>
          </Navigator>
        </Button>
      </View>
    );
  }
}

export default CreateLedger;
