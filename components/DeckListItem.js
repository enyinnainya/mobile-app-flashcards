import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { blue, blueHighlight, white } from '../utils/colors';
import Button from './Button';

class DeckListItem extends Component {

  render() {
    const { itemIndex, deck } = this.props;
    return (
      
      <View style={[styles.deckItem, { marginTop: (parseInt(itemIndex) === 0) ? 20 : 0 }]}>
          <View>
          <Text style={styles.deckTitle}>{deck.title}</Text>
            <Text style={styles.cardNumber}>{deck.questions.length} Cards</Text>
          </View>
          <View style={{marginTop:20}}>
            <Button onPress={() => this.props.navigateToDeck(deck.title)}><Text style={{ fontWeight: 'bold' }}>View Deck</Text></Button>
          </View>
          
        </View>
    );
  }
}

//setting up component styles
const styles = StyleSheet.create({
  deckItem: {
    backgroundColor: white,
    borderRadius: 10,
    padding: 20,
    paddingBottom:25,
    marginBottom: 30,
    marginLeft: 10,
    marginRight:10,
    justifyContent: 'center',
    alignItems:'center',
    shadowRadius: 3,
    shadowOpacity: 0.95,
    elevation: 25,
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowOffset: {
      width: 0,
      height: 3
    } 
  },
  deckTitle: {
    marginBottom: 8,
    fontSize: 24,
    color: '#222',
    fontWeight: "bold",
    textAlign:'center'
  },
  cardNumber: {
    color: blueHighlight,
    fontSize: 17,
    paddingTop:0,
    color: '#333',
    textAlign: 'center'
  }
});

export default DeckListItem;