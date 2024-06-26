
const asyncHandler = (requestHandler) => {
    (res, req, next) => {
        Promise.resolve(requestHandler(res, req, next)).catch((err) => err(next))
    }
}

export {asyncHandler}













// const asyncHandler = (fn) => {
//     async (res, req, next) => {
//         try {
//             await fn(res, req, next);
//         } catch (error) {
//             res.status(error.code || 500).json({
//                 success: false,
//                 message: error.message
//             })
//         }
//     }
// }
// export {asyncHandler} ;