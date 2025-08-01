import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Bundle from './Bundle';

const BundleTileSection = ({ title, description, imageSource, locked, type, url, duration,pillar }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (type === 'audio') {
      navigation.navigate('TrackPlayer', {
        AudioTitle: title,
        AudioDescr: description,
        Thumbnail: imageSource?.uri || imageSource,
        AudioUrl: url,
        shouldFetchTrack: true,
      });
    } else if (type === 'video') {
      navigation.navigate('VideoPlayer', {
        VideoTitle: title,
        VideoDescr: description,
        Thumbnail: imageSource?.uri || imageSource,
        VideoUrl: url,
      });
    }
  };

  return (
    <Bundle
      title={title}
      description={description}
      imageSource={imageSource}
      locked={locked}
      pillar={pillar}
      duration={duration}
      type={type}
      onPress={handlePress}
    />
  );
};

export default BundleTileSection;
