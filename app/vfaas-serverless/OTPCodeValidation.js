module.exports.serverless = async function (email, otp) {
    const otpStored = await db.kv('my-secret').get(JSON.stringify(email));
    console.log(Number(otpStored)==Number(otp));
    return otpStored==otp;
};