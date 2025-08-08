module.exports.serverless = async function (bundleID, author) {
    console.log(await db.kv('authorship').put(JSON.stringify(bundleID), JSON.stringify(author)));
};