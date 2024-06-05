import {Text} from "react-native";
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";

export default function TaskScreen() {
    return (
        <SafeAreaView style={{flex: 1}} >
            <Text style={{justifyContent: 'center', alignItems: 'center'}}>
                task
            </Text>
        </SafeAreaView>
    )
}
