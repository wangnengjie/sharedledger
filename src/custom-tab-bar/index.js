import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Navigator } from "@tarojs/components";
import { globalData } from "../utils/events";
import "./index.scss";
import addOneBall from './addOneBall.png';

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

  switchTab(url) {
    Taro.switchTab({ url });
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
        <View className='addOneBall'>
          <Navigator
            url={`/pages/bill/bill?type=add&page=index&ledgerId=${
              globalData.ledgerId
            }`}
            openType='navigate'
            hover-class='none'
          >
            <Image src={addOneBall} />
          </Navigator>
        </View>
      </View>
    );
  }
}

export default TabBar;
