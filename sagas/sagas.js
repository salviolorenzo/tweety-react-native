import { put, takeEvery, all, call } from 'redux-saga/effects';
import fetch from 'fetch';
import faker from 'faker';
import console = require('console');

const fetchTweets = function* fetchTweets(){
  console.log("fetching tweets");
  yield put({type: "FETCH_TWEETS_STARTED"});
  try {
    const tweets = yield call(fetchTweetsData);
    yield put({type: "FETCH_TWEETS_FULFILLED", payload: tweets});
    
  } catch (error) {
    yield put({type: "FETCH_TWEETS_REJECTED", payload: error});
  }
};

const watchFetchTweets = function* watchFetchTweets() {
  yield takeEvery("FETCH_TWEETS", fetchTweets);
};

const fetchUserTweets = function* fetchUserTweets(){
  yield put({type: "FETCH_USER_TWEETS_STARTED"});
  try {
    const tweets = yield call(fetchUserTweetsData);
    yield put({type: "FETCH_USER_TWEETS_FULFILLED", payload: tweets});
  } catch (error) {
    yield put({type: "FETCH_USER_TWEETS_REJECTED", payload: error});
  }
};

const watchFetchUserTweets = function* fetchUserTweetsData(){
  yield takeEvery("FETCH_USER_TWEETS", fetchUserTweets);
};

const setUsername = function* setUsername(action){
  yield put({type: "SET_USERNAME_STARTED", payload: action.payload});
};

const watchSetUsername = function* watchSetUsername(){
  yield takeEvery("SET_USERNAME", setUsername);
};

const setPassword = function* setPassword(action){
  yield put({type: "SET_PASSWORD_STARTED", payload: action.payload});
};

const watchSetPassword = function* watchSetPassword(){
  yield takeEvery("SET_PASSWORD", setUsername);
};

const watchLogin = function* watchLogin(){
  yield takeEvery("DO_LOGIN", function*(action){
    yield put({type: "DO_LOGIN_STARTED"});
    try {
      const loginData = yield call(attemptLogin);
      if (
        loginData.username === action.payload.username && loginData.password === action.payload.login
      ){
        yield put({type: "DO_LOGIN_SUCCESS", payload: loginData});
      } else {
        yield put({type: "DO_LOGIN_FAILED"});
      }
    } catch (error) {
      yield put({type: "DO_LOGIN_FAILED"})
    }
  })
}



