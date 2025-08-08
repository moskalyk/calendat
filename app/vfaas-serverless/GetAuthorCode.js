module.exports.serverless = async function (bundleID) {
    console.log(await db.kv('authorship').get(JSON.stringify(bundleID)));
};