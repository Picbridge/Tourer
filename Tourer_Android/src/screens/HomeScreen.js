import React , { useState }from 'react';
import { View, Button, StyleSheet, Image } from 'react-native';
import MapSearch from '../components/MapSearch';

const HomeScreen = ({ route, navigation }) => {
  const location = route.params.location;

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <Image
        source={require('./../assets/Logo.png')}
        style={{ alignItems: 'flex-start', width: 100, height: 50 }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        <MapSearch initialLocation = { location } />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          title="Go to Profile"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>

    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  
});

