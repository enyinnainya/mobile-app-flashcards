import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Button from './Button';
import LightButton from './LightButton';

class IndividualDeckScreen extends Component {

  //handling user navigation routes
  navigate = (screen) => {
    this.props.navigation.navigate(screen, {
      deckTitle: this.props.deck.title
    })
  }

  //updating Nav Tab screen title
  updateScreenTitle = ({ deck, navigation }) => {
    return navigation.setOptions({ title: deck.title })
  }

  //initializing class constructor to update the Nav tab screen title
  constructor(props) {
    super(props);
    this.updateScreenTitle(this.props);
  }
  
  render() {
    const deck = this.props.deck;
    return (
      <View style={styles.deckCard}>
        <View>
          <Text style={styles.deckTitle}>{deck.title}</Text>
          <Text style={styles.cardNumber}>{deck.questions.length} Cards</Text>
        </View>
        <View>
          <View>
            <LightButton onPress={() => this.navigate('AddCard')}><Text style={{ fontWeight: 'bold' }}>Add Card</Text></LightButton>
          </View>
          <View style={{marginTop:10}}>
            <Button onPress={() => this.navigate('Quiz')}><Text style={{ fontWeight: 'bold' }}>Start Quiz</Text></Button>
          </View>
        </View>
      </View>
    );
  }
}

//setting up component styles
const styles = StyleSheet.create({
  deckCard: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 25,
    marginTop: 60,
    marginBottom:60,
    padding: 25,
    borderRadius:10,
    backgroundColor: 'rgba(255,255,255,1)',
    elevation: 25,
    shadowRadius: 3,
    shadowOpacity: 0.95,
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowOffset: {
      width: 0,
      height: 3
    } 
  },
  deckTitle: {
    fontSize: 23,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  cardNumber: {
    fontSize: 15,
    textAlign: 'center'
  }
});

//pulling required data from app redux store
function mapStateToProps(state, ownProps) {
  return { deck: state[ownProps.route.params.deck] };
}

export default connect(mapStateToProps)(IndividualDeckScreen);