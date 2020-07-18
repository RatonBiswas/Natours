import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51H4qqNBWR7hOIqCfsFKioy1jDIQNFA7N2D9okzeO72c9t25vGaz6SHv10r5uQBt2trXuelxRS1kJARybv26l3tkj00qhsWJ1WI');

export const bookTour = async tourId =>{
    try{
        //1) Get checkout session from api 
        const session  = await axios(`http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`);
        console.log(session );


        //2) create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });

    }catch(err){
        console.log(err);
        showAlert('error',err);
    }
};

// import axios from 'axios';
// import { showAlert } from './alerts';
// import keys from '../../config/keys';

// const stripe = Stripe(keys.stripeKey);

// export const bookTour = async tourId => {
//   try {
//     // 1) Get checkout session from API
//     const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
//     // console.log(session);

//     // 2) Create checkout form + charge credit card
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id
//     });
//   } catch (err) {
//     console.log(err);
//     showAlert('error', err);
//   }
// };