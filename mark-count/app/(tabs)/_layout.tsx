import { Tabs } from 'expo-router';
import { History, Settings } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#16a34a' }}>
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color }) => <History size={24} color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    title: 'Setting',
                    tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
