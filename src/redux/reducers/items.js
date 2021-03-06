const items = (state = { items: {} }, action) => {
  switch (action.type) {
    case 'ADD_ITEMS':
      return { ...state, items: action.payload };

    default:
      return state;
  }
};

export default items;
