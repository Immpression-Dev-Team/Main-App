import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { headerContainer, marginBottom20 } from '../styles/helper';

const imagePaths = [
    { path: require('../../assets/photos/path.jpg'), title: 'Path', profilePic: require('../../assets/artists/artist5.png'), width: 155 },
    { path: require('../../assets/photos/animal.jpg'), title: 'Animal', profilePic: require('../../assets/artists/artist4.png'), width: 150 },
    { path: require('../../assets/photos/sunset.jpg'), title: 'Sunset', profilePic: require('../../assets/artists/artist3.png'), width: 110 },
    { path: require('../../assets/photos/deer.jpg'), title: 'Deer', profilePic: require('../../assets/artists/artist1.png'), width: 90 },
    { path: require('../../assets/art/art1.jpg'), title: 'Art 1', profilePic: require('../../assets/artists/artist2.png'), width: 130 },
    { path: require('../../assets/art/art2.png'), title: 'Art 2', profilePic: require('../../assets/artists/artist6.png'), width: 115 },
    { path: require('../../assets/art/art3.png'), title: 'Art 3', profilePic: require('../../assets/artists/artist7.png'), width: 95 },
    { path: require('../../assets/art/art4.png'), title: 'Art 4', profilePic: require('../../assets/artists/artist8.png'), width: 170 },
    { path: require('../../assets/art/art5.png'), title: 'Art 5', profilePic: require('../../assets/artists/artist9.png'), width: 125 },
    { path: require('../../assets/art/art6.png'), title: 'Art 6', profilePic: require('../../assets/artists/artist10.png'), width: 100 },
    { path: require('../../assets/photos/building.jpg'), title: 'Building', profilePic: require('../../assets/artists/artist11.png'), width: 110 },
    { path: require('../../assets/photos/man.jpg'), title: 'Man', profilePic: require('../../assets/artists/artist12.png'), width: 105 },
    { path: require('../../assets/photos/hand.jpg'), title: 'Hand', profilePic: require('../../assets/artists/artist13.png'), width: 115 },
    { path: require('../../assets/photos/gray.jpg'), title: 'Gray', profilePic: require('../../assets/artists/artist14.png'), width: 120 },
    // Add more images and profile pictures if needed
];

const splitArrayInHalf = (arr) => {
    const middleIndex = Math.ceil(arr.length / 2);
    return [arr.slice(0, middleIndex), arr.slice(middleIndex)];
};

const [firstRow, secondRow] = splitArrayInHalf(imagePaths);

const DifferentWidths = () => {
    return (
        <View style={styles.section}>
            <View style={styles.headerContainer}>
                <View style={styles.leftHeader}>
                    <Text style={styles.header}>Art For You</Text>
                </View>
                <View style={styles.rightHeader}>
                    <Text style={styles.secondaryHeader}>More</Text>
                </View>
            </View>
            <ScrollView horizontal={true} style={styles.scrollView}>
                <View style={styles.scrollViewContent}>
                    <View style={styles.row}>
                        {firstRow.map((item, index) => (
                            <View key={index} style={styles.imageContainer}>
                                <Image source={item.path} style={[styles.image, { width: item.width }]} />
                            </View>
                        ))}
                    </View>
                    <View style={styles.row}>
                        {secondRow.map((item, index) => (
                            <View key={index} style={styles.imageContainer}>
                                <Image source={item.path} style={[styles.image, { width: item.width }]} />
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: marginBottom20,
        marginTop: 20,
    },

    headerContainer: headerContainer(5),
    leftHeader: {
        backgroundColor: 'gray',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 2,
        borderTopLeftRadius: 10,
    },
    rightHeader: {
        backgroundColor: '#B7C9E2',
        paddingVertical: 10,
        paddingHorizontal: 17,
        borderTopRightRadius: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 158,
    },
    secondaryHeader: {
        fontSize: 15,
        color: 'black',
    },
    scrollView: {
        flexDirection: 'row',
    },
    scrollViewContent: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 2, // Increased margin for better spacing
        marginBottom: 2, // Increased margin for better spacing
    },
    image: {
        height: 140, // Adjust the height to make images smaller
        resizeMode: 'cover',
        borderRadius: 2, // Added border radius for rounded corners
    },
});

export default DifferentWidths;
