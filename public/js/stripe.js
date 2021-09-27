/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alert';
const stripe = Stripe('pk_test_51HMBEnAkcNnX5JwLwAFTg9FGuOuqI2Svp97tCDHLcDC9Cn7RBwgD3X2xnbsOAqFTP4pUwhLFBfVZ3j3hLbHelt6U00tNiWJDcX')

export const bookTour = async tourId => {
    try {
        // 1) Get checkout-session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`)

        // 2) Create checkout form + charge creadit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

    } catch (err) {
        console.log(err)
        showAlert('error', err)
    }
}