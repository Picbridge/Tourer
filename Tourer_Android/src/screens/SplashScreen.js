import React from 'react';
import { Animated, StyleSheet, Image, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

const SplashScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    const [location, setLocation] = React.useState(null);

    const getLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (hasPermission) {
            Geolocation.getCurrentPosition(
                position => {
                    //console.log('Current Position:', position);
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                },
                error => {
                    console.error('Geolocation error:', error.code, error.message);
                    setLocation(null);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
        } else {
            console.log('Location permission denied');
            setLocation({
                latitude: 37.4219983,
                longitude: -122.084,
                latitudeDelta: 100,
                longitudeDelta: 100,
            });
        }
    };

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    React.useEffect(() => {
        getLocation();
    }, []);

    // Pass location to HomeScreen after 2 seconds
    React.useEffect(() => {
        if (location !== null) {
            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }).start(() => navigation.navigate('Home', { location })); // Navigate after fade-out
            }, 2000);
        }
    }, [location, navigation]); // add navigation to dependency array

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]} >
            <Image
                source={require('./../assets/Logo.png')}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
});

export default SplashScreen;

const requestLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Geolocation Permission',
                message: 'Can we access your location?',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        console.log('granted', granted);
        if (granted === 'granted') {
            console.log('You can use Geolocation');
            return true;
        } else {
            console.log('You cannot use Geolocation');
            return false;
        }
    } catch (err) {
        return false;
    }
};