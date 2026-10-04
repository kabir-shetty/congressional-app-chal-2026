import { Link, Tabs } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch((err) => console.log(err));
  }, []);

  return <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7be0a2",
        tabBarInactiveTintColor: "#7be0a2",
        tabBarInactiveBackgroundColor: "rgba(16, 40, 59, 0.94)",
        tabBarActiveBackgroundColor: "rgba(10, 24, 38, 0.94)",
        tabBarStyle: { borderTopWidth: 0 },
        
        header: () => (
          <View style={styles.headerBox}>
            <Text style={styles.headerText}>dih</Text>
            <Link href="../settings" style={styles.logout}></Link>
          </View>
        ),
      }}>
        
      <Tabs.Screen name="check" options={({ navigation }) => ({
        headerShown: true,
        tabBarLabelStyle: {
          fontWeight: navigation.isFocused() ? '700' : '400',
        }
      })}/>

      <Tabs.Screen name="quiz" options={({ navigation }) => ({
        headerShown: true,
        tabBarLabelStyle: {
          fontWeight: navigation.isFocused() ? '700' : '400',
        }
      })}/>

      <Tabs.Screen name="info/ai-scams" options={({ navigation }) => ({
        headerShown: true,
        tabBarLabelStyle: {
          fontWeight: navigation.isFocused() ? '700' : '400',
        }
      })}/>
    </Tabs>
}


const styles = StyleSheet.create({
  headerBox: {
    width: '100%',
    backgroundColor: 'rgba(10, 26, 38, 0.94)',
    flexDirection: 'row',
    alignItems: 'center', 

    paddingHorizontal: 16,
    height: 70, 
  },
    headerText: {
    color: "#7be0a2",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    textAlign: 'center',
    marginTop: 8,
    flex: 1,
  },
  logout: {
    color: "#7be0a2",
    marginLeft: 4,
    marginTop: 8,
    textAlign: 'right',
  },
  logo: {
    marginTop: 8,
    width: 55,
    height: 55,
  },
})