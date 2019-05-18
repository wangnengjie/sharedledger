import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./LedgerCard.scss";

class LedgerCard extends Component {
  render() {
    const { onCheck, onDelete, onDetail } = this.props;
    const { done, ledgerName} = this.props.ledger;
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
          onClick={onDetail}
        >
          <Text>{ledgerName}</Text>
        </View>

        <View className='ledger-btn'>
          {!done && (
            <View
              className='ledger-btn-check'
              onClick={onCheck}
            >
              <Text>结账</Text>
            </View>
          )}

          <View
            className='ledger-btn-delete'
            onClick={onDelete}
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
  onCheck() {},
  onDelete() {},
  onDetail() {}
};

export default LedgerCard;
