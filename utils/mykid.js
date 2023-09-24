const { exec } = require("child_process");
const path = require('path');

/**
 * Call win.exe and extract MyKid data using OpenSC (without picture)
 * @return array
 */
const extractMyKid = async () => {
    const openscPath = path.join(__dirname, '../opensc');

    return new Promise((resolve, reject) => {
        exec(
            "opensc.exe -v " +
            '-s "00:A4:04:00:0A:A0:00:00:00:74:4A:50:4E:00:10"  ' +
            '-s "C8:32:00:00:05:08:00:00:F0:00" ' +
            '-s "CC:00:00:00:08:01:00:01:00:03:00:F0:00" ' +
            '-s "CC:06:00:00:F0"  ' +
            '-s "C8:32:00:00:05:08:00:00:F0:00" ' +
            '-s "CC:00:00:00:08:01:00:01:00:F3:00:F0:00" ' +
            '-s "CC:06:00:00:F0"  ' +
            '-s "C8:32:00:00:05:08:00:00:F0:00" ' +
            '-s "CC:00:00:00:08:02:00:01:00:03:00:F0:00" ' +
            '-s "CC:06:00:00:F0"  ' +
            '-s "C8:32:00:00:05:08:00:00:F0:00" ' +
            '-s "CC:00:00:00:08:02:00:01:00:F3:00:F0:00" ' +
            '-s "CC:06:00:00:F0"  ' +
            '-s "C8:32:00:00:05:08:00:00:F0:00" ' +
            '-s "CC:00:00:00:08:02:00:01:00:E3:01:F0:00" ' +
            '-s "CC:06:00:00:F0"  ' +
            '-s "C8:32:00:00:05:08:00:00:F0:00" ' +
            '-s "CC:00:00:00:08:02:00:01:00:D3:02:F0:00" ' +
            '-s "CC:06:00:00:F0"  ' +
            '-s "C8:32:00:00:05:08:00:00:F0:00" ' +
            '-s "CC:00:00:00:08:02:00:01:00:C3:03:F0:00" ' +
            '-s "CC:06:00:00:F0"',
            { cwd: openscPath },
            (error, stdout, _) => {
				if (error) {
					reject({
						message: "Tiada pembaca kad dikenalpasti atau tiada MyKid dimasukkan.",
					});
				} else if (!stdout) {
					reject({
						message: "MyKid tidak dapat dibaca.",
					});
                }
                else {
                    let data = convertMyKidData(stdout);
                    resolve(data)
                }
            }
        );
    });
};

exports.extractMyKid = extractMyKid;

/**
 * Extracted string is process to get values
 *
 * @param {string} rawtext
 * @returns {object} mykiddata
 */
function convertMyKidData(rawtext) {
    const myKidData = {};
    let infoStr     = "";
    const rowsStr   = rawtext.split(/\r?\n/);

    for (let i = 0; i < rowsStr.length; i++) {
        if (
            (i >= 10 && i <= 24)
            || (i >= 31 && i <= 41)
            || (i >= 52 && i <= 66)
            || (i >= 73 && i <= 87)
            || (i >= 94 && i <= 108)
            || (i >= 115 && i <= 129)
            || (i >= 136 && i <= 139)
        ) {
            infoStr += rowsStr[i].substring(48);
        }
    }

    const gender                    = dataline.substring(177, 178).trim();
    const dobPart1                  = datalines[52].substring(0, 5).replace(/\s/g, "");
    const dobPart2                  = datalines[52].substring(6, 8);
    const dobPart3                  = datalines[52].substring(9, 11);
    const tobPart1                  = datalines[52].substring(12, 14);
    const tobPart2                  = datalines[52].substring(15, 17);
    const lastUpdatePart1           = datalines[57].substring(21, 26).replace(/\s/g, "");
    const lastUpdatePart2           = datalines[57].substring(27, 29);
    const lastUpdatePart3           = datalines[57].substring(30, 32);

    myKidData["birthcert"]          = dataline.substring(0, 15).trim();
    myKidData["ic"]                 = infoStr.substring(15, 27).trim();
    myKidData["name"]               = infoStr.substring(27, 177).trim();
    myKidData["address1"]           = infoStr.substring(225, 255).trim();
    myKidData["address2"]           = infoStr.substring(255, 285).trim();
    myKidData["address3"]           = infoStr.substring(285, 315).trim();
    myKidData["gender"]             = gender === "P" ? "Female" : "Male";
    myKidData["nationality"]        = dataline.substring(178, 195).trim();
    myKidData["state_birth"]        = dataline.substring(195, 225).trim();
    myKidData["city"]               = dataline.substring(318, 348).trim();
    myKidData["state"]              = dataline.substring(348, 378).trim();
    myKidData["place_birth"]        = dataline.substring(423, 463).trim();
    myKidData["city_birth"]         = dataline.substring(463, 503).trim();
    myKidData["race"]               = dataline.substring(1064, 1094).trim();
    myKidData["religion"]           = dataline.substring(378, 392).trim();
    myKidData["issued_by"]          = dataline.substring(1378, 1428).trim();
    myKidData["mother_ic"]          = dataline.substring(810, 822).trim();
    myKidData["mother_name"]        = dataline.substring(887, 1037).trim();
    myKidData["mother_race"]        = dataline.substring(1064, 1094).trim();
    myKidData["mother_religion"]    = dataline.substring(378, 392).trim();
    myKidData["mother_nationality"] = dataline.substring(1041, 1064).trim();
    myKidData["father_ic"]          = dataline.substring(1094, 1106).trim();
    myKidData["father_name"]        = dataline.substring(1171, 1321).trim();
    myKidData["father_race"]        = dataline.substring(1348, 1378).trim();
    myKidData["father_religion"]    = dataline.substring(392, 406).trim();
    myKidData["father_nationality"] = dataline.substring(1325, 1348).trim();
    myKidData["post_code"]          = datalines[35].substring(33, 40).replace(/\s/g, "");
    myKidData["dob"]                = dobPart1 + "-" + dobPart2 + "-" + dobPart3;
    myKidData["tob"]                = tobPart1 + ":" + tobPart2;
    myKidData["last_update"]        = lastUpdatePart1 + "-" + lastUpdatePart2 + "-" + lastUpdatePart3;

    return myKidData;
}
