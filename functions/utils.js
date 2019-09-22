// CountdownToXMAS / Christmas Countdown [BOT] :: Utility Functions by Eartharoid

const log = require("leekslazylogger");



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
