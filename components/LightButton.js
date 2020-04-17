import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { black } from '../utils/colors';

//Setting up Generic Light Button template for use across the board
const LightButton = ({ children, onPress, style }) => (

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
        paddingBottom: 13,
        margin: 5,
        backgroundColor: 'rgba(255,255,255,0.8)',
        width: 180,
        borderRadius: 5,
        color: black,
        textAlign: 'center',
        fontSize: 16,
        borderColor: 'rgba(0,0,0,0.8)',
        borderStyle: 'solid',
        borderWidth: 2
    }
});

export default LightButton;