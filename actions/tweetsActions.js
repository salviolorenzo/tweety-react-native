import { fetch } from 'fetch';
import { connect } from 'react-redux';

export function fetchTweets() {
  return function(dispatch) {
    dispatch({ type: 'FETCH_TWEETS' });
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        dispatch({
          type: 'FETCH_TWEETS_FULFILLED',
          payload: response.data
        });
      })
      .catch(err => {
        dispatch({ type: 'FETCH_TWEETS_REJECTED', payload: err });
      });
  };
}
