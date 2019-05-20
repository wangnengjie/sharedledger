import Taro, { Component } from "@tarojs/taro";
import { View, Text,Image } from "@tarojs/components";
import "./User.scss"

class User extends Component{
  render() {
    return (
      <View className='user-view'>
        <View>
          <Image src={this.props.avatarUrl} />
        </View>
        <Text>{this.props.nickName}</Text>
      </View>
    )
  }
}

User.defaultProps = {
  avatarUrl: "",
  nickName:""
}

export default User;
