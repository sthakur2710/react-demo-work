import React, { Component } from 'react';
import axios from 'axios';
import Auth from '../auth'
import { withRouter } from "react-router-dom";
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import 'react-toastify/dist/ReactToastify.css';

class EditComponent extends Component {
    constructor(props) {
      super(props)
      var get_id=localStorage.getItem("edit_id")
      if(get_id !=='')
      {
        this.get_user_details(get_id)
      }
      this.state = {
        id:'',
        name:'',
        email:'',
        address:'',
        gender:'',
        MobileNo:'',
        file:[]
      };
    };

    get_user_details=(id)=> {
        axios.get(`http://localhost:5000/find_one/` + id)
        .then(res => {
          

          this.setState({
            id:id,
            name:res.data.name,
            email:res.data.email,
            address:res.data.address,
            gender:res.data.gender,
            MobileNo:res.data.MobileNo,
        })
        })
    }
    
    handleSubmit=(e)=> { 
      e.preventDefault()
      let formData = new FormData();    //formdata object
      formData.append('name', this.state.name);   //append the values with key, value pair
      formData.append('gender', this.state.gender);   //append the values with key, value pair
      formData.append('address', this.state.address);   //append the values with key, value pair
      formData.append('MobileNo', this.state.MobileNo);   //append the values with key, value pair
      formData.append('file', this.state.file);   //append the values with key, value pair
     console.log('form data now ', formData)
      axios.put(`http://localhost:5000/update_user/` + this.state.id ,formData)
        .then(res => {
            console.log('edit done', res)

            ToastsStore.success('User updated successfully');

            // this.props.resetUserForm();
            // this.setState({
            //     value:''
            // })
            // this.props.addUserData(res.data);
            Auth.authenticate();


            setTimeout(()=> {
              this.props.history.push('/manage_users')

             }, 2000)
            //this.props.history.push("/manage_users");

            //const persons = res.data;
            //this.setState({ persons });
        })
    }
  render() {
    return (  
        <div className="row">
            {JSON.stringify(this.state)}
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT}/>

          <form className="col s12" onSubmit={this.handleSubmit}>
            <div className="row"> 
                <div className="input-field col s12">{JSON.stringify(this.state.userData)}
                    <input placeholder="Placeholder" id="name" name="name" onChange={(e)=>this.setState({'name':e.target.value})} value={this.state.name} type="text" className="validate"/>
                    <label for="first_name">Name</label>
                </div>
            </div>  
            
            <div className="row">
            <div className="input-field col s2">
                <div className="row">
                <label>
                    <input className="with-gap" name="gender" onChange={(e)=>this.setState({'gender':e.target.value})} checked={'Male'===this.state.gender} value="Male" type="radio"  />
                    <span>Male</span>
                </label>
                <label>
                    <input className="with-gap" checked={'female'===this.state.gender} name="gender" onChange={(e)=>this.setState({'gender':e.target.value})} value="female" type="radio"  />
                    <span>FeMale</span>
                </label>
                </div>
               
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input id="address" name="address" onChange={(e)=>this.setState({'address':e.target.value})} type="text" value={this.state.address} className="validate"/>
                    <label for="password">Address</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input id="MobileNo" type="text" name="MobileNo" onChange={(e)=>this.setState({'MobileNo':e.target.value})} value={this.state.MobileNo} className="validate"/>
                    <label for="password">MobileNo</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s3">
                    <input id="file" type="file"  name="file" onChange={(e)=>this.setState({'file': e.target.files[0]})} name="file" className="validate"/>
                </div>
            </div>
            <div className="row">
            <div className="input-field col s12">
                <button type="submit" name="submit" className="waves-effect waves-light btn">Update</button>
            </div>
            </div>
        </form>  
      </div>
    );
  }
}

// const mapStateToProps = (state)=> {
//   return {
//       userData:state.userData
//   }
// }

// const mapDispatchToProps = (dispatch)=> {
//   return {
//     handleInput:(input)=>{
//       dispatch(handleInputAction(input))
//     }
//   }
// }
export default withRouter(EditComponent);
