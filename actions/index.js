import { getDecks } from '../utils/api';

export const RECEIVE_ALL_DECKS = 'RECEIVE_ALL_DECKS';
export const ADD_NEW_DECK = 'ADD_NEW_DECK';
export const ADD_NEW_CARD = 'ADD_NEW_CARD';

//Redux thunk action creator get all decks from AsyncStorage and add to redux store
export function getAllDecks() {
  return (dispatch) => {
    getDecks()
      .then((decks) => {
        dispatch({
          type: RECEIVE_ALL_DECKS, 
          decks
        })
      })
  }
}

//Redux action creator to add new deck
export function addNewDeck(deck) {
  return {
    type: ADD_NEW_DECK,
    payload: deck
  }
}

//Redux action creator to add new card
export function addNewCard(deck, card) {
  return {
    type: ADD_NEW_CARD,
    deck,
    card
  }
}

