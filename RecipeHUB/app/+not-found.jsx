import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function NotFound() {
  return (
    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
      <Text style={{fontSize:20}}>Faqja nuk u gjet</Text>
      <Link href="/">Kthehu</Link>
    </View>
  );
}