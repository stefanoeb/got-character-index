import Duck from 'reduck';
import uniqBy from 'lodash.uniqby';
import SEARCH from '../redux/actions';

const initialState = {
  loading: false,
  error: '',
  items: [],
};

const duck = new Duck('characters', initialState);

export const search = duck.defineAction(SEARCH, {
  creator(searchString) {
    return {
      payload: { searchString },
      meta: {
        promise: {
          method: 'GET',
          url: '/characters/locations/' + searchString,
        },
      },
    };
  },
  reducer(state, { payload }) {
    return {
      ...state,
      loading: true,
    };
  },
  resolve(state, { payload }) {
    return {
      ...state,
      error: '',
      loading: false,
      items: uniqBy([
        ...state.items,
        ...payload.data.data.map(character => ({ name: character.name })),
      ], 'name'),
    };
  },
  reject(state, o) {
    return {
      ...state,
      loading: false,
      error: 'Oops, we got a network error 😔',
    };
  },
});

export default duck.reducer;
