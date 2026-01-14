import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useGame } from '../context/GameContext';
import { Check } from 'lucide-react-native';
import CustomSwitch from "./custom/SwitchCustom";

const SettingScreen = () => {
    const { theme, setTheme, themeList, isPlaySong, setIsPlaySong, soundList } = useGame();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Chủ đề</Text>
                <View style={styles.themeList}>
                    {themeList.map((item: any, index: number) => {
                        const isActive = theme.name === item.name;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.themeItem,
                                    isActive && styles.themeItemActive
                                ]}
                                onPress={() => setTheme(item)}
                            >
                                <View style={styles.themeInfo}>
                                    <Text style={[styles.themeName, isActive && styles.themeNameActive]}>
                                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                    </Text>
                                </View>
                                {isActive && <Check size={20} color="#16a34a" />}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={styles.sectionTitle}>Âm thanh</Text>
                {/* <View style={styles.themeList}>
                    {soundList.map((item: any, index: number) => {
                        const isActive = theme.name === item.name;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.themeItem,
                                    isActive && styles.themeItemActive
                                ]}
                            >
                                <View style={styles.themeInfo}>
                                    <Text style={[styles.themeName, isActive && styles.themeNameActive]}>
                                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                    </Text>
                                </View>
                                {isActive && <Check size={20} color="#16a34a" />}
                            </TouchableOpacity>
                        );
                    })}
                    <View style={styles.themeItem}>
                        <Text style={styles.themeName}>Âm thanh</Text>
                        <CustomSwitch value={isPlaySong} onChange={() => setIsPlaySong(!isPlaySong)} />
                    </View>
                </View> */}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#374151',
    },
    themeList: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    themeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    themeItemActive: {
        backgroundColor: '#f0fdf4',
    },
    themeInfo: {
        flex: 1,
    },
    themeName: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 4,
    },
    themeNameActive: {
        fontWeight: 'bold',
        color: '#16a34a',
    },
    themeSound: {
        fontSize: 12,
        color: '#9ca3af',
    },
});

export default SettingScreen;