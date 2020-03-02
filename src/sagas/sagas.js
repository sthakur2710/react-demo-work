import { call, put, takeEvery, takeLatest, all } from "redux-saga/effects";
import axios from "axios";

function* FetchRandomNumber() {
  console.log("now to go for saaga");

  const json = yield axios
    .get(`http://localhost:5000/get_random_no`)
    .then(res => res.data.temp_no);
  yield put({ type: "RANDOM_NUMBER_RECIEVED", payload: json });  
}

function* actionWatcher() {
  console.log("====================================");
  console.log("now to go for saaga");

  yield takeLatest("GET_RANDOM", FetchRandomNumber);
}

export default function* rootSaga() {
    console.log('saga is running now')
    yield all([
    actionWatcher(),
    ]);
 }