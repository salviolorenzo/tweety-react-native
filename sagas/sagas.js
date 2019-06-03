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

const watchPostTweet = function* watchPostTweet() {
  yield takeEvery("POST_TWEET", function* (action) {
    if(action.payload.tweetContent) {
      yield put({type: "POST_TWEET_STARTED"});
      try {
        yield call(postTweet.bind(this, action.payload));
        yield put({type: "POST_TWEET_SUCCESS"});
        yield put({type: "FETCH_TWEETS"});
      } catch (error) {
        yield put({type: "POST_TWEET_FAILED"});
      }
    } else {
      yield put({type: "POST_TWEET_FAILED"})
    }
  })
}

const watchFetchTweetReplies = function* watchFetchTweetReplies() {
  yield takeEvery("FETCH_TWEET_REPLIES", fetchTweetReplies)
}

const fetchTweetReplies = function* fetchTweetReplies(){
  yield put({type: "FETCH_TWEETS_REPLIED_STARTED"});
  try {
    const tweetReplies = yield call(fetchTweetRepliesData);
    yield put({type: "FETCH_TWEET_REPLIES_FULFILLED", payload: tweetReplies});
  } catch (error) {
    yield put({type: "FETCH_TWEET_REPLIES_REJECTED", payload: error});
  }
};

const rootSaga = function* rootSaga() {
  console.log("into root saga");
  yield all([
    watchFetchTweets(),
    watchFetchUserTweets(),
    watchSetUsername(),
    watchSetPassword(),
    watchLogin(),
    watchPostTweet(),
    watchFetchTweetReplies()
  ]);
};

export default rootSaga;

const fetchTweetsData = () => {
  return fetch("http:///localhost:3000//tweetReplies").then(response => {
    console.log(response);
    return response.data;
  })
}

const fetchUserTweetsData = () => {
  return fetch("http://localhost:3000/userTweets").then(response => {
    console.log(response);
    return response.data;
  });
};

const attemptLogin = () => {
  return fetch("http://localhost:3000/login").then(response => {
    return response.data;
  });
};

const postTweet = payload => {
  fetch('http://localhost:3000/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: faker.random.number(100000),
        time: new Date().toISOString(),
        user: payload.user,
        tweetContent: payload.tweetContent,
        likes: 0,
        retweets: 0,
        replies: 0
      })
    })
      .then(response => {
        return response;
      })
  
};


