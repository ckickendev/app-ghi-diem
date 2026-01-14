import { Colors } from '@/constants/theme';
import { useGame } from '@/context/GameContext';
import { Tabs } from 'expo-router';
import { History, Settings } from 'lucide-react-native';
import { ImageBackground, View, StyleSheet } from 'react-native';

export default function TabLayout() {
    const { theme } = useGame();
    return (
        <View style={styles.container}>
            <Tabs screenOptions={{ tabBarActiveTintColor: '#16a34a' }}>
                <Tabs.Screen
                    name="history"
                    options={{
                        title: 'Lịch Sử',
                        tabBarIcon: ({ color }) => <History size={24} color={color} />,
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="setting"
                    options={{
                        title: 'Cài Đặt',
                        tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
                        headerShown: true,
                        headerTitleStyle: {
                            color: Colors.tet.text,
                        },
                        headerStyle: {
                            backgroundColor: Colors.tet.background,
                        },
                    }}
                />
            </Tabs>
            <View
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
            >
                <ImageBackground
                    source={theme.backgroundImage}
                    resizeMode="cover"
                    style={[StyleSheet.absoluteFillObject, { opacity: 0.05, zIndex: 100, width: '100%', height: '100%' }]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
