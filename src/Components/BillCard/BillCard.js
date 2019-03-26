import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import UserBox from "../UserBox/UserBox";
import UseBox from "../UseBox/UseBox";
import "./BillCard.scss";

class BillCard extends Component {
  render() {
    const {
      date,
      payer,
      participant,
      money,
      use,
      comment
    } = this.props.cardInfo;

    const { members, done, uid } = this.props;

    let time = new Date(date);
    time = `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日`;

    return (
      <View className='BillCard'>
        <View className='BillCard-billDate'>
          <Text>{time}</Text>
        </View>

        <View className='BillBox-infoBox'>
          <View className='infoBox-label'>
            <Text>付款人</Text>
          </View>
          <View className='infoBox-info'>
            <UserBox nickName={members[payer].nickName} />
          </View>
        </View>

        <View className='BillBox-infoBox'>
          <View className='infoBox-label'>
            <Text>参与人</Text>
          </View>
          <View className='infoBox-info'>
            {participant.map(p => (
              <UserBox key={p} nickName={members[p].nickName} />
            ))}
          </View>
        </View>

        <View className='BillBox-infoBox'>
          <View className='infoBox-label'>
            <Text>金额</Text>
          </View>
          <View className='infoBox-info'>
            <Text className='infoText-money'>{money}</Text>
          </View>
        </View>

        {use !== "" && (
          <View className='BillBox-infoBox'>
            <View className='infoBox-label'>
              <Text>用途</Text>
            </View>
            <View className='infoBox-info'>
              <UseBox use={use} />
            </View>
          </View>
        )}

        {comment !== "" && (
          <View className='BillBox-infoBox'>
            <View className='infoBox-label'>
              <Text>备注</Text>
            </View>
            <View className='infoBox-info'>
              <Text>{comment}</Text>
            </View>
          </View>
        )}

        {!done && uid === payer && (
          <View>
            <View>
              <Text>修改</Text>
            </View>
            <View>
              <Text>删除</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

BillCard.defaultProps = {
  cardInfo: {
    date: "",
    payer: "",
    participant: [],
    money: 0,
    use: "",
    comment: ""
  },
  members: {},
  done: false
};

export default BillCard;
