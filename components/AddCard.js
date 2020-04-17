import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard  } from 'react-native';
import { addCardToDeck } from '../utils/api';
import { red, black } from '../utils/colors';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addNewCard } from '../actions';
import Button from './Button';

class AddCardScreen extends PureComponent {
 
  //Initializing component state in class constructor
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      answer: '',
      questionTooShort: false,
      questionTooShortNote: 'The question is too short!',
      answerTooShort: false,
      answerTooShortNote: 'The answer is too short!',
    };
  }

  //Handling form submission to create new deck card
  createCard = () => {
    const { question, answer, questionTooShort, answerTooShort } = this.state;

    if(!questionTooShort && !answerTooShort && question.trim().length>1 && answer.trim().length>1) {
      const cardObj = {
        question: this.state.question,
        answer: this.state.answer
      }
      const deckTitle = this.props.route.params.deckTitle;

      //Adding new deck card to local AsyncStorage DB
      addCardToDeck(deckTitle, cardObj);

      //Adding new deck card to redux store to update app store state
      this.props.addNewCard(deckTitle, cardObj);

      //updating component state
      this.setState({ 
        question: '',
        answer: ''
      });

      //Redirecting user to the Deck Details page
      this.props.navigation.navigate('DeckDetail', { deck: deckTitle });

    } else {

      this.handleChangeText(answer, 'answer');
      this.handleChangeText(question, 'question');
    }
  }

  //Handling Input changes to validate form fields as user types
  handleChangeText = (value, sourceInput) => {
    let isShort = false;
    let textTooShortField = '';
    let textTooShortNoteField = '';
    let textToShow = '';
    if (sourceInput && sourceInput === "question") {
      textToShow = this.state.questionTooShortNote;
      if (!(value.trim().length > 6)) {
        isShort = true;
        if (!(value.trim().length > 0)) {
          textToShow = "The Question field is required"
        }
      }
      textTooShortField = "questionTooShort";
      textTooShortNoteField = "questionTooShortNote";
    } else if (sourceInput && sourceInput === "answer") {
      
      textToShow = this.state.answerTooShortNote;
      if (!(value.trim().length > 1)) {
        isShort = true;
        if (!(value.trim().length > 0)) {
          textToShow = "The Answer field is required"
        }
      }
      textTooShortField = "answerTooShort";
      textTooShortNoteField = "answerTooShortNote";
    }
    if (sourceInput) {
      this.setState(() => ({ [textTooShortField]: isShort, [textTooShortNoteField]: textToShow,[sourceInput]:value}))
    }
  }

  render() {
    const { question, answer, questionTooShortNote, questionTooShort, answerTooShort, answerTooShortNote } = this.state;
    return (
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View style={styles.container}>
          <TextInput
            underlineColorAndroid='#2962ff'
            style={styles.input}
            onChangeText={question => this.handleChangeText(question, 'question')}
            value={question}
            placeholder="Question"
            placeholderTextColor={black}
          />
          {questionTooShort && <Text style={styles.error}>{questionTooShortNote}</Text>}

          <TextInput
            underlineColorAndroid='#2962ff'
            style={styles.input}
            onChangeText={answer => this.handleChangeText(answer,'answer')}
            value={answer}
            placeholder="Answer"
            placeholderTextColor={black}
          />
          {answerTooShort && <Text style={styles.error}>{answerTooShortNote}</Text>}

          <View style={{ marginTop: 10, alignSelf: 'center' }}>
            <Button onPress={this.createCard}><Text style={{ fontWeight: 'bold' }}>Create Card</Text></Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
      
    );
  }
}

//Setting up Component Styles
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
    marginBottom: 20
  },
  input: {
    padding: 10,
    marginTop: 15,
    marginBottom: 10,
    fontSize: 17
  },
  buttonWrapper: {
    alignItems: "center"
  }
});

//binding redux action creators for app store updates
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addNewCard }, dispatch);
}

export default connect(null, mapDispatchToProps)(AddCardScreen);