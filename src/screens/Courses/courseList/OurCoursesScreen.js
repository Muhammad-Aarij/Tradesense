import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { bg, user } from '../../../assets/images';
import Header from '../../../components/Header';
import CourseCard from './CourseCard';
import { useCourses } from '../../../functions/handleCourses';
const { height, width } = Dimensions.get('window');

const OurCoursesScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const { data: courses, isLoading, error, refetch, isFetching } = useCourses();
  const [refreshing, setRefreshing] = useState(false);

  // Delay loading cleanup (min 2s)
  useEffect(() => {
    dispatch(startLoading());
    const timeout = setTimeout(() => {
      if (!isLoading) dispatch(stopLoading());
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(startLoading());
    await refetch();
    setTimeout(() => {
      setRefreshing(false);
      dispatch(stopLoading());
    }, 2000);
  }, [refetch]);

  const renderCourseItem = ({ item }) => (
    <CourseCard
      id={item._id}
      navigation={navigation}
      imageSource={{ uri: item.thumbnail }}
      title={item.title}
      rating={item.averageRating ?? 0}
      description={item.description}
      profileImage={user}
      profileName={item.instructorName}
      // profileRole={item.instructorExperienceLevel}
      price={`${item.price} $`}
      onPress={() =>
        navigation.navigate('CourseDetailScreen', {
          courseId: item._id,
          courseTitle: item.title
        })
      }
    />
  );

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'white' }}>Error fetching courses: {error.message}</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={bg} style={styles.container}>
      <SafeAreaView>
        <Header title="Our Courses" />
        <FlatList
          numColumns={2}
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={item => item._id}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08131F', paddingTop: 20, padding: 10, paddingBottom: height * 0.2   },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#08131F' },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: 16 },
  contentContainer: { paddingBottom: 20 }
});

export default OurCoursesScreen;
