import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import UserBox from "../UserBox/UserBox";
import UseBox from "../UseBox/UseBox";
import "./BillCard.scss";

class BillCard extends Component {
  constructor(props) {
    super(props);
    this.handleFix = this.handleFix.bind(this);
  }

  handleFix() {
    const { billInfo, index } = this.props;
    //跳转传参，JSON.Stringify(billInfo)，pagepath，index
  }

  render() {
    const {
      createTime,
      payer,
      users,
      money,
      category,
      description
    } = this.props.billInfo;

    const { done, onDelete } = this.props;
    const uid = Taro.getStorageSync("uid");
    category.selected = true;
    let time = new Date(createTime);
    time = `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日`;

    return (
      <View className='BillCard'>
        <View className='BillCard-billDate'>
          <Text>{time}</Text>
        </View>

        <View className='BillCard-infoBox'>
          <View className='infoBox-label'>
            <Text>付款人</Text>
          </View>
          <View className='infoBox-info'>
            <UserBox nickName={payer.nickName} isPayer />
          </View>
        </View>

        <View className='BillCard-infoBox'>
          <View className='infoBox-label'>
            <Text>参与人</Text>
          </View>
          <View className='infoBox-info'>
            {users.map(user => (
              <UserBox key={user.uid} nickName={user.nickName} selected />
            ))}
          </View>
        </View>

        <View className='BillCard-infoBox'>
          <View className='infoBox-label'>
            <Text>金额</Text>
          </View>
          <View className='infoBox-info'>
            <Text className='infoText-money'>{money / 100}元</Text>
          </View>
        </View>

        {category.categoryId !== 0 && (
          <View className='BillCard-infoBox'>
            <View className='infoBox-label'>
              <Text>用途</Text>
            </View>
            <View className='infoBox-info'>
              <UseBox category={category} />
            </View>
          </View>
        )}

        {description !== "" && (
          <View className='BillCard-infoBox'>
            <View className='infoBox-label'>
              <Text>备注</Text>
            </View>
            <View className='infoBox-info'>
              <Text className='infoText-comment'>{description}</Text>
            </View>
          </View>
        )}

        {!done && uid === payer.uid && (
          <View className='BillCard-fixLine'>
            <View className='fixLine-fix' onClick={this.handleFix}>
              <Text>修改</Text>
            </View>
            <View className='fixLine-delete' onClick={onDelete}>
              <Text>删除</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

BillCard.defaultProps = {
  billInfo: {
    createTime: 0,
    payer: {},
    users: [],
    money: 0,
    category: {},
    description: ""
  },
  done: false,
  onDelete() {}
};

export default BillCard;
