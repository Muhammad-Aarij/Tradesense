// components/ScrollToTopWrapper.js
import React, { useRef } from 'react';
import { ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const ScrollToTopWrapper = ({ children, ...props }) => {
  const scrollRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: true });
      }
    }, [])
  );

  return (
    <ScrollView ref={scrollRef} {...props} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
};

export default ScrollToTopWrapper;
