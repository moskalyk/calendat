module.exports.serverless = async function (year, email, otp, month, polygon) {
    if(await vm('OTPCodeValidation').serverless(email,otp)) {
        let polygonsFromStorage = JSON.parse(await db.kv('polygons').get(JSON.stringify(year+":"+email+":"+month)));
        polygonsFromStorage = polygonsFromStorage == undefined ? {polygons: []} : polygonsFromStorage;
        const polygons = polygonsFromStorage.polygons.filter((el) => el.geo !== polygon);
        await db.kv('polygons').put(JSON.stringify(year+":"+email+":"+month), JSON.stringify({polygons: polygons}));
        console.log('complete');
    }else {
        console.log('false');
    }
};