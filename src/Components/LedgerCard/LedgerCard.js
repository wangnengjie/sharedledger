import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import events from "../../utils/events";
import { myRequest } from "../../utils/myRequest";
import "./LedgerCard.scss";

class LedgerCard extends Component {
  async handleActivate() {
    const ledgerId = this.props.ledger.ledgerId;
    const data = await myRequest("/ledger", "PUT", { done: false, ledgerId });
    if (data) {
      events.trigger("ledgerActive", ledgerId);
    }
  }

  render() {
    const { onCheck, onDelete, onDetail } = this.props;
    const { done, ledgerName } = this.props.ledger;
    return (
      <View className='ledger-card'>
        <View
          className={
            done ? "ledger-check ledger-done" : "ledger-check ledger-run"
          }
        >
          <View>
            <Text>{done ? "已结" : "未结"}</Text>
          </View>
        </View>

        <View className='ledger-name-bar' onClick={onDetail}>
          <Text>{ledgerName}</Text>
        </View>

        <View className='ledger-btn'>
          {!done && (
            <View className='ledger-btn-check' onClick={onCheck}>
              <Text>结账</Text>
            </View>
          )}

          {done && (
            <View className='ledger-btn-check' onClick={this.handleActivate}>
              <Text>激活</Text>
            </View>
          )}

          <View className='ledger-btn-delete' onClick={onDelete}>
            <Text>删除</Text>
          </View>
        </View>
      </View>
    );
  }
}

LedgerCard.defaultProps = {
  ledger: {
    done: false,
    ledgerName: "",
    ledgerId: 0
  },
  onCheck() {},
  onDelete() {},
  onDetail() {}
};

export default LedgerCard;
