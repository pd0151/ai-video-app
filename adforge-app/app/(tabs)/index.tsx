import { WebView } from "react-native-webview";
import { View, StyleSheet } from "react-native";

export default function HomeScreen() {
return (
<View style={styles.container}>
<WebView source={{ uri: "http://192.168.1.210:3000" }} />
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
},
});