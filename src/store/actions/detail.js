import types from './types';
import {API} from '../../apiService';
import {endPoints} from '../../constants/urls';
import {loadingSet, loadingUnset, userDetail, setLabelData, setUserPreference} from './global';
const defaultHeaders = {
  'Content-Type': 'application/json',
};

export const fetchLabel = (userID, {SuccessCallback, FailureCallback}) => {
  return dispatch => {
    dispatch(loadingSet());
    API.getInstance().Fetch(endPoints.fetchLabel(userID), defaultHeaders, "", {
      SuccessCallback: response => {
        dispatch(loadingUnset());
        dispatch(setLabelData(response?.labels));
        SuccessCallback(response);
      },
      FailureCallback: response => {
        dispatch(loadingUnset());
        FailureCallback(response);
      },
    });
  };
};

export const fetchUserPreference = (param, {SuccessCallback, FailureCallback}) => {
  return dispatch => {
    dispatch(loadingSet());
    API.getInstance().Fetch(endPoints.fetchUserPreference, defaultHeaders, param, {
      SuccessCallback: response => {
        dispatch(loadingUnset());
        dispatch(setUserPreference(response));
        SuccessCallback(response);
      },
      FailureCallback: response => {
        dispatch(loadingUnset());
        FailureCallback(response);
      },
    });
  };
};