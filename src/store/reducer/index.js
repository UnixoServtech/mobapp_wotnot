import {combineReducers} from 'redux';
import global from './global';
import authReducer from './authReducer';
import detail from './detail';
import accountReducer from './accountReducer';
import qualifications from './qualifications';

const rootReducer = combineReducers({
  global,
  authReducer,
  detail,
  accountReducer,
  qualifications
});

export default rootReducer;
