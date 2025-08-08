module.exports.serverless = async function (year, email, otp, month, polygon, color) {
    if(Boolean(await vm('OTPCodeValidation').serverless(email,otp))) {
        let polygonsFromStorage = await db.kv('polygons').get(JSON.stringify(year+":"+email+":"+month));
        if(polygonsFromStorage == undefined){
            polygonsFromStorage = {};
            polygonsFromStorage.polygons = [];
        }else {
            polygonsFromStorage = JSON.parse(polygonsFromStorage);
        }
        polygonsFromStorage.polygons.push({geo: polygon, color: color});
        await db.kv('polygons').put(JSON.stringify(year+":"+email+":"+month), JSON.stringify(polygonsFromStorage));
        console.log('complete');
    }
};