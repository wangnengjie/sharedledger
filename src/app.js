import "@tarojs/async-await";
import Taro, { Component } from "@tarojs/taro";
import Index from "./pages/index";
import "./app.scss";
import events from "./utils/events";
import getAuth from "./utils/getAuth";
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  config = {
    pages: ["pages/index/index", "pages/my/my", "pages/bill/bill", "pages/test/test"],
    window: {
      backgroundColor: "#f2f2f7",
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#5352e4",
      navigationBarTitleText: "共享账本",
      navigationBarTextStyle: "white"
    },
    tabBar: {
      custom: true,
      color: "#888888",
      selectedColor: "#5B78F9",
      backgroundColor: "#F6F6F6",
      list: [
        {
          pagePath: "pages/index/index",
          text: "首页",
          iconPath: "./images/index.png",
          selectedIconPath: "./images/indexSelected.png"
        },
        {
          pagePath: "pages/my/my",
          text: "我的",
          iconPath: "./images/my.png",
          selectedIconPath: "./images/mySelected.png"
        }
      ]
    },
    networkTimeout: {
      request: 20000,
      connectSocket: 20000,
      uploadFile: 20000,
      downloadFile: 20000
    }
  };

  // componentDidMount() {}

  // componentDidShow() {}

  // componentDidHide() {}

  // componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />;
  }
}

Taro.render(<App />, document.getElementById("app"));
