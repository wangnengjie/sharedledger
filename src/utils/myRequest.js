import Taro from "@tarojs/taro";

const route = "https://www.westice.top/weapp";

const myLogin = async auth => {
  const code = await Taro.login().then(res => res.code);
  const { errcode, errMsg, sessionId, uid } = await Taro.request({
    method: "GET",
    url: route + "/session",
    data: { code }
  })
    .then(res => {
      return res.data;
    })
    .catch(err => console.log(err));

  if (errcode !== 0) {
    Taro.showToast({
      title: errMsg,
      icon: "none"
    });
    return;
  }

  Taro.setStorageSync("uid", uid);
  Taro.setStorageSync("sessionId", sessionId);

  if (auth) {
    Taro.getUserInfo().then(res => {
      const userInfo = res.userInfo;
      myRequest("/user", "PUT", {
        uid: Taro.getStorageSync("uid"),
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      });
    });
  }
};

const myRequest = async (url, method, body = {}) => {
  Object.assign(body, { sessionId: Taro.getStorageSync("sessionId") });
  let data = await Taro.request({
    method: method,
    url: route + url,
    data: body
  })
    .then(res => res.data)
    .catch(err => console.log(err));
  switch (data.errcode) {
    case 0:
      return data;
    case 1:
      await myLogin();
      return await myRequest(url, method, body);
    case 2:
    case -1:
      Taro.showToast({
        title: data.errMsg,
        icon: "none"
      });
    default:
      break;
  }

  return null;
};

export { myLogin, myRequest };
