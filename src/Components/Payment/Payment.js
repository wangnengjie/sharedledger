import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import User from "../User/User";
import fromToArrow from "../../images/fromToArrow.png";
import "./Payment.scss";

class Payment extends Component {
  config = {
    navigationBarTitleText: "共享账本"
  };

  render() {
    const { from, to, money } = this.props;
    return (
      <View>
        <View className='payment-card'>
          <View className='payment-user-box'>
            <User nickName={from.nickName} avatarUrl={from.avatarUrl} />
          </View>
          <View className='payment-money-box'>
            <Text className='money-box-text-1'>应付</Text>
            <Image src={fromToArrow} />
            <Text className='money-box-text-2'>{money}<Text className='money-yuan'>元</Text></Text>
          </View>
          <View className='payment-user-box'>
            <User nickName={to.nickName} avatarUrl={to.avatarUrl} />
          </View>
        </View>
      </View>
    );
  }
}

export default Payment;
