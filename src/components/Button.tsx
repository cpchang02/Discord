import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';

const Button = ({ title = "Button", onPress = () => {}, thing = "" }) => {
  console.log(thing);
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {thing && <Image source={{ uri: thing }} style={styles.image} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {

    padding: 5,
    flex: 0,
    width: 50

  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 15,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
});

export default Button;
