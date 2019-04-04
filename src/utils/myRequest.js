import Taro from "@tarojs/taro";

const route = "https://www.westice.top/weapp";

const myLogin = async () => {
  const code = await Taro.login().then(res => res.code);
  const { sessionId, uid } = await Taro.request({
    method: "POST",
    url: route + "/login",
    data: { code }
  }).then(res => res.data);
  await Promise.all([
    Taro.setStorage("uid", uid),
    Taro.setStorage("sessionId", sessionId)
  ]);
};

const myRequest = async (url, method, body) => {
  Object.assign(body, { sessionId: Taro.getStorageSync("sessionId") });
  let data = await Taro.request({
    method: method,
    url: route + url,
    data: body
  }).then(res => {
    return res.data;
  });

  switch (data.status) {
    case 0:
      return data;
    case 1:
      await myLogin();
      return await myRequest(url, method, body);
    case 2:
      break;
    default:
      break;
  }
};

export { myLogin, myRequest };
