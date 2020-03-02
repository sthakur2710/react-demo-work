import React, { Component } from 'react';
import { connect } from "react-redux";
import {GetRandomNo} from '../myactions/action'
import socketIOClient from "socket.io-client";

class RandomNumber extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      response: false,  
      endpoint: "http://localhost:5000"
    };
  };
  

  componentDidMount()
  {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    // socket.on("FromAPI", data => 
    // // console.log('socket on hua ', data)
    // this.setState({ response: data })
    // );
  //   socket.on('error', function (err) {
  //     console.log('socket on detials',err);
  // });
    console.log('socket check', socket)

      this.props.GetRandomNo()
  }
    
  render() {
    const { response } = this.state;
    return (
      <div>   data{response}
        <table>
          <tr>  
            <th>Random No</th>
          </tr>
          <tr className="App">
            <td>{this.props.random_no}</td>
          </tr>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
    random_no: state.random_no
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        GetRandomNo: () => {
        dispatch(GetRandomNo());
      },
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(RandomNumber);



  
// function RandomNumber() {
//     const [count,setCount]=useState(0)

//     useEffect(() => {
//         // Update the document title using the browser API
//         setInterval(()=> {
//             get_details()
//         }, 5000)   
//       },[]);

//       const get_details = ()=> {
//         axios.get(`http://localhost:5000/get_random_no`)
//         .then(res => {
//             setCount(res.data.temp_no)
//             console.log(res.data.temp_no,'temp no')
    
//         })
//       }

//     return (
//         <div>
//             <table>
//                 <tr>
//                 <th>Update value</th>
//                 </tr>
//                 <tr>
//                     <td className="App">{count}</td>
//                 </tr>
//             </table>
//         </div>
//     )
// }

// export default RandomNumber
