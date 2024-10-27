import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import DropDownPicker from "react-native-dropdown-picker";
import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";
import { useAuth } from "../state/AuthProvider";
import { uploadImage } from "../API/API";
import { Platform } from 'react-native';



const Upload = () => {
  const { userData } = useAuth();  // Retrieve userData from AuthProvider, including token
  console.log(userData?.user?._id);  // Log user ID to verify

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Photography", value: "photography" },
    { label: "Graphic Design", value: "graphic design" },
    { label: "Sketches", value: "sketches" },
    { label: "Sculptures", value: "sculptures" },
    { label: "Paintings", value: "paintings" },
    { label: "Pottery", value: "pottery" },
  ]);

  const selectImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false
    });

    console.log("Picker Result:", pickerResult);

    if (!pickerResult.canceled) {
      const selectedImage = pickerResult.assets[0];
      const resizedImage = await ImageManipulator.manipulateAsync(
        selectedImage.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage({ ...selectedImage, uri: resizedImage.uri });
    }
  };

  const handleUpload = async () => {
    if (!image || !title || !description || !price || !category) {
      Alert.alert("Error", "Please fill in all fields, select a category, and select an image");
      return;
    }
  
    if (description.length > 30) {
      Alert.alert("Error", "Description cannot be longer than 30 characters");
      return;
    }
  
    const data = new FormData();
  
    try {
      if (Platform.OS === 'web') {
        // Web-specific logic: Convert base64 to Blob for web uploads
        const base64String = image.uri.split(',')[1];
        const imageBlob = base64ToBlob(base64String, 'image/jpeg');
        data.append("file", imageBlob, "upload_image.jpg");
      } else {
        // Mobile-specific logic: Directly append image URI
        data.append("file", {
          uri: image.uri, // Use the URI directly for mobile
          name: title, // Filename (Cloudinary expects a filename)
          type: 'image/jpeg' // Adjust based on the image format (e.g., 'image/png' if PNG)
        });
      }
  
      data.append("upload_preset", "edevre");
      data.append("name", title);
      data.append("public_id", title.replace(/\s+/g, "_"));
      data.append("description", description);
      data.append("price", price);
      data.append("category", category);
      data.append('folder', 'artwork');
  
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dttomxwev/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
  
      const result = await response.json();
  
      if (result.secure_url) {
        const imageData = {
          userId: userData.user.user._id,
          artistName: userData.user.user.name,
          name: title,
          imageLink: result.secure_url,
          price: price,
          description: description,
        };
  
        const token = userData.token;
        await uploadImage(imageData, token);
  
        setImage(null);
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory(null);
        Alert.alert("Success", "Image uploaded successfully!");
      } else {
        Alert.alert("Error", result.error.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Error", "An error occurred while uploading the image");
    }
  };
  

  const renderContent = () => (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/UploadSample.png")}
          style={styles.exampleImage}
        />
        <View style={styles.imagePlaceholderContainer}>
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={selectImage}
          >
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholderText}>Upload Image</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <DropDownPicker
        open={open}
        value={category}
        items={items}
        setOpen={setOpen}
        setValue={setCategory}
        setItems={setItems}
        placeholder="Category"
        style={styles.dropdown}
        listMode="SCROLLVIEW"
        dropDownContainerStyle={{
          maxHeight: 150,
        }}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadButtonText}>
        Upload
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.everything}>
       <ImageBackground
          source={require("../assets/backgrounds/navbar_bg_blue.png")} // Replace with your image path
          style={styles.navbarBackgroundImage}
        >
          <Navbar />
        </ImageBackground>
      
        <FlatList
          data={[{}]} // Use a FlatList with a single element to render the form
          renderItem={renderContent}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.scrollContainer}
        />
      
      <FooterNavbar style={styles.footer} />
    </View>
  );
};

const styles = StyleSheet.create({
  everything: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white"
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    backgroundColor: "white"
    
  },
  imagePlaceholderContainer: {
    flex: 1,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#5f669c",
    borderStyle: "dotted",
    borderRadius: 2,
    backgroundColor: "white"

  },
  imagePlaceholderText: {
    color: "#7c809c",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "white"
  },
  exampleImage: {
    width: "50%",
    height: 250,
    resizeMode: "stretch",
    marginRight: 0,
    backgroundColor: "white"
  },
  input: {
    height: 38,
    borderColor: "blue",
    backgroundColor: "white",
    borderWidth: 2,
    marginVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  dropdown: {
    borderColor: "blue",
    borderWidth: 1,
    borderRadius: 2,
    marginVertical: 4,
    backgroundColor: "white",
    borderStyle: "solid",
    borderWeight: "2"
  },
  uploadButton: {
    height: 40,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginTop: 16,

    
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",

   
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white"
  },
});

export default Upload;

// Helper function to convert base64 to Blob
const base64ToBlob = (base64Data, contentType = 'image/jpeg') => {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];


  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

