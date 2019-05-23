import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Progress } from "@tarojs/components";
import date from "../../images/date.png";
import "./Graphs.scss";

class Graph extends Component {
  render() {
    const details = this.props.details;
    const type = this.props.type;
    let graph;
    if (type === "date") {
      graph = (
        <View>
          {details.map((detail, index) => {
            return (
              <View key={index} className='graph-card'>
                <View className='graph-card-icon'>
                  <Image src={date} />
                  <Text style='color:#BA96FC'>{detail[0]}</Text>
                </View>
                <View className='graph-card-detail'>
                  <View className='detail-text'>
                    <Text className='detail-left'>{`${detail[2]}%`}</Text>
                    <Text className='detail-right'>{`${detail[1]}元`}</Text>
                  </View>
                  <View className='graph-progress'>
                    <Progress
                      percent={detail[2]}
                      border-radius='4.5rpx'
                      stroke-width='9rpx'
                      backgroundColor='#F7F2FF'
                      activeColor='#BA96FC'
                      active
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      );
    }
    if (type === "category") {
      graph = (
        <View>
          {details.map((detail, index) => {
            return (
              <View key={index} className='graph-card'>
                <View className='graph-card-icon'>
                  <Image src={date} />
                  <Text style='color:#FFB63B'>{detail[0]}</Text>
                </View>
                <View className='graph-card-detail'>
                  <View className='detail-text'>
                    <Text className='detail-left'>{`${detail[2]}%`}</Text>
                    <Text className='detail-right'>{`${detail[1]}元`}</Text>
                  </View>
                  <View className='graph-progress'>
                    <Progress
                      percent={detail[2]}
                      border-radius='4.5rpx'
                      stroke-width='9rpx'
                      backgroundColor='#FFF9F0'
                      activeColor='#FFC86C'
                      active
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      );
    }
    if (type === "pay") {
      graph = (
        <View>
          {details.map((detail, index) => {
            return (
              <View key={index} className='graph-card'>
                <View className='graph-card-icon'>
                  <Image src={detail.avatarUrl} />
                  <Text style='color:#545454'>{detail.nickName}</Text>
                </View>
                <View className='graph-card-detail'>
                  <View className='detail-text'>
                    <Text className='detail-left'>{`${detail.persent}%`}</Text>
                    <Text className='detail-right'>{`${detail.money}元`}</Text>
                  </View>
                  <View className='graph-progress'>
                    <Progress
                      percent={detail.percent}
                      border-radius='4.5rpx'
                      stroke-width='9rpx'
                      backgroundColor='#FFF9F0'
                      activeColor='#FFC86C'
                      active
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      );
    }
    return <View>{graph}</View>;
  }
}

Graph.defaultProps = {
  type: String,
  details: Array
};

export default Graph;
