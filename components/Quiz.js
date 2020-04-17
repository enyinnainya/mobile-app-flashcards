import React, { PureComponent } from 'react';
import { 
  View, 
  Text, 
  TouchableWithoutFeedback,
  AsyncStorage,Animated, 
  StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { blueDark, blueLight, white } from '../utils/colors';
import { setLocalNotification, clearLocalNotification } from '../utils/notifications';
import Button from './Button';
import LightButton from './LightButton';

//setting up view for when there are no cards in deck
const NoCards = () => (
  <View style={styles.noCards}>
    <Text style={styles.noCardsText}>Sorry, you cannot take a quiz because there are no cards in the deck.</Text>
  </View>
);

//setting up view for Result after user completes the quiz
const ResultScreen = (props) => (
  <View style={styles.resultCard}>
    <Text style={styles.resultCardText}>Total Questions Answered: {props.totalAnswered}</Text>
    <Text style={styles.resultCardText}>Correct Answers: {props.correct}</Text>
    <View style={{marginTop:50}}>
      <LightButton onPress={props.restart}><Text style={{ fontWeight: 'bold' }}>Restart</Text></LightButton>
    </View>
    <View style={{ marginTop: 10 }}>
      <Button onPress={props.goBack}><Text style={{ fontWeight: 'bold' }}>Go Back</Text></Button>
    </View>
  </View>
);

//setting up view to render show answer/question button
const ShowQuestionOrAnswerView = (props) => (
  <TouchableWithoutFeedback onPress={props.toggle}>
    <View style={styles.showText} >
      {
        props.current == 'question'
          ? <Text style={styles.showText}>Show Answer</Text>
          : <Text style={styles.showText}>Show Question</Text>
      }
    </View>
  </TouchableWithoutFeedback>
)

class Quiz extends PureComponent {

//handling user selection on whether to show deck question or answer and flipping the card back to question view afterwards if user opts to show answer
  showQuestionOrAnswer = () => {
    const show = (this.state.show) === 'question'
      ? 'answer'
      : 'question'
  
    this.setState({ show });

    //Flipping card
    this.flipCard();
  }
  
  //handling user quiz selections
  userAnswered(answer) {
    if (answer === 'correct') {
      this.setState({ correctAnswers: this.state.correctAnswers + 1});
    }
    
    if (this.state.currentQuestion === this.props.questions.length - 1) {
      this.setState({ showResults: true });
    } else {
      this.setState({ currentQuestion: this.state.currentQuestion + 1 });
    }

    if (this.state.show === "answer") {
      this.setState({ show: 'question' });
      this.flipCard();
    }


  }

  //handling option to restart Quiz after users completed the user
  restartQuiz = () => {
 
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => { this.value = value })
    
    //updating component state
    this.setState({
      currentQuestion: 0,
      correctAnswers: 0,
      show: 'question',
      showResults: false
    });

    //CLearing and setting up Local notification for app to remind user to study for that day
    clearLocalNotification()
      .then(setLocalNotification)
    
  }

  //handling request to go back to previous screen
  goBack = () => {
    this.props.navigation.goBack();
  }

  //setting up component state in class constructor
  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => { this.value = value })
    this.state = {
      currentQuestion: 0,
      correctAnswers: 0,
      show: 'question',
      showResults: false
      
    }

  }

  //Handling Front view for flipping card box
  frontCardStyle() {
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg']
    })

    const frontAnimatedStyle = {
      transform: [{ rotateY: this.frontInterpolate }]
    }

    return frontAnimatedStyle
  }

  //Handling Back view for flipping card box
  backCardStyle() {
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg']
    })

    const backAnimatedStyle = { transform: [{ rotateY: this.backInterpolate }] }
    return backAnimatedStyle
  }

  //Handling event to Flip card box
  flipCard() {
    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10
      }).start();
    } else if (this.value < 90) {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10
      }).start();
    }
  }

  render() {

    if (this.props.questions.length === 0) {
      return <NoCards />
    }

    if (this.state.showResults) {
      return (
        <ResultScreen
          totalAnswered={this.props.questions.length}
          correct={this.state.correctAnswers}
          restart={this.restartQuiz}
          goBack={this.goBack}
        />
      );
    }
    
    const showingCard = this.props.questions[this.state.currentQuestion];
 
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.quizProgress} >
          <Text style={{fontWeight:'bold',fontSize:16,color:white}}>Card {this.state.currentQuestion + 1}/{this.props.questions.length}</Text>
        </View>

        {/* Card Front view showing the question which will be flipped */}
        <Animated.View style={[styles.quizCard, this.frontCardStyle(), { display: (this.state.show === "question" ? 'flex' : 'none') }]}>
          {
            this.state.show == 'question'
              ? <Text style={styles.questionText}>{showingCard.question}</Text>
              : <Text style={styles.answerText}>{showingCard.answer}</Text>
          }
          <ShowQuestionOrAnswerView
            toggle={this.showQuestionOrAnswer}
            current={this.state.show}
          />
          <View>
            <View>
              <LightButton onPress={() => this.userAnswered('correct')}><Text style={{ fontWeight: 'bold' }}>Correct</Text></LightButton>
            </View>
            <View style={{ marginTop: 10 }}>
              <Button onPress={() => this.userAnswered('incorrect')}><Text style={{ fontWeight: 'bold' }}>Incorrect</Text></Button>
            </View>
           
          </View>
        </Animated.View>

        {/* Card Back view showing the answer which will be flipped */}
        <Animated.View style={[styles.quizCard, this.backCardStyle(), styles.flipCardBack, { display: (this.state.show==="answer"?'flex':'none')}]}>
          {
            this.state.show == 'question'
              ? <Text style={styles.questionText}>{showingCard.question}</Text>
              : <Text style={styles.answerText}>{showingCard.answer}</Text>
          }
          <ShowQuestionOrAnswerView
            toggle={this.showQuestionOrAnswer}
            current={this.state.show}
          />
         
          <View>
            <View>
              <LightButton onPress={() => this.userAnswered('correct')}><Text style={{ fontWeight: 'bold' }}>Correct</Text></LightButton>
            </View>
            <View style={{ marginTop: 10 }}>
              <Button onPress={() => this.userAnswered('incorrect')}><Text style={{ fontWeight: 'bold' }}>Incorrect</Text></Button>
            </View>

          </View>
        </Animated.View>
      </View>
    );
  }
}

//setting up component styles
const styles = StyleSheet.create({
  noCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 25,
    marginTop: 40,
    marginBottom: 40,
    padding: 25,
    borderRadius: 10,
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
  noCardsText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  resultCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 25,
    marginTop: 60,
    marginBottom: 60,
    padding: 25,
    borderRadius: 10,
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
  resultCardText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  quizProgress: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    marginTop: 10,
    color:white
  },
  quizCard: {
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 25,
    flex:1,
    marginTop: 40,
    marginBottom:40,
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
    },
  },
  questionText: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  answerText: {
    fontSize: 26,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: blueDark
  },
  showText: {
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.6)',

  },

  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  flipCardBack: {
    position: "relative",
    top: 0,
  },
});

//pulling required data from app redux store
function mapStateToProps(state, ownProps) {
  return { questions: state[ownProps.route.params.deckTitle].questions };
}

export default connect(mapStateToProps)(Quiz);