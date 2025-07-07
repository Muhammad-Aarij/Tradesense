import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { cf1, cf2, cf3, cf4 } from '../../../assets/images'; // adjust as needed
import theme from '../../../themes/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

const CardCarousel = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const position = useRef(new Animated.Value(0)).current;

  const cardData = [
    {
      title: 'Core Features',
      features: [
        { icon: cf1, text: 'Smart Trading Plans' },
        { icon: cf2, text: 'Expert Video Courses' },
        { icon: cf3, text: 'AI Chat Assistant' },
        { icon: cf4, text: 'Affiliate Marketing' },
      ],
    },
    {
      title: 'About Us',
      features: [
        {
          text:
            'Our mission is to make trading knowledge accessible and profitable for everyone by leveraging financial intelligence with smart tech.',
        },
      ],
    },
  ];

  const handleCardChange = (nextIndex) => {
    const direction = nextIndex > currentCard ? 1 : -1;
    Animated.timing(position, {
      toValue: direction * width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      position.setValue(-direction * width);
      setCurrentCard(nextIndex);
      Animated.timing(position, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50 && currentCard < cardData.length - 1) {
          handleCardChange(currentCard + 1);
        } else if (gestureState.dx > 50 && currentCard > 0) {
          handleCardChange(currentCard - 1);
        }
      },
    })
  ).current;

  return (
    <View style={styles.carouselContainer} {...panResponder.panHandlers}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX: position }],
          },
        ]}
      >
        <Text style={styles.title}>{cardData[currentCard].title}</Text>
        <View style={styles.line} />
        {cardData[currentCard].features.map((item, index) => (
          <View style={styles.featureItem} key={index}>
            {item.icon && <Image source={item.icon} style={styles.icon} />}
            <Text style={styles.text}>{item.text}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: theme.borderColor,
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    position: 'absolute',
  },
  title: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  line: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  icon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginRight: 10,
  },
  text: {
    color: '#ccc',
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default CardCarousel;
