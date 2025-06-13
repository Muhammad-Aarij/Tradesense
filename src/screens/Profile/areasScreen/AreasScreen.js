import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import theme from '../../../themes/theme';
import { bg, check, uncheck } from '../../../assets/images';
import setupProfile from '../../../functions/setupProfile';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';

const AreasScreen = ({ navigation, route }) => {
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [request, setRequest] = useState(route.params?.request || { gender: null, ageRange: null, goals: [], choosenArea: [] });
    const dispatch = useDispatch();
    const areas = [
        'Motivation', 'Leadership', 'Management', 'Planning',
        'Time Management', 'Parenting', 'Emotions', 'Nutrition', 'Habits',
        'Self Confidence', 'Intimacy', 'Mindset', 'Self care',
        'Communication', 'Exercises', 'Empathy'
    ];
    const toggleArea = (area) => {
        setSelectedAreas((prev) => {
            const updatedAreas = prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area];

            setRequest((prevRequest) => ({
                ...prevRequest,
                choosenArea: updatedAreas
            }));

            return updatedAreas;
        });
    };

    const handleProfileSetup = async () => {
        try {
            dispatch(startLoading());
            const response = await setupProfile(request);
            if (response.error) {
                console.error('Failed to setup profile:', response.error);
                return;
            }
            console.log('Profile setup successful:', response);
            // navigation.navigate('HomeScreen');
        } catch (error) {
            console.error('Unexpected error during profile setup:', error);
        }
        finally {
            dispatch(stopLoading())
        }
    };




    return (
        <ImageBackground source={bg} style={styles.container}>
            <Text style={styles.title}>Areas</Text>
            <Text style={styles.subtitle}>Choose areas you’d like to elevate</Text>
            <ScrollView contentContainerStyle={styles.tagsWrapper} showsVerticalScrollIndicator={false}>
                {areas.map((area) => (
                    <TouchableOpacity
                        key={area}
                        style={[
                            styles.tag,
                            selectedAreas.includes(area) && styles.selectedTag,
                        ]}
                        onPress={() => toggleArea(area)}
                    >
                        {/* Checkbox on the Left */}
                        <Image
                            source={selectedAreas.includes(area) ? check : uncheck}
                            style={styles.checkbox}
                        />

                        {/* Area Text */}
                        <Text style={[styles.tagText, selectedAreas.includes(area) && { color: '#70C2E8' }]}>
                            {area}
                        </Text>
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

    button: {
        backgroundColor: theme.primaryColor, padding: 15, borderRadius: 10, marginTop: 20, width: '100%', alignItems: 'center', marginBottom: 40,
    },
    disabledButton: { backgroundColor: 'gray' },
    buttonText: { color: '#fff', fontSize: 16, fontFamily: 'Inter-SemiBold' },
});

export default AreasScreen;
