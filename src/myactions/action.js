import axios from 'axios';

export const GetRandomNo = ()=> {
    console.log('input image')
    return {
        type:'GET_RANDOM',
    }
} 

export const handleInputAction = (input)=> {
    console.log('input image', input)
    return {
        type:'UPDATE_INPUT',   
        name:input.name,
        value:input.value
    }
}
export const handleInputfileAction = (input) => {
    // console.log('IMAGE DATA',input.target.files[0])
    return {
        type:'IMAGE_INPUT',
        payload:input.target.files[0]
    }
}

export const GetDetails = (data)=> {
    return {
        type:'GET_ALL_DETAILS',
        payload:data
    }
}

export const resetUserForm = ()=> {
    return {
        type:'RESET_DETAILS'
    }
}

export const addUserData = (data)=> {
    return {
        type:'ADD_USER',
        payload:data
    }
}

export const deleteUser = (id)=> {
    return (dispatch)=>{
        axios.delete('/delete_user_new/' + id)
      .then(res => {
        console.log('delete', res)
        dispatch({
            type:'DELETE_USER',
            payload:id
        })
      })
    }
}