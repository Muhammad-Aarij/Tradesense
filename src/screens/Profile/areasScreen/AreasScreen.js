import React, { useContext, useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import theme from '../../../themes/theme';
import { bg, check, uncheck } from '../../../assets/images';
import setupProfile from '../../../functions/setupProfile';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { loginUser, setProfilingDone } from '../../../redux/slice/authSlice';
import { fetchChosenAreas } from '../../../functions/profiling';
import { ThemeContext } from '@react-navigation/native';

const AreasScreen = ({ navigation, route }) => {
    const { areaImages } = useContext(ThemeContext);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [availableAreas, setAvailableAreas] = useState([]);
    const { user, token } = route.params;;
    const userId = user?._id;
    const [request, setRequest] = useState(route.params?.request || {
        gender: null,
        ageRange: null,
        goals: [],
        choosenArea: [],
    });
    const dispatch = useDispatch();

    useEffect(() => {
        const loadAreas = async () => {
            const data = await fetchChosenAreas();
            setAvailableAreas(data);
        };
        loadAreas();
    }, []);

    const toggleArea = (areaId) => {
        setSelectedAreas((prev) => {
            const updated = prev.includes(areaId)
                ? prev.filter((a) => a !== areaId)
                : [...prev, areaId];

            setRequest((prevReq) => ({
                ...prevReq,
                choosenArea: updated,
            }));

            return updated;
        });
    };

    const handleProfileSetup = async () => {
        try {
            dispatch(startLoading());

            const response = await setupProfile(request, userId);
            if (response.error) {
                console.error('Failed to setup profile:', response.error);
                return;
            }

            // ✅ Push user & token to Redux
            await dispatch(loginUser({
                token: token,
                user: user,
                themeType: 'dark', // or read from API/config
            }));

            dispatch(setProfilingDone(true));


        } catch (err) {
            console.error('Unexpected error during profile setup:', err);
        } finally {
            dispatch(stopLoading());
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground source={bg} style={styles.container}>
                <Text style={styles.title}>Areas</Text>
                <Text style={styles.subtitle}>Choose areas you’d like to elevate</Text>
                <ScrollView contentContainerStyle={styles.tagsWrapper} showsVerticalScrollIndicator={false}>
                    {availableAreas.map((area) => (
                        <TouchableOpacity
                            key={area._id}
                            style={[
                                styles.tag,
                                selectedAreas.includes(area._id) && styles.selectedTag,
                            ]}
                            onPress={() => toggleArea(area._id)}
                        >
                            {!areaImages && <Image
                                source={selectedAreas.includes(area._id) ? check : uncheck}
                                style={styles.checkbox}
                            />}
                            <Text style={[
                                styles.tagText,
                                selectedAreas.includes(area._id) && { color: '#70C2E8' },
                            ]}>
                                {area.text}
                            </Text>
                            {areaImages && <Image source={{ uri: area.image }} style={styles.goalIcon} />}


                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <TouchableOpacity
                    style={[styles.button, selectedAreas.length === 0 && styles.disabledButton]}
                    disabled={selectedAreas.length === 0}
                    onPress={handleProfileSetup}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: theme.darkBlue, paddingHorizontal: 50, paddingBottom: 10 },
    title: { fontSize: 28, fontFamily: "Inter-SemiBold", color: "#FFFFFF", marginTop: 50 },
    subtitle: { fontSize: 13, fontFamily: "Inter-Medium", color: "#FFFFFF", marginBottom: 35 },
    tagsWrapper: { flexWrap: "nowrap", flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center', width: '100%' },
    tag: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: theme.borderColor,
        borderRadius: 10, padding: 8, backgroundColor: '#0d151e',
    },
    selectedTag: { backgroundColor: 'rgba(112,194,232,0.3)', borderColor: theme.primaryColor },
    tagText: { color: '#fff', fontFamily: 'Inter-Medium', fontSize: 13 },
    checkbox: { width: 20, height: 25, resizeMode: "contain", marginRight: 10 },
    goalIcon: { width: 30, height: 30, resizeMode: 'contain', marginRight: 10 },

    button: {
        backgroundColor: theme.primaryColor, padding: 15, borderRadius: 10, marginTop: 20, width: '100%', alignItems: 'center', marginBottom: 40,
    },
    disabledButton: { backgroundColor: 'gray' },
    buttonText: { color: '#fff', fontSize: 16, fontFamily: 'Inter-SemiBold' },
});

export default AreasScreen;
