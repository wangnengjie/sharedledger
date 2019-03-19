import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import events from '../../utils/events'

export default class My extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    events.on('test', msg => {
      console.log(msg);
    })
    events.trigger('test', 'this is a test!!!')
  }

  render(){
    return <View>???<Text>???</Text></View>
  }
}