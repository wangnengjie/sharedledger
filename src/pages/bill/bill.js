
import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import events, {
  globalData,
  tempBillData,
  tempLedgerData
} from "../../utils/events";

class Bill extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleAddOne = this.handleAddOne.bind(this);
    this.handleFix = this.handleFix.bind(this);
  }

  handleAddOne() {}

  handleFix() {}

  componentWillMount() {
    const { type, page, ledgerId } = this.$router.params;
    initialize.call(this, type, page, ledgerId);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <View />;
  }
}

function initialize(type, page, ledgerId) {
  const uid = Taro.getStorageSync("uid");
  if (type === "add") {
    events.on("addOne", this.handleAddOne);

    if (page === "index") {
      console.log(globalData);
      var { members, ledgerName, use } = globalData;
    } else {
      var { members, ledgerName, use } = tempLedgerData;
    }

    members = JSON.parse(JSON.stringify(members));
    console.log(members);
    for (let i = 0; i < members.length; i++) {
      members[i].selected = true;
    }

    //默认记账人为付款人
    for (let i = 0; i < members.length; i++) {
      if (members[i].uid === uid) {
        let user = members.splice(i, 1);
        members.unshift(user[0]);
        break;
      }
    }

    this.setState({
      type,
      page,
      ledgerId,
      ledgerName,
      use,
      members
    });
  } else if (type === "fix") {
    events.on("fix", this.handleFix);
    if (page === "index") {
      this.setState({ ...tempBillData, ledgerUse: globalData.use, type, page });
    } else {
      this.setState({
        ...tempBillData,
        ledgerUse: tempLedgerData.use,
        type,
        page
      });
    }
  }
}

export default Bill;
