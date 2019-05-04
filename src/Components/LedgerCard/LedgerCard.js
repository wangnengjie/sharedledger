import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./LedgerCard.scss";
import { myRequest } from "../../utils/myRequest";

class LedgerCard extends Component {
  render() {
    const { handleCheck, handleDelete, handleDetail } = this.props;
    const { done, ledgerName, ledgerId } = this.props.ledger;
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

        <View
          className='ledger-name-bar'
          onClick={() => handleDetail(ledgerId)}
        >
          <Text>{ledgerName}</Text>
        </View>

        <View className='ledger-btn'>
          {!done && (
            <View
              className='ledger-btn-check'
              onClick={() => handleCheck(ledgerId)}
            >
              <Text>结账</Text>
            </View>
          )}

          <View
            className='ledger-btn-delete'
            onClick={() => handleDelete(ledgerId)}
          >
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
  handleCheck() {},
  handleDelete() {},
  handleDetail() {}
};

export default LedgerCard;
