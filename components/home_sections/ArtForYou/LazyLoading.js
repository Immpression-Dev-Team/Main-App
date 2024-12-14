import React from "react";
import { Image, ActivityIndicator, View, StyleSheet } from "react-native";

export default function LazyImage({ uri, style }) {
    const [isLoaded, setIsLoaded] = React.useState(false);

    return (
        <View style={style}>
            {!isLoaded && (
                <ActivityIndicator style={StyleSheet.absoluteFill} size="small" />
            )}
            <Image
                source={{ uri }}
                style={[style, { display: isLoaded ? "flex" : "none" }]}
                onLoad={() => setIsLoaded(true)}
            />
        </View>
    );
}
