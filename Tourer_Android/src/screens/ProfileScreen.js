import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Config from 'react-native-config';

const ProfileScreen = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = Config.GOOGLE_GENERATIVE_AI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const fetchAIResponse = async () => {
    
    const prompt = "Where to visit in Daegu?"
    try {
      // Start loading
      setLoading(true);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      // Stop loading and set response
      setLoading(false);
      setResponse(response.text());
    }
    catch (error) {
      setLoading(false);
      console.error('Error fetching AI response:', error);
    }
  }

  return (
    <View>
      <Button title="Generate AI Text" onPress={fetchAIResponse} />
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Text>{response}</Text>}
    </View>
  )
};

export default ProfileScreen;