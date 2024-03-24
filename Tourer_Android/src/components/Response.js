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
            const response = await result.response;
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
        setPrompt(`Places to visit in ${place}?`);
    }, [place]);

    useEffect(() => {
        fetchAIResponse();
    }, [prompt]);

    return (
        <>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>{prompt}</Text>
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