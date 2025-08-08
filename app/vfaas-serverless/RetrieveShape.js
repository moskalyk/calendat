module.exports.serverless = async function (year, email, otp, month) {
    if(Boolean(await vm('OTPCodeValidation').serverless(email,otp))) {
        let polygons = await db.kv('polygons').get(JSON.stringify(year+":"+email+":"+month));
        polygons = polygons == undefined ? JSON.stringify({polygons: []}) : polygons;
        let list = await db.kv('AllowList').get(email);
        let emptyPolygons = [];
        list = list == undefined ? JSON.stringify([]) : list;
        list = list.replace(/'/g, '"');
        list = JSON.parse(list);
        emptyPolygons.push(...JSON.parse(polygons).polygons);
        for(let i = 0; i < list.length; i++){
            let allowedList = await db.kv('AllowList').get(list[i]);
            allowedList = allowedList == undefined ? JSON.stringify([]) : allowedList;
            allowedList = allowedList.replace(/'/g, '"');
            allowedList = JSON.parse(allowedList);
            let polygons = await db.kv('polygons').get(JSON.stringify(year+":"+list[i]+":"+month));
            if(polygons!=undefined) {
                if(allowedList.includes(email)) emptyPolygons.push(...JSON.parse(polygons).polygons);
            }
        }
        console.log(JSON.stringify({polygons: emptyPolygons}));
    } else {
        console.log(false);
    }
};