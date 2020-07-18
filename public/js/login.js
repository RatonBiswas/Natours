import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email,password) =>{
    // console.log('login');
    try{
        const res = await axios({
            method : 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/login',
            data:{
                email,
                password
            }
        });
        if(res.data.status==='success'){
            showAlert('success','Logged in successfully!');
            window.setTimeout (()=>{
                location.assign('/');
            },1500);
        }
    }catch(err){
        //console.log(err.response.data);
        showAlert('error',err.response.data.message);
    }
};

export const logout = async() => {
    try{
        const res = await axios({
            method:'GET',
            url: 'http://127.0.0.1:8000/api/v1/users/logout'

        });
        if(res.data.status==='success') location.reload(true);

    }catch(err){
        showAlert('error','Error Logging out! Try again');
    }
};


 