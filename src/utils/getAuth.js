import Taro from '@tarojs/taro';

const getAuth = async () => {
  return await Taro.getSetting().then(res => res.authSetting["scope.userInfo"]);
};

export default getAuth;