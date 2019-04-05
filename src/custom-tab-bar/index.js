import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Button } from "@tarojs/components";
import { globalData } from "../utils/events";
import "./index.scss";
import addOneBall from "./addOneBall.png";
import getAuth from "../utils/getAuth";

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
    globalData.auth &&
      Taro.navigateTo({
        url: `/pages/bill/bill?type=add&page=index&ledgerId=${
          globalData.ledgerId
        }`
      });
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
          bindgetuserinfo
        >
          <Image src={addOneBall} />
        </Button>
      </View>
    );
  }
}

export default TabBar;
