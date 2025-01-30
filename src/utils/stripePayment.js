import { Buffer } from "buffer"; // Import Buffer for Base64 encoding
import axios from "axios"; // Axios for HTTP requests
import qs from "qs"; // Querystring for encoding the body data
import tunnel from "tunnel"; // Tunnel for proxying requests

// Stripe Credentials
const STRIPE_KEY = "sk_test_51Lrs6CK6opjUgeSmFHReX14eBMcbofCJrUOisGTC7ASpkfFMqD6Eysbs83qBC12YZErV3nv1Pg4UTy9WRhPRVUpQ00o7cUrV8I";

// Shift4 Credentials
const SHIFT4_KEY = "pr_test_tXHm9qV9qV9bjIRHcQr9PLPa";

// VGS Proxy Credentials
const VGS_VAULT_ID = "tntfa6jdbse";
const VGS_USERNAME = "US6nh9rcdQ6ScCaPqU3PAYDW";
const VGS_PASSWORD = "9b50e1c1-4116-4c27-ae33-caa1e930bc3f";

/**
 * Function to set up the proxy agent for VGS
 */
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

/**
 * Function to process payments via Stripe or Shift4
 * @param {Object} creditCardInfo - Credit Card Details
 * @param {Number} total - Total amount in USD
 * @param {String} gateway - Choose 'stripe' or 'shift4'
 * @param {Boolean} enable3DS - Enable or disable 3D Secure
 */
async function processPayment(creditCardInfo, total, gateway = "stripe", enable3DS = false) {
    try {
        if (gateway === "stripe") {
            return await processStripePayment(creditCardInfo, total, enable3DS);
        } else if (gateway === "shift4") {
            return await processShift4Payment(creditCardInfo, total);
        } else {
            throw new Error('Invalid payment gateway. Choose either "stripe" or "shift4".');
        }
    } catch (error) {
        console.error(`Error processing ${gateway} payment:`, error.response ? error.response.data : error);
        throw error;
    }
}

/**
 * Process Stripe Payment with Proxy
 */
async function processStripePayment(creditCardInfo, total, enable3DS) {
    let agent = getProxyAgent(); 
    let expiry = creditCardInfo["card-expiration-date"].split("/");

    const instance = axios.create({
        baseURL: "https://api.stripe.com",
        headers: {
            Authorization: `Bearer ${STRIPE_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        httpsAgent: agent,
    });

    try {
        console.log("Processing Stripe Payment...");
        
        // Step 1: Create Payment Method
        let pm_response = await instance.post(
            "/v1/payment_methods",
            qs.stringify({
                type: "card",
                card: {
                    number: creditCardInfo["card-number"],
                    cvc: creditCardInfo["card-security-code"],
                    exp_month: expiry[0].trim(),
                    exp_year: expiry[1].trim(),
                },
            })
        );

        // Step 2: Create Payment Intent with 3DS (if enabled)
        let pi_response = await instance.post(
            "/v1/payment_intents",
            qs.stringify({
                amount: total * 100, 
                currency: "usd",
                payment_method: pm_response.data.id,
                confirm: true,
                ...(enable3DS && { "payment_method_options[card][request_three_d_secure]": "any" }), 
            })
        );

        console.log("Stripe Payment Successful:", pi_response.data);
        return pi_response.data;
    } catch (error) {
        console.error("Error processing Stripe payment:", error);
        throw error;
    }
}

/**
 * Process Shift4 Payment with Proxy
 */
async function processShift4Payment(creditCardInfo, total) {
    let agent = getProxyAgent(); 
    let expiry = creditCardInfo["card-expiration-date"].split("/");

    const instance = axios.create({
        baseURL: "https://dev.shift4.com",
        headers: {
            Authorization: `Basic ${Buffer.from(`${SHIFT4_KEY}:`).toString("base64")}`,
            "Content-Type": "application/json",
        },
        httpsAgent: agent, 
    });

    try {
        console.log("Processing Shift4 Payment...");

        // Step 1: Create a Payment Token
        let token_response = await instance.post("/tokens", {
            card: {
                number: creditCardInfo["card-number"],
                expMonth: expiry[0].trim(),
                expYear: expiry[1].trim(),
                cvc: creditCardInfo["card-security-code"],
            },
        });

        // Step 2: Create a Charge with 3D Secure
        let charge_response = await instance.post("/charges", {
            amount: total * 100, 
            currency: "USD",
            card: token_response.data.id, 
            description: "Example charge with 3D Secure",
            threeDSecure: {
                requireAttempt: true,
                requireEnrolledCard: true,
                requireSuccessfulLiabilityShiftForEnrolledCard: true,
            },
        });

        console.log("Shift4 Payment Successful:", charge_response.data);
        return charge_response.data;
    } catch (error) {
        console.error("Error processing Shift4 payment:", error);
        throw error;
    }
}

// Export the function
export { processPayment };
