import React from 'react';
import { View, TextInput, Button, StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const HomeScreen = ({ route, navigation }) => {
  const {location} = route.params;

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <Image
        source={require('./../assets/Logo.png')}
        style={{ alignItems: 'flex-start', width: 100, height: 50 }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        <TextInput
          style={{ ...styles.searchBar, flex: 1 }}
          placeholder="Search destination"
        // Add any necessary onChangeText or onSubmitEditing handlers
        />
        {location && (
          <MapView style={styles.mapStyle} region={location} >
            <Marker coordinate={location} />
          </MapView>
        )}
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
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '400%',
    marginTop: 80
  },
  searchBar: {
    height: 40,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

