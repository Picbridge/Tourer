import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Config from 'react-native-config';

const GetResponseFromPrompt = ({ place, onRespond }) => {
    //TODO: update the prompt based on the user filter(which theme of the place they want to visit)
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    const apiKey = Config.GOOGLE_GENERATIVE_AI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const fetchAIResponse = async () => {
        try {
            // Start loading
            setLoading(true);
            const result = await model.generateContent(prompt);
            //retry until the response contains the **Attractions** keyword
            let response = await result.response;
            while (!response.text().includes('Attractions')) {
                response = await model.generateContent(prompt).response;
            }
            // Stop loading and set response
            setLoading(false);
            onRespond(response.text());
            
        }
        catch (error) {
            setLoading(false);
            console.error('Error fetching AI response:', error);
        }
    }

    useEffect(() => {
        setPrompt(`List the best places to visit in ${place}. 
        separate the list to places for attractions, food(divide this to **Restaurants** and **Desserts**), sightseeing, and shopping.
        Use ENGLISH only.
        List at least 15 places for each category.
        Places can be within the city or nearby towns within 40 miles. 
        Do not describe each places. Just list them by name and address.
        Do not use ** except for the categories listed above.
        Here is the template for each category:
        **Attractions**
        * Place 1 [address]
        * Place 2 [address]
        * And so on...`);
    }, [place]);

    useEffect(() => {
        fetchAIResponse();
    }, [prompt]);

    return (
        <>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>{`Places to visit in ${place}?`}</Text>
            </View>
            {loading && (
                <View style={styles.transparentBackground}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            )}
        </>
    );
};

const styles = {
    transparentBackground: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // semi-transparent background
    },
};
export default GetResponseFromPrompt;