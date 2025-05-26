import React from 'react';
import { View, Image, Text } from 'react-native';

// Component
const NavigationBar = () => {
  return (
    <View className="w-80 h-16 relative">
      {/* Background Rectangle */}
      <View
        className="w-80 h-16 absolute rounded-2xl"
        style={{
          backgroundColor: 'rgba(0, 255, 255, 0.5)',
          borderWidth: 1,
          borderColor: 'rgba(0, 255, 255, 0.5)',
          shadowColor: 'rgba(95, 211, 239, 0.51)',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 1,
          shadowRadius: 43,
          elevation: 10,
        }}
      />

      {/* Frame with icons */}
      <View className="w-80 h-12 absolute flex-row justify-between items-start pl-4 pt-1.5">
        {/* Home Icon */}
        <View className="w-11 h-11 relative">
          <Text
            className="w-11 h-11 absolute text-center text-sky-500 text-xl font-bold tracking-tight"
            style={{
              textShadowColor: 'rgba(255, 255, 255, 1)',
              textShadowOffset: { width: -10, height: -10 },
              textShadowRadius: 20,
            }}
          >
            🏠
          </Text>
        </View>

        {/* Card Icon */}
        <View className="w-11 h-11 relative">
          <Text className="w-11 h-11 absolute text-center text-black/50 text-xl font-bold tracking-tight">
            💳
          </Text>
        </View>

        {/* Trade Icon (dùng emoji thay cho SVG) */}
        <View className="w-11 h-11 relative items-center justify-center">
          <Text className="w-11 h-11 absolute text-center text-blue-500 text-xl font-bold tracking-tight">
            💱
          </Text>
        </View>

        {/* Contact Icon */}
        <View className="w-11 h-11 relative">
          <Text className="w-11 h-11 absolute text-center text-black/50 text-xl font-bold tracking-tight">
            📞
          </Text>
        </View>

        {/* Setting Icon */}
        <View className="w-11 h-11 relative">
          <Text className="w-11 h-11 absolute text-center text-black/50 text-xl font-bold tracking-tight">
            ⚙️
          </Text>
        </View>
      </View>

      {/* Facial Recognition Image */}
      <View className="absolute" style={{ left: 157, top: 13 }}>
        <Image
          source={require('../../assets/images/facialRecognition.png')}
          className="w-7 h-7"
        />
      </View>
    </View>
  );
};

export default NavigationBar;