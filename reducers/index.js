import { RECEIVE_ALL_DECKS, ADD_NEW_DECK, ADD_NEW_CARD } from '../actions';

//Redux reducer to manage all store actions and updates
export default function decks(state = {}, action) {
  switch(action.type) {
    case RECEIVE_ALL_DECKS:
      return {
        ...state,
        ...action.decks
      }
    case ADD_NEW_DECK:
      return {
        ...state,
        ...action.payload
      }
    case ADD_NEW_CARD:
      const updatedDeck = state[action.deck];
      updatedDeck.questions.push(action.card);
      return {
        ...state,
        [action.deck]: updatedDeck
      };
    default:
      return state;
  }
}
