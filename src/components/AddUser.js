import React, { Component } from 'react';
import {connect} from 'react-redux';
import {handleInputAction,handleInputfileAction,resetUserForm,addUserData} from '../myactions/action';
import axios from 'axios';
class AddUser extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         value:''
      };
    };
    
    
    handleSubmit = (e)=> {
        e.preventDefault()
        console.log(this.props.userData)
        let formData = new FormData();    //formdata object
        formData.append('name', this.props.userData.name);   //append the values with key, value pair
        formData.append('email', this.props.userData.email);   //append the values with key, value pair
        formData.append('password', this.props.userData.password);   //append the values with key, value pair
        formData.append('gender', this.props.userData.gender);   //append the values with key, value pair
        formData.append('address', this.props.userData.address);   //append the values with key, value pair
        formData.append('MobileNo', this.props.userData.MobileNo);   //append the values with key, value pair
        formData.append('file', this.props.userData.file);   //append the values with key, value pair

        axios.post(`http://localhost:5000/create`,formData)
        .then(res => {
            console.log('submit done', res)
            this.props.resetUserForm();
            this.setState({
                value:''
            })
            this.props.addUserData(res.data);
           

            //const persons = res.data;
            //this.setState({ persons });
        })
        console.log('data get')
    }
  render() {    
    //   console.log('porps data', this.props)
    return ( 
      <div className="row">
        <form className="col s12" onSubmit={this.handleSubmit}>
            <div className="row"> 
                <div className="input-field col s12">
                    <input placeholder="Placeholder" id="name" name="name" onChange={(e)=>this.props.handleInput(e.target)} value={this.props.userData.name} type="text" className="validate"/>
                    <label for="first_name">Name</label>
                </div>
            </div>  
            <div className="row">
                <div className="input-field col s12">
                <input id="email" type="email" name="email" value={this.props.userData.email} onChange={(e)=>this.props.handleInput(e.target)} className="validate"/>
                <label for="email">Email</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                <input id="password" name="password" type="password" onChange={(e)=>this.props.handleInput(e.target)} value={this.props.userData.password} className="validate"/>
                <label for="password">Password</label>
                </div>
            </div>
            <div className="row">
            <div className="input-field col s2">
                <div className="row">
                <label>
                    <input className="with-gap" name="gender" onChange={(e)=>this.props.handleInput(e.target)} value="Male" type="radio"  />
                    <span>Male</span>
                </label>
                <label>
                    <input className="with-gap" name="gender" onChange={(e)=>this.props.handleInput(e.target)} value="female" type="radio"  />
                    <span>FeMale</span>
                </label>
                </div>
               
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input id="address" name="address" onChange={(e)=>this.props.handleInput(e.target)} type="text" value={this.props.userData.address} className="validate"/>
                    <label for="password">Address</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input id="MobileNo" type="text" name="MobileNo" onChange={(e)=>this.props.handleInput(e.target)} value={this.props.userData.MobileNo} className="validate"/>
                    <label for="password">MobileNo</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s3">
                    <input id="file" type="file" value={this.state.value} name="file" onChange={(e)=>this.props.handleInputfile(e)} name="file" className="validate"/>
                </div>
            </div>
            <div className="row">  
            <div className="input-field col s12">
                <button type="submit" name="submit" className="waves-effect waves-light btn">Submit</button>
            </div>
            </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state)=> {
    return {
        userData:state.userData
    }
}

const mapDispatchToProps = (dispatch)=> {
    return {
        handleInput:(input)=>
        {
            dispatch(handleInputAction(input))
        },
        handleInputfile:(e)=>{
            
            console.log('image get', e.target.files[0].name)
            dispatch(handleInputfileAction(e))
        },
        resetUserForm:()=> {
            dispatch(resetUserForm())
        },
        addUserData:(data)=> {
            dispatch(addUserData(data))
        }

    }
}
export default connect(mapStateToProps,mapDispatchToProps)(AddUser);
