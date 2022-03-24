import { combineReducers } from 'redux';

import items from './items';
import prevItems from './prevItems';

const rootReducer = combineReducers({
  items,
  prevItems,
});

export default rootReducer;
