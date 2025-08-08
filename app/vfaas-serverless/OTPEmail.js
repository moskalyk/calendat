const protonmail = require('protonmail-email');

module.exports.serverless = async function (args) {
    let otp = Math.floor(100000 + Math.random() * 900000);
    await db.kv('my-secret').put(JSON.stringify(args), otp);
    const pm = new protonmail({puppeteerOpts: {executablePath:'/usr/bin/google-chrome-stable'}, username: 'versus.energy@protonmail.com', password: '********'});
    await pm.sendEmail({to: args, body: `complete the otp process with this code: ${otp}`, subject: `your otp ${otp}`});
    console.log(otp);
};