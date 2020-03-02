const iState = {
  userData: {
    name: "",
    email: "",
    address: "",
    password: "",
    gender: "",
    MobileNo: "",
    file: []
  },
  Allusers: [],
  random_no: ""
};

const reducer = (state = iState, action) => {
  var type_input_name = action.name;
  var type_input_val = action.value;

  switch (action.type) {
    case "UPDATE_INPUT":
      let userRef = Object.assign({}, state.userData);
      userRef[type_input_name] = type_input_val;
      return {
        ...state,
        userData: userRef
      };
    case "IMAGE_INPUT":
      let userRefdata = Object.assign({}, state.userData);
      userRefdata.file = action.payload;
      return {
        ...state,
        userData: userRefdata
      };
    case "GET_ALL_DETAILS":
      return {
        ...state,
        Allusers: action.payload
      };
    case "RESET_DETAILS":
      return {
        ...state,
        userData: iState.userData
      };
    case "ADD_USER":
      console.log("got it data", action.payload);
      return {
        ...state,
        Allusers: [...state.Allusers, action.payload]
      };

    case "DELETE_USER":
      let tempData = [...state.Allusers];
      console.log(tempData, "rkdkdkkdkdkdk");
      let get_data = tempData.filter(item => {
        return item._id !== action.payload;
      });

    case "GET_RANDOM":
        console.log('action data ', action)
      return {
        ...state,
        random_no: action.payload
      };   
      case "RANDOM_NUMBER_RECIEVED":
        return {
            ...state,
            random_no: action.payload
            };  
  }
  // return {
  //     ...state,
  //     Allusers:get_data
  // }
  return state;
};

export default reducer;
