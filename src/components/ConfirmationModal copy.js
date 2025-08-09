import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Modal
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import theme from '../themes/theme';
import { click, gallery, pic } from '../assets/images';

const UploadModal = ({ isVisible, onClose, onImagePicked }) => {

  const openCamera = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8 }, response => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        onImagePicked(response.assets[0]);
      }
      onClose();
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        onImagePicked(response.assets[0]);
      }
      onClose();
    });
  };

  return (
    <Modal transparent animationType="fade" visible={isVisible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.blurContainer} />
        <View style={styles.modalContainer}>
        {/* <Text style={styles.title}>Upload Your Profile Image</Text> */}
          <Image source={pic} style={styles.icon} />
          {/* <Text style={styles.message}>Choose an option to upload your image</Text> */}

          <TouchableOpacity onPress={openCamera} style={styles.button}>
            <Image source={click} style={{width:25,height:25,resizeMode:"contain"}} />
            <Text style={styles.buttonText}> Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={openGallery} style={[styles.button, { marginTop: 12 }]}>
            <Image source={gallery} style={{width:25,height:25,resizeMode:"contain"}} />
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: '#444', marginTop: 20 }]}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(14, 14, 14, 0.81)',
  },
  blurContainer: {
    position: 'absolute', width: '100%', height: '100%',
  },
  modalContainer: {
    backgroundColor: "#080E17",
    paddingVertical: 30, paddingHorizontal: 25,
    borderRadius: 15, alignItems: 'center', width: "80%",
  },
  icon: {
    width: 130, height: 130, resizeMode: "contain", marginBottom: 20,
  },
  title: {
    fontSize: 16, fontFamily: "Outfit-SemiBold",
    color: "#EFEFEF", textAlign: "center", marginBottom: 8,
  },
  message: {
    fontSize: 14, color: "#EFEFEF", textAlign: 'center',
    marginBottom: 20, fontFamily: "Outfit-Regular", width: "90%",
  },
  button: {
    flexDirection:"row",
    gap:10,
    backgroundColor: theme.primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: "Outfit-Regular",
  },
});

export default UploadModal;
