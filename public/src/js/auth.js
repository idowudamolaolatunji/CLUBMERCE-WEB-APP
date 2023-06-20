// import axios from "axios";

// export const login = async (email, password, role) => {
//     console.log(email, password, role);
//     try {
//         const res = await axios({
//             method: "POST",
//             url: "http://127.0.0.1:3000/api/users/login",
//             data: {
//                 email,
//                 password,
//                 role
//             }
//         })

//         console.log(res)
//     } catch(err) {
//         console.log(err.response.data);
//     }
// }

// export const signup = async (...body) => {
//     console.log(...body)
//     const {fullName, email, password, passwordConfirm, username, country, phone, gender, role} = body;
//     try {
//         const res = await axios({
//             method: 'POST',
//             url: "http://127.0.0.1:3000/api/users/signup",
//             data: {
//                 fullName,
//                 email,
//                 password,
//                 passwordConfirm,
//                 username,
//                 country,
//                 phone,
//                 gender,
//                 role
//             }
//         });

//         console.log(res)
//     } catch(err) {
//         console.log(err.response.data);
//     }
// }
