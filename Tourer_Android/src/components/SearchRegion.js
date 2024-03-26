import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import Config from 'react-native-config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { TextInput, Dimensions } from 'react-native';
import axios from 'axios';

const SearchRegion = ({ initialLocation, onLocationChange }) => {
    const [location, setLocation] = useState(null);
    const inputRef = useRef();
    //const [searchedLocation, setSearchedLocation] = useState(null);

    const handleKeyPress = async () => {
        const searchedLocation = inputRef.current?.getAddressText();
        const topResult = await fetchTopResult(searchedLocation);
        //console.log('Enter key pressed:', topResult.description);
        {topResult && setDetails(topResult.place_id);}
        onLocationChange({description: topResult.description, place_id:topResult.place_id});
    };

    const fetchTopResult = async (value) => {
        try {
          const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=${Config.GOOGLE_MAPS_API_KEY}&language=en&types=(regions)`);
          if (response.data.status === 'OK') {
            const topResult = response.data.predictions[0];
            return topResult;
          }
        } catch (error) {
          console.error('Error fetching top result:', error);
        }
      };

      const setDetails = async (place_id) => {
        try {
            const detailsResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${Config.GOOGLE_MAPS_API_KEY}`);
            if (detailsResponse.data.status === 'OK') {
                const location = detailsResponse.data.result.geometry.location;
                setLocation({
                    latitude: location.lat,
                    longitude: location.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            }
        } catch (error) {
          console.error('Error setting location:', error);
        }
      };
    
      useEffect(() => {
        setLocation(initialLocation);
    }, [initialLocation]);

    return (
        <>
            <MapView style={styles.mapStyle} region={location}>
                <Marker coordinate={location} />
            </MapView>

            <GooglePlacesAutocomplete
                fetchDetails={true}
                ref = {inputRef}
                textInputProps={{
                    InputComp: TextInput,
                    placeholder: 'Search destination',
                    style: styles.searchBar,
                    // onChangeText: async (localSearchedLocation) => {
                    //     if (localSearchedLocation.trim() !== '') {
                    //         if (localSearchedLocation === searchedLocation) return;
                    //         const topResult = await fetchTopResult(localSearchedLocation);
                    //         {topResult && setDetails(topResult.place_id);}
                    //         setSearchedLocation(localSearchedLocation);
                    //     }
                    // },
                    onSubmitEditing: handleKeyPress,
                    returnKeyType: 'search',
                }}
                onPress={ (data, details = null) => {
                    
                    //console.log('onPress:', data.description);
                    onLocationChange({description: data.description, place_id: details.place_id});
                    setLocation({
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      });
                  }}
                query={{
                    key: Config.GOOGLE_MAPS_API_KEY,
                    language: 'en',
                    types: '(regions)',
                }}
            />
        </>
    );
};

const styles = {
    mapStyle: {
        flex: 1,
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.25,
    },
    searchBar: {
        flex: 1,
        height: Dimensions.get('window').height * 0.04,
        marginTop: Dimensions.get('window').height * 0.26,
        marginLeft: Dimensions.get('window').width * 0.02,
        marginRight: Dimensions.get('window').width * 0.02,
        borderWidth: 1,
        padding: 10,
    },
};

export default SearchRegion;