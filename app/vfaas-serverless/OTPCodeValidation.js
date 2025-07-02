module.exports.serverless = async function (email, otp) {
    const otpStored = await db.kv('my-secret').get(JSON.stringify(email));
    console.log(otpStored==otp);
};