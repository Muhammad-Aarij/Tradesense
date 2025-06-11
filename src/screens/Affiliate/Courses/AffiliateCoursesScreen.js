import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/Header';
import { bg } from '../../../assets/images';
import PurchasedCourseCard from '../../Courses/purchaseCourse/PurchaseCourseCard';

const { width } = Dimensions.get('window');

// Sample data for purchased courses
const AffiliateCourses = [
    {
        id: 'pc1',
        title: 'Daily Calm',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        rating: 2,
        time: '15min',
        instructor: 'Alwin',
        image: 'https://placehold.co/400x200/524855/FFF?text=Daily+Calm+Course',
        instructorImage: 'https://placehold.co/50x50/ADD8E6/000?text=A',
        type: "Affiliate",
        percent: "50%",
        price: "$220",
        courseUrl: "https://www.linkhere.com/"
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
        type: "Affiliate",
        percentage: "50%",
        videoUrl: "https://www.linkhere.com/",
        type: "Affiliate",
        percent: "90%",
        price: "$100",
        courseUrl: "https://www.linkhere.com/7498279"
    },
];



const AffiliateCoursesScreen = () => {
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
            <Header title={"Courses"} />

            <FlatList
                data={AffiliateCourses}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#08131F', padding: 25, paddingTop: 0 },
    listContainer: {
        paddingVertical: 10,
    },

});

export default AffiliateCoursesScreen;
