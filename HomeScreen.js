import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Button, Avatar, Text } from 'react-native-paper';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker'; // Image picker for media upload

const HomeScreen = ({ navigation }) => {
  const [mediaUri, setMediaUri] = useState(null); // To store selected media URI
  const [uploading, setUploading] = useState(false); // To track upload status
  const storage = getStorage(); // Firebase Storage instance

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };

  // Dummy data for feed
  const posts = [
    {
      id: 1,
      user: 'John Doe',
      avatarUrl: 'https://via.placeholder.com/150', // Sample avatar URL
      exercise: 'Bench Press',
      details: '3 sets of 10 reps at 135 lbs.',
    },
    {
      id: 2,
      user: 'Jane Smith',
      avatarUrl: 'https://via.placeholder.com/150',
      exercise: 'Deadlift',
      details: '4 sets of 8 reps at 225 lbs.',
    },
  ];

  // Open media picker to select an image or video
  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allows both images and videos
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setMediaUri(result.uri); // Set the URI of the selected media
      uploadMedia(result.uri); // Upload the media to Firebase
    }
  };

  // Upload media (image/video) to Firebase Storage
  const uploadMedia = async (uri) => {
    try {
      setUploading(true); // Set uploading status
      const response = await fetch(uri);
      const blob = await response.blob(); // Convert the file to a blob
      const filename = uri.substring(uri.lastIndexOf('/') + 1);

      // Create a reference in Firebase Storage
      const storageRef = ref(storage, `posts/${filename}`);

      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, blob);

      // Monitor the upload progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // You can add logic to track upload progress if needed
        },
        (error) => {
          console.error(error);
          setUploading(false);
        },
        async () => {
          // On success, get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
          setUploading(false); // Upload finished
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>fit</Text>
      {posts.map((post) => (
        <Card key={post.id} style={styles.card}>
          <Card.Title
            title={post.user}
            subtitle={post.exercise}
            left={(props) => <Avatar.Image {...props} source={{ uri: post.avatarUrl }} />}
          />
          <Card.Content>
            <Text>{post.details}</Text>
          </Card.Content>
        </Card>
      ))}

      {/* Button to select and upload media */}
      <Button
        mode="contained"
        onPress={pickMedia}
        style={styles.uploadButton}
        loading={uploading}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Post Picture or Video'}
      </Button>

      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
        Logout
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.2, // Shadow for iOS
    shadowRadius: 3, // Shadow for iOS
  },
  uploadButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff4b2b',
  },
});

export default HomeScreen;
