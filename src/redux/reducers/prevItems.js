const prevItems = (state = {}, action) => {
  switch (action.type) {
    case 'SET_SORT':
      return { ...state, prevItems: action.payload };

    default:
      return state;
  }
};

export default prevItems;
