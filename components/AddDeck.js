import React, { Component } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { saveDeckTitle } from '../utils/api';
import { red, black } from '../utils/colors';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addNewDeck } from '../actions';
import Button from './Button';

class AddDeckScreen extends Component {
  
  //Initializing component state in class constructor
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      textTooShort: false,
      textTooShortNote: "The deck name is too short!"
    };
  }

  //Handling form submission to create new deck
  createDeck = () => {
    const { title, textTooShort } = this.state;
    if (!textTooShort && title.trim().length > 1) {
      
      //Adding new deck card to local AsyncStorage DB
      saveDeckTitle(title);

      //Adding new deck to redux store to update app store state
      const deckObj = {
        [title]: {
          title: title,
          questions: []
        }
      };
      this.props.addNewDeck(deckObj);

      //Redirecting user to the Deck Details page
      this.props.navigation.navigate('DeckDetail', { deck: this.state.title });

       //updating component state
      this.setState({ title: '' });
    } else {

      this.handleChangeText(this.state.title)
    }
  }

  //Handling Input changes to validate form fields as user types
  handleChangeText = (value) => {
    let isShort = false;
    let textToShow = this.state.textTooShortNote;
    if (!(value.trim().length > 3)) {
      isShort = true;
      if (!(value.trim().length > 0)) {
        textToShow="The Deck Title is required"
      }
    }
    this.setState(() => ({ textTooShort: isShort, textTooShortNote: textToShow, title:value }))
  }

  render() {
    const { textTooShortNote, title, textTooShort } = this.state;
    return (
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View style={styles.container}>
          <TextInput
            underlineColorAndroid='#2962ff'
            style={styles.titleInput}
            onChangeText={value => this.handleChangeText(value)}
            value={title}
            placeholder="Deck Title"
            placeholderTextColor={black}
          />
          {textTooShort && <Text style={styles.error}>{textTooShortNote}</Text>}
          <View style={{ marginTop: 10, alignSelf: 'center' }}>
            <Button onPress={this.createDeck}><Text style={{ fontWeight: 'bold' }}>Create Deck</Text></Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
      
    );
  }
}

//setting up component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',

  },
  error: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: red,
    marginBottom:20
  },
  titleInput: {
    padding: 10,
    marginTop: 35,
    marginBottom: 0,
    fontSize: 17
  },
  buttonWrapper: {
    alignItems: "center"
  }
});

//binding redux action creators for app store updates
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addNewDeck }, dispatch);
}

export default connect(null, mapDispatchToProps)(AddDeckScreen);