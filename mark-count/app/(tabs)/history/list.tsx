import React from 'react';
import { View, Text, StatusBar, StyleSheet, Button, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HistoryIndex() {
    const router = useRouter();
    const [isToday, setIsToday] = React.useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.titleContainer}>
                <TouchableOpacity style={[styles.titleItem, isToday && styles.titleItemActive]} onPress={() => setIsToday(true)}>
                    <Text style={styles.titleText}>Hôm nay</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.titleItem, !isToday && styles.titleItemActive]} onPress={() => setIsToday(false)}>
                    <Text style={styles.titleText}>Cũ hơn</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.fixedButton}>
                <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryText}>Bắt đầu</Text>
                </TouchableOpacity>
            </View>
            <ImageBackground source={require('@/assets/images/empty-history.png')} resizeMode="contain" style={styles.image}>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    titleItemActive: {
        backgroundColor: '#dec2b1ff',
    },
    image: {
        width: '100%',
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        gap: 2,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    titleItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ef6b19ff',
        paddingVertical: 14,
        borderRadius: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginBottom: 20,
        color: '#666',
    },
    fixedButton: {
        width: '40%',
        position: 'absolute',
        bottom: 20,
        right: 30,
    },
    primaryButton: {
        backgroundColor: 'green',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 5,
    },
    primaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
