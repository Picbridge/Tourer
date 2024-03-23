import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import Config from 'react-native-config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { Dimensions } from 'react-native';

const MapSearch = ({ initialLocation }) => {
    const [location, setLocation] = useState(initialLocation);
    const [searched_location, setSearchedLocation] = useState(null);
    const first_render = useRef(true);
    const mapRef = useRef(null);

    useEffect(() => {
        first_render.current = false;
    }, []);

    useEffect(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(location, 8500); // 500 is the duration of the animation in milliseconds
        }
      }, [location]);

    return (
        <>
            <MapView ref={mapRef} style={styles.mapStyle} region={location}>
                <Marker coordinate={location} />
            </MapView>

            <GooglePlacesAutocomplete
                fetchDetails={true}
                textInputProps={{
                    InputComp: TextInput,
                    placeholder: 'Search destination',
                    style: { ...styles.searchBar, flex: 1 },
                    onChangeText: async (value) => {
                        if (!first_render.current) {
                            if (value === searched_location) return; 
                            console.log('onChangeText:', value);
                            setSearchedLocation(value);

                            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=${Config.GOOGLE_MAPS_API_KEY}&language=en`);
                            if (response.data.status === 'OK') {
                                const topResult = response.data.predictions[0];
                                console.log('Top result:', topResult.description);
                                
                                const detailsResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${topResult.place_id}&key=${Config.GOOGLE_MAPS_API_KEY}`);
                                if (detailsResponse.data.status === 'OK') {
                                    const location = detailsResponse.data.result.geometry.location;
                                    setLocation({
                                        latitude: location.lat,
                                        longitude: location.lng,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    });
                                }
                            }
                        }
                    },
                }}
                onPress={(data, details = null) => {
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
                }}
            />
            
        </>
    );
};

const styles = {
    mapStyle: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.25,
    },
    searchBar: {
        height: Dimensions.get('window').height * 0.04,
        marginTop: Dimensions.get('window').height * 0.26,
        marginLeft: Dimensions.get('window').width * 0.02,
        marginRight: Dimensions.get('window').width * 0.02,
        borderWidth: 1,
        padding: 10,
    },
};

export default MapSearch;