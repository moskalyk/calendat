module.exports.serverless = async function (email, otp) {
    const otpStored = await db.kv('my-secret').get(JSON.stringify(email));
    if(otpStored == otp){
        await db.kv('is-validated-email').put(JSON.stringify(email), true);
    }
    console.log(otpStored==otp);
};