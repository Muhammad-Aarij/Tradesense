import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/Header';
import PurchasedCourseCard from './PurchaseCourseCard';
import { bg } from '../../../assets/images';

const { width } = Dimensions.get('window');

// Sample data for purchased courses
const purchasedCoursesData = [
    {
        id: 'pc1',
        title: 'Daily Calm',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        rating: 2,
        time: '15min',
        instructor: 'Alwin',
        image: 'https://placehold.co/400x200/524855/FFF?text=Daily+Calm+Course',
        instructorImage: 'https://placehold.co/50x50/ADD8E6/000?text=A',
    },
    {
        id: 'pc2',
        title: 'Finding Connections',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        rating: 5,
        time: '17min',
        instructor: 'Smith',
        image: 'https://placehold.co/400x200/524855/FFF?text=Connections+Course',
        instructorImage: 'https://placehold.co/50x50/FFB6C1/000?text=S',
    },
];



const PurchasedCoursesScreen = () => {
    // const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <PurchasedCourseCard
            course={item}
            onPress={() => {
                if (navigation && navigation.navigate) {
                    navigation.navigate('CourseEpisodes', { courseId: item.id, courseTitle: item.title, courseImage: item.image });
                } else {
                    console.warn("Navigation prop is not available. Cannot navigate to CourseEpisodes.");
                }
            }}
        />
    );

    return (
        <ImageBackground source={bg} style={styles.container}>
            {/* Header */}
            <Header title={"Purchased Courses"} />

            <FlatList
                data={purchasedCoursesData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#08131F', padding: 25,paddingTop:0 },
    listContainer: {
        paddingVertical: 10,
    },

});

export default PurchasedCoursesScreen;
