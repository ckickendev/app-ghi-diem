import { Stack } from 'expo-router';

export default function HistoryStack() {
    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="list" options={{ headerTitle: 'Lịch sử', headerBackTitle: 'Back', headerStyle: { backgroundColor: '#e20035ff' }, headerTintColor: '#fff', }} />
            <Stack.Screen name="setup" options={{ headerTitle: 'Cài đặt', headerBackTitle: 'Back', headerStyle: { backgroundColor: '#e20035ff' }, headerTintColor: '#fff', }} />
            <Stack.Screen name="game" options={{ headerTitle: 'Tính điểm', headerBackTitle: 'Back', headerStyle: { backgroundColor: '#e20035ff' }, headerTintColor: '#fff', }} />
        </Stack>
    );
}
