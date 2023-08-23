// const paystack = (request) => {
//     const MySecretKey = "Bearer " + process.env.PAYSTACK_SECCRET_API_KEY;
//     //replace the secret key with that from your paystack account
//     const initializePayment = (form, mycallback) => {
//       const options = {
//         url: "https://api.paystack.co/transaction/initialize",
//         headers: {
//           authorization: MySecretKey,
//           "content-type": "application/json",
//           "cache-control": "no-cache",
//         },
//         form,
//       };
//       const callback = (error, response, body) => {
//         return mycallback(error, body);
//       };
//       request.post(options, callback);
//     };
  
//     const verifyPayment = (ref, mycallback) => {
//       const options = {
//         url:
//           "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
//         headers: {
//           authorization: MySecretKey,
//           "content-type": "application/json",
//           "cache-control": "no-cache",
//         },
//       };
//       const callback = (error, response, body) => {
//         return mycallback(error, body);
//       };
//       request(options, callback);
//     };
  
//     return { initializePayment, verifyPayment };
// };
  
// module.exports = paystack;

/*
const paystack = async function(reference, type) {
  try {
    const headers = {
      'Authorization': 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
    };
    const check = axios.get(`https://api.paystack.co/transaction/verify/${reference}`, { headers });
    const response = await check;
    console.log(response)

    if (response.data.data.status !== "success") {
      return res.status(400).json({
          message: "Unable to Verify Payment"
      })
    }
    return true, response;
  } catch(err) {
    return false
  }
}
*/

// module.exports = paystack;