import React from 'react';
import {View, Text, Image} from 'react-native';

const Main = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Hello World!</Text>
      <Image 
        source={{uri: 'https://github.com/Picbridge/Tourer/blob/main/references/ref1.png'}}
        style={{width: 100, height: 100}}
      />
    </View>
  );
};

export default Main;