module.exports.serverless = async function (email, reminderTime, reminderNote) {
    console.log(await db.kv('is-validated-email').get(JSON.stringify(email)));
    if(Boolean(await db.kv('is-validated-email').get(JSON.stringify(email)))){
        await db.kv('reminders').put(JSON.stringify(email+":"+reminderTime), JSON.stringify({reminderTime: reminderTime, reminderNote: reminderNote}));
        console.log('complete');
    }
};