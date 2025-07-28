import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { back, hamburger } from '../assets/images';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeProvider';
import { useDispatch } from 'react-redux';
import { openSidebar } from '../redux/slice/loaderSlice';

const Header = ({ title, addpadding, style }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext); // ✅ Use theme from context
  const styles = getStyles(theme);

  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.backButtonTouchable, addpadding ? { paddingLeft: 10 } : null]}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.14)', 'rgba(255, 255, 255, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.blurWrapper}
        >
          <Image source={back} style={styles.backIcon} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Centered Title */}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 45,
    position: 'relative',
  },
  backButtonTouchable: {
    zIndex: 10,
  },
  blurWrapper: {
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: theme.bw || 'white',
  },
  title: {
    fontSize: 15,
    color: theme.textColor,
    fontFamily: 'Outfit-Medium',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});

export default Header;
