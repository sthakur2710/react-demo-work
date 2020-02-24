const Auth = {
    getAuth() {
        var get_token = localStorage.getItem("token")
        console.log('token get', get_token)
        if(get_token==='' || get_token===null)
        {
            return false
        }
        else
        {
            console.log('condition true', get_token)
            return true
        }
    }
};
export default Auth;