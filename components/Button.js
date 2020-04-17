import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { white } from '../utils/colors';

//Setting up Generic Button template for use across the board
const Button = ({ children, onPress, style }) => (

  <TouchableOpacity onPress={onPress} >
    <Text style={[styles.button, style]}>
      {children}
    </Text>
  </TouchableOpacity>
);

//setting up component styles
const styles = StyleSheet.create({
 
  button: {
    padding: 10,
    paddingTop: 13,
    paddingBottom:13,
    margin: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 180,
    borderRadius: 5,
    color: white,
    textAlign: 'center',
    fontSize:16
  }
});

export default Button;
