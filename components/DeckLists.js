import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getAllDecks } from '../actions';
import DeckListItem from './DeckListItem';

class DeckListScreen extends Component {

  //Loading/pulling all available Decks from the local AsyncStorage and app redux store
  componentDidMount() {
    this.props.getAllDecks();
  }

  //Extracting item key for FlatList rendering
  _keyExtractor = (item, index) => (index.toString());

  //handling navigation routes to redirect user to the deck detail page
  navigateToDeck = (deck) => {
    this.props.navigation.navigate('DeckDetail', { deck });
  }

  render() {
    return (
      <FlatList 
        style={styles.deckList}
        data={Object.values(this.props.decks)}
        keyExtractor={this._keyExtractor}
        renderItem={({ item,index }) => (
          <DeckListItem 
            deck={item} 
            navigateToDeck={this.navigateToDeck} 
            itemIndex={index}
          />
        )}
      />
    );
  }
}

//setting up component styles
const styles = StyleSheet.create({
  deckList: {
    flex: 1,
    alignSelf: 'stretch',
    marginTop: 5,
    padding: 10
  }
});

//pulling required data from app redux store
function mapStateToProps(state) {
  return { decks: state };
}

//binding redux action creator for store updates
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getAllDecks }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckListScreen); 