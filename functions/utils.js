// CountdownToXMAS / Christmas Countdown [BOT] :: Utility Functions by Eartharoid

const log = require("leekslazylogger");
const fs = require("fs");
let cache = require("../cache.json");



module.exports.time = () => {
    const n = new Date();
    const h = ('0' + n.getHours()).slice(-2);
    const m = ('0' + n.getMinutes()).slice(-2);
    const s = ('0' + n.getSeconds()).slice(-2);
    let time = {
        "hours": h,
        "minutes": m,
        "seconds": s,
        "timestamp": `${h}:${m}:${s}`
    };
    return time;
};


module.exports.plural = (word, num) => {
    return res = num !== 1 ? word + "s" : word;
};

module.exports.affected = (rows, updated) => {
    if(typeof updated === "number") {
        log.type.db(`${rows} ${module.exports.plural("row", rows)} affected, ${updated} ${module.exports.plural("row", updated)} updated`);
    } else {
        log.type.db(`${rows} ${module.exports.plural("row", rows)} affected`);
    }
};

module.exports.refreshCache = (db, client, database, config) => {
    log.info(`[CACHE] Refreshing cache for ${client.guilds.size} servers`);
    db.query(`SELECT * FROM ${database.table} WHERE premium = true`, function (err, result) {
        if (err) {
            log.error(err)
        };
        if (config.debug) {
            log.debug(result)
        }
        // do something with result
        if (!result) return log.warn("No database result - CAN'T REFRESH CACHE");
        let c = []
        for (x in result) {
           c[x] = result[x].guild;
        }
        cache.premium = c;
        log.info(`[CACHE] Found ${result.length} premium ${module.exports.plural("server", result.length)}`);
        fs.writeFileSync("./cache.json", JSON.stringify(cache), (err) => console.error);
    });
};

