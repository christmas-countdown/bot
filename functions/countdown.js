// CountdownToXMAS / Christmas Countdown [BOT] :: Countdown Functions by Eartharoid

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
}


module.exports.live = () => {
    // return EXACT TIME left to Christmas
    let today = new Date();
    let xmas = new Date(today.getFullYear(), 11, 25);

    if (today.getMonth() == 11 && today.getDate() > 25) {
        xmas.setFullYear(xmas.getFullYear() + 1);
    }


    let days = Math.trunc((xmas.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let hours = Math.trunc((xmas.getTime() - today.getTime()) / (1000 * 60 * 60));
    let mins = Math.trunc((xmas.getTime() - today.getTime()) / (1000 * 60));
    let secs = Math.trunc((xmas.getTime() - today.getTime()) / (1000));

    let res = {
        "days": days,
        "hours": hours - (days * 24),
        "mins": mins - (hours * 60),
        "secs": secs - (mins * 60)
    };
    
    return res;
}



module.exports.weeksLeft = () => {
    // return WEEKS left to Christmas
    let today = new Date();
    let xmas = new Date(today.getFullYear(), 11, 25); // 24

    if (today.getMonth() == 11 && today.getDate() > 25) {
        xmas.setFullYear(xmas.getFullYear() + 1);
    }

    const one_week = 1000 * 60 * 60 * 24 * 7;
    let weeks = Math.trunc((xmas.getTime() - today.getTime()) / (one_week));

    return weeks;
}


module.exports.daysLeft = () => {
    // return DAYS left to Christmas
    let today = new Date();
    let xmas = new Date(today.getFullYear(), 11, 25);

    if (today.getMonth() == 11 && today.getDate() > 25) {
        xmas.setFullYear(xmas.getFullYear() + 1);
    }

    const one_day = 1000 * 60 * 60 * 24;
    let days = Math.trunc((xmas.getTime() - today.getTime()) / (one_day));

    return days;
}


module.exports.sleepsLeft = () => {
    // return SLEEPS left to Christmas
    let days = module.exports.daysLeft();
    return days + 1;
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
        "text": x !== 1 ? "days" : "day",
        "verb": x !== 1 ? "are" : "is"
    };
    return res;
}


module.exports.sleeps = () => {
    let x = module.exports.sleepsLeft();
    let res = {
        "text": x !== 1 ? "sleeps" : "sleep",
        "verb": x !== 1 ? "are" : "is"
    };
    return res;
}
