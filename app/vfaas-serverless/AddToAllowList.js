module.exports.serverless = async function (email, otp, friendEmail) {
    if(await vm('OTPCodeValidation').serverless(email,otp)) {
        let list = await db.kv('AllowList').get(email);
        list = list == undefined ? [] : JSON.parse(list);
        list.push(friendEmail);
        await db.kv('AllowList').put(email, JSON.stringify(list));
        console.log(true);
    } else {
        console.log(false);
    }
};