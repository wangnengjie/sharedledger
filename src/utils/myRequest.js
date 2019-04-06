import Taro from "@tarojs/taro";

const route = "https://www.westice.top/weapp";

const myLogin = async () => {
  const code = await Taro.login().then(res => res.code);
  const { errcode, errMsg, sessionId, userId } = await Taro.request({
    method: "GET",
    url: route + "/session",
    data: { code }
  }).then(res => res.data);
  
  if (errcode !== 0) {
    Taro.showToast({
      title: errMsg,
      icon: "none"
    });
    return;
  }

  await Promise.all([
    Taro.setStorage("userId", userId),
    Taro.setStorage("sessionId", sessionId)
  ]);
};

const myRequest = async (url, method, body = {}) => {
  Object.assign(body, { sessionId: Taro.getStorageSync("sessionId") });
  let data = await Taro.request({
    method: method,
    url: route + url,
    data: body
  }).then(res => {
    return res.data;
  });

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
