import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Button } from "@tarojs/components";
import { globalData } from "../utils/events";
import { myRequest } from "../utils/myRequest";
import "./index.scss";
import addOneBall from "./addOneBall.png";

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      list: [
        {
          pagePath: "../index/index",
          text: "首页",
          iconPath: "../images/index.png",
          selectedIconPath: "../images/indexSelected.png"
        },
        {
          pagePath: "../my/my",
          text: "我的",
          iconPath: "../images/my.png",
          selectedIconPath: "../images/mySelected.png"
        }
      ]
    };
  }

  async switchTab(url) {
    Taro.switchTab({ url });
  }

  navigateToBillPage() {
    if (!globalData.auth) return;
    if (!globalData.run || !globalData.run.length) {
      Taro.showToast({ title: "您没有未结账本哦", icon: "none" });
      return;
    }
    Taro.navigateTo({
      url: `/pages/bill/bill?page=index&ledgerId=${
        globalData.ledgerId
      }`
    });
  }

  onGetUserInfo(e) {
    const userInfo = e.detail.userInfo;
    if (!globalData.auth && userInfo) {
      globalData.userInfo = userInfo;
      globalData.auth = true;
      myRequest("/user", "PUT", {
        uid: Taro.getStorageSync("uid"),
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      });
    }
  }

  render() {
    const { list, selected } = this.state;
    return (
      <View className='tabbar'>
        {list.map((tab, index) => {
          return (
            <View
              className='tab'
              key={index}
              onClick={e => {
                this.switchTab(tab.pagePath, e);
              }}
            >
              <Image
                src={selected === index ? tab.selectedIconPath : tab.iconPath}
              />
              <Text className={selected === index ? "text-selected" : ""}>
                {tab.text}
              </Text>
            </View>
          );
        })}
        <Button
          openType='getUserInfo'
          plain
          hoverClass='none'
          className='addOneBall'
          onClick={this.navigateToBillPage}
          onGetuserinfo={this.onGetUserInfo}
        >
          <Image src={addOneBall} />
        </Button>
      </View>
    );
  }
}

export default TabBar;
