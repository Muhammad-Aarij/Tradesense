import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CourseCard from './CourseCard';
import { user, wave } from '../../../assets/images';
import Header from '../../../components/Header';

const courses = [
  { id: '1', title: 'Daily Calm', price: '$100', rating: 5 },
  { id: '2', title: 'Finding Connections', price: '$100', rating: 4 },
  { id: '3', title: 'Advanced React Native', price: '$150', rating: 4.5 },
  { id: '4', title: 'Meditation & Mindfulness', price: '$80', rating: 5 },

];

const OurCoursesScreen = ({ navigation }) => {
  const renderCourseItem = ({ item }) => (
    <CourseCard
      imageSource={wave}
      time={`${Math.floor(Math.random() * 30) + 10}min`}
      title={item.title}
      rating={item.rating}
      description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      profileImage={user}
      profileName="Name"
      profileRole="Expert"
      price={item.price}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item.id, courseTitle: item.title })}
    />
  );

  return (
    <View style={styles.container}>
      <Header title={"Our Courses"}/>
      <FlatList
        numColumns={2}
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={item => item.id}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08131F', paddingTop: 10, padding: 20, },
  header: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: 16 },
  contentContainer: { paddingBottom: 20 },
});

export default OurCoursesScreen;
