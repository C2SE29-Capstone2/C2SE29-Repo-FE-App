import React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const NavigationBar = () => {
  const router = useRouter();

  const navItems = [
    { icon: "home", route: "/teachers/home" },
    { icon: "person", route: "/teachers/account_page" },
    { icon: "photo", route: "/teachers/album" },
    { icon: "phone", route: "/teachers/contact_page" },
    { icon: "settings", route: "/teachers/account_page" },
  ];

  return (
    <View
      style={{
        width: 320,
        height: 64,
        backgroundColor: "rgba(77, 182, 172, 0.9)",
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 16,
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: [{ translateX: -160 }],
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
      }}
    >
      {navItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push(item.route as any)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              index === 0 ? "rgba(255,255,255,0.2)" : "transparent",
          }}
        >
          <MaterialIcons
            name={item.icon as any}
            size={24}
            color={index === 0 ? "#fff" : "rgba(255,255,255,0.7)"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NavigationBar;
