import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

class LedgerCard extends Component {
  render() {
    const { done, ledgerName, ledgerId } = this.props;
    return (
      <View className='ledger-card'>
        <View>
          <Text>{done ? "已结" : "未结"}</Text>
        </View>
      </View>
    );
  }
}
