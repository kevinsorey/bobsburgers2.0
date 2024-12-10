//import { Buffer } from 'buffer'; // Import Buffer to handle base64 encoding
import axios from 'axios'; // Axios for HTTP requests
import qs from 'qs'; // Querystring for encoding the body data
import tunnel from 'tunnel'; // Tunnel for proxying requests

const VGS_VAULT_ID = 'tntfa6jdbse'; 
const VGS_USERNAME = 'US6nh9rcdQ6ScCaPqU3PAYDW'; 
const VGS_PASSWORD = '9b50e1c1-4116-4c27-ae33-caa1e930bc3f'; 
const STRIPE_KEY = 'sk_test_51Lrs6CK6opjUgeSmFHReX14eBMcbofCJrUOisGTC7ASpkfFMqD6Eysbs83qBC12YZErV3nv1Pg4UTy9WRhPRVUpQ00o7cUrV8I'; 

// Log for debugging the outbound route certificate
console.log(`Outbound route certificate is stored at this path: ${process.env['NODE_EXTRA_CA_CERTS']}`);

// Function to set up the proxy agent for VGS
function getProxyAgent() {
    const vgs_outbound_url = `${VGS_VAULT_ID}.sandbox.verygoodproxy.com`;
    console.log(`Sending request through outbound route: ${vgs_outbound_url}`);

    return tunnel.httpsOverHttps({
        proxy: {
            servername: vgs_outbound_url,
            host: vgs_outbound_url,
            port: 8443,
            proxyAuth: `${VGS_USERNAME}:${VGS_PASSWORD}`,
        },
    });
}

// Function to make the payment
async function postStripePayment(creditCardInfo, total) { // Receive total as an argument
    // Set up the proxy agent
    let agent = getProxyAgent();
    // Extract the expiration date and split it
    let expiry = creditCardInfo['card-expiration-date'].split('/');

    // Create an axios instance with the necessary headers and proxy
    const instance = axios.create({
        baseURL: 'https://api.stripe.com',
        headers: {
            'Authorization': `Bearer ${STRIPE_KEY}`, // Use Bearer authentication
        },
        httpsAgent: agent,
    });

    try {
        // Create the Payment Method
        let pm_response = await instance.post('/v1/payment_methods', qs.stringify({
            type: 'card',
            card: {
                number: creditCardInfo['card-number'],
                cvc: creditCardInfo['card-security-code'],
                exp_month: expiry[0].trim(),
                exp_year: expiry[1].trim(),
            },
        }));
        console.log('Payment Method Response:', pm_response.data);

        // Create the Payment Intent using the total amount
        let pi_response = await instance.post('/v1/payment_intents', qs.stringify({
            amount: total * 100, // Convert to cents (Stripe expects the amount in cents)
            currency: 'usd',
            payment_method: pm_response.data.id,
            confirm: true,
        }));
        console.log('Payment Intent Response:', pi_response.data);

        return pi_response.data; // Return the payment intent response
    } catch (error) {
        console.error('Error with Stripe payment:', error);
        throw error; // Propagate error for handling in the calling function
    }
}

// Export the function
export { postStripePayment };
