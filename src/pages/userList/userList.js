import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import events, { tempUserList } from "../../utils/events";
import selected from "../../images/selected.png";
import unselected from "../../images/unselected.png";
import "./userList.scss";

class userList extends Component {
  config = {
    navigationBarTitleText: "付款人"
  };

  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  payerSelected(index) {
    const users = this.state.users.concat();
    users.find(user => user.isPayer).isPayer = false;
    users[index].isPayer = true;
    this.setState({ users });
  }

  onSure() {
    const users = this.state.users.concat();
    users.unshift(...users.splice(users.findIndex(user => user.isPayer), 1));
    events.trigger("switchPayer", users);
    Taro.navigateBack({});
  }

  componentWillMount() {
    this.setState({ users: JSON.parse(JSON.stringify(tempUserList.users)) });
  }

  render() {
    return (
      <View>
        <View className='user-bar'>
          {this.state.users.map((user, index) => {
            return (
              <View
                key={user.uid}
                className={`user-card ${user.isPayer ? "card-payer" : ""}`}
                onClick={this.payerSelected.bind(this, index)}
              >
                <View className='user-image'>
                  <Image src={user.avatarUrl} />
                </View>
                <View className='user-name'>
                  <Text className={user.isPayer ? "text-payer" : ""}>
                    {user.nickName}
                  </Text>
                </View>
                <View className='user-tick'>
                  <Image src={user.isPayer ? selected : unselected} />
                </View>
              </View>
            );
          })}
        </View>
        <View className='sure-btn' onClick={this.onSure.bind(this)}>
          <Text>完成</Text>
        </View>
      </View>
    );
  }
}

export default userList;
