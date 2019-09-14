// CountdownToXMAS / Christmas Countdown [BOT] :: Countdown Functions by Eartharoid

const log = require("leekslazylogger");

module.exports.time = () => {
    const n = new Date();
    const h = n.getHours();
    const m = n.getMinutes();
    const s = n.getSeconds();
    let time = {
        "hours": ('0' + h).slice(-2),
        "minutes": ('0' + m).slice(-2),
        "seconds": ('0' + s).slice(-2)
    };
    return time;
}

module.exports.daysLeft = () => {
    // return DAYS left to Christmas
    let today = new Date();
    let xmas = new Date(today.getFullYear(), 11, 24);

    if (today.getMonth() == 11 && today.getDate() > 24) {
        xmas.setFullYear(xmas.getFullYear() + 1);
    }

    const one_day = 1000 * 60 * 60 * 24;
    let days = Math.ceil((xmas.getTime() - today.getTime()) / (one_day));

    return days;
}


module.exports.sleepsLeft = () => {
    // return SLEEPS left to Christmas
    let sleeps = module.exports.daysLeft();
    return sleeps + 1;
}


module.exports.message = () => {
    let x = module.exports.sleepsLeft();
    if (x === 0) {
        return ":snowflake: **Merry Christmas!** :snowflake:";
    } else if (x === 1) {
        return "It's Christmas Eve!";
    } else {
        return false;
    }
}



module.exports.daily = (client, db) => {
    // DAILY COUNTDOWN
    log.info("daily countdown automatic sequence triggered")
}



module.exports.days = () => {
    let x = module.exports.daysLeft();
    let res = {
        "text": x > 1 ? "days" : "day",
        "verb": x > 1 ? "are" : "is"
    };
    return res;
}


module.exports.sleeps = () => {
    let x = module.exports.sleepsLeft();
    let res = {
        "text": x > 1 ? "sleeps" : "sleep",
        "verb": x > 1 ? "are" : "is"
    };
    return res;
}
