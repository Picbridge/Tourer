import React , { useEffect, useState }from 'react';
import { View, Button, StyleSheet, Image, Text, Dimensions,ScrollView } from 'react-native';
import SearchRegion from '../components/SearchRegion';
import GetResponseFromPrompt from '../components/Response';

const HomeScreen = ({ route, navigation }) => {
  const location = route.params.location;
  const [searchedLocation, handleLocationChange] = useState({
    description: '',
    place_id: '',
  });
  const [response, handleRespond] = useState('');
  

  return (
    <View style = {{flex: 1}}>
      <Image
        source={require('./../assets/Logo.png')}
        style={styles.logo}
      />

      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        <SearchRegion initialLocation = { location } onLocationChange={ handleLocationChange } />
      </View>

      
      {searchedLocation.description != '' && 
      <GetResponseFromPrompt place={searchedLocation.description} onRespond={handleRespond} />}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView style={{ flex: 1 }}>
          {response && <Text>{response}</Text>}
        </ScrollView>

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
  logo: {
    alignItems: 'flex-start', 
    width: Dimensions.get('window').width * 0.25, 
    height: Dimensions.get('window').height * 0.04,
    marginTop: Dimensions.get('window').height * 0.025,
  },
  
});

