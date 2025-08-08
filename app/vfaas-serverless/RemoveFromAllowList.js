module.exports.serverless = async function (email, otp, friendEmail) {
    if(Boolean(await vm('OTPCodeValidation').serverless(email,otp))) {
        let list = JSON.parse(await db.kv('AllowList').get(email));
        const newList = list.filter((el) => el == friendEmail);
        await db.kv('AllowList').put(email, JSON.stringify(newList));
        console.log(true);
    } else {
        console.log(false);
    }
};