import clearAsyncStorage from '@react-native-async-storage/async-storage';

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared.');
  } catch (error) {
    console.error('Failed to clear AsyncStorage:', error);
  }
};

export default clearAsyncStorage;
