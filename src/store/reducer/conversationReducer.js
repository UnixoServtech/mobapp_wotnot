import {types} from '../actions';

const initialState = {
  conversations: [],
  conversation_summary: {
    open_status: {
      you: 0,
      assigned: 0,
      unassigned: 0,
    },
  },
  filterConversations: [],
};

const global = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_CONVERSATIONS:
      return {...state, conversations: action.payload};
    case types.SET_CONVERSATIONS_COUNT:
      return {...state, conversation_summary: action.payload};
    case types.FILTER_DATA:
      return {...state, filterConversations: action.payload};
    case types.USER_LOGOUT:
      return {...initialState};
    default:
      return state;
  }
};

export default global;
