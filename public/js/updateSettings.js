//UpdateData
import axios from 'axios';
import {
    showAlert
} from './alerts';

//type either 'password' or data
export const updateSettings = async (data, type) => {
    try {
        const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe';
            const res = await axios({
                method: 'PATCH',
                url,
                data
            });
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} Update Successfully!`);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

// export const updateUserPassword = async(passwordCurrent,password,passwordConfirm)=>{
//     try{
//         const res = await axios({
//             method: 'PATCH',
//             url: '/api/v1/users/updateMyPassword',
//             data:{
//                 passwordCurrent,
//                 password,
//                 passwordConfirm
//             }
//         });

//         if(res.data.status==='success'){
//             showAlert('success','Data Update Successfully!');
//         }
//     }catch(err){
//         showAlert('error',err.response.data.message);
//     }
// }