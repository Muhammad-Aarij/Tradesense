import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { bundle, video2 } from '../assets/images';
import Bundle from './Bundle';

const BundleTileSection = () => {
  const bundles = [
    { id: '1', title: 'Deep Down', description: 'Lorem ipsum text of the printing industry', image: bundle, locked: true },
    { id: '2', title: 'Deep Down', description: 'Lorem ipsum text of the printing industry', image: bundle, locked: true },
    { id: '3', title: 'Deep Down', description: 'Lorem ipsum text of the printing industry', image: bundle, locked: true },
  ];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {bundles.map(bundle => (
          <Bundle
            key={bundle.id}
            title={bundle.title}
            description={bundle.description}
            imageSource={bundle.image}
            locked={bundle.locked}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft:25,
  },
  heading: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 25,
  },
});

export default BundleTileSection;
