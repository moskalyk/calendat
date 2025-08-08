module.exports.serverless = async function (email, otp) {
    if(Boolean(await vm('OTPCodeValidation').serverless(email, otp))) {
        let list = await db.kv('AllowList').get(email);
        console.log(list == undefined ? [] : JSON.parse(list));
    }
};