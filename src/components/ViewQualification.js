import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

class ViewQualification extends Component {
    constructor(props) {
      super(props)
      var get_id=localStorage.getItem("edit_id")
      this.state = {
          id:get_id,
         qualification_data:[]
      };
      this.getDetails_qualification()
    };

    getDetails_qualification=()=> {
        axios.get(`http://localhost:5000/get_qualification/` + this.state.id)
        .then(res => {
            // console.log('find done', res.data)
            //const persons = res.data;
            //this.setState({ persons });
            //this.props.GetDetails(res.data);
            if(res.data !== '')
            {
              this.setState({
                qualification_data:res.data.qualification_details
            })
            }
            else
            {
              
            }
            
        })
      }
    
  render() {
      
    return (
  <div class="collection">
          {/* {JSON.stringify(this.state)}  */}
            <ul>
                {
                    this.state.qualification_data.map((item,j)=> (
                        <li class="collection-item">{item.qualification_name} ({item.year})</li>
                    ))
                }
                </ul>
                <Link to='/manage_users'>Back</Link>
      </div>
    );
  }
}

export default ViewQualification;
