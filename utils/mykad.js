const { exec } = require("child_process");
const path = require('path');

/**
 * Call win.exe and extract MyKad data using OpenSC (without picture)
 * @return array
 */
const extractMyKad = async () => {
	const openscPath = path.join(__dirname, '../opensc');

	return new Promise((resolve, reject) => {
		exec(
			"opensc.exe -v " +
			'-s "00:A4:04:00:0A:A0:00:00:00:74:4A:50:4E:00:10" ' +
			'-s "C8:32:00:00:05:08:00:00:F0:00" ' +
			'-s "CC:00:00:00:08:01:00:01:00:03:00:F0:00" ' +
			'-s "CC:06:00:00:F0" ' +
			'-s "C8:32:00:00:05:08:00:00:A0:00" ' +
			'-s "CC:00:00:00:08:01:00:01:00:F3:00:A0:00" ' +
			'-s "CC:06:00:00:A0" ' +
			'-s "C8:32:00:00:05:08:00:00:A0:00" ' +
			'-s "CC:00:00:00:08:04:00:01:00:03:00:A0:00" ' +
			'-s "CC:06:00:00:A0"',
			{ cwd: openscPath },
			(error, stdout, _) => {
				if (error) {
					reject({
						// message: "Tiada pembaca kad dikenalpasti atau tiada MyKad dimasukkan."
						message: error.message
					});
				} else if (!stdout) {
					reject({
						message: "MyKad tidak dapat dibaca.",
					});
				} else {
					let data = convertMyKadData(stdout);
					resolve(data);
				}
			}
		);
	});
};

exports.extractMyKad = extractMyKad;

/**
 * Extracted string is process to get values
 *
 * @param {string} rawtext
 * @returns {object} mykaddata
 */
const convertMyKadData = (rawtext) => {

	const myKadData = {};
	let infoStr 	= "";
	const rowsArr 	= rawtext.split(/\r?\n/);

	for (let i = 0; i < rowsArr.length; i++) {
		if (
			(i >= 10 && i <= 24) 
			|| (i >= 31 && i <= 40) 
			|| (i >= 47 && i <= 56)) 
		{
			infoStr += rowsArr[i].substring(48);
		}
	}

	const icNumber 				= infoStr.substring(270, 282).trim();
	const gender 				= infoStr.substring(283, 284).trim();
	const last_update 			= rowsArr[36].substring(3, 8) + "-" + rowsArr[36].substring(9, 11) + "-" + rowsArr[36].substring(12, 14);
	const dateofbirth 			= rowsArr[34].substring(12, 17) + "-" + rowsArr[34].substring(18, 20) + "-" + rowsArr[34].substring(21, 23);

	myKadData["name"] 			= infoStr.substring(0, 150).trim();
	myKadData["address1"] 		= infoStr.substring(400, 430).trim();
	myKadData["address2"] 		= infoStr.substring(430, 460).trim();
	myKadData["address3"] 		= infoStr.substring(460, 490).trim();
	myKadData["ic"] 			= icNumber.length !== 12 ? "" : icNumber;
	myKadData["name2"] 			= infoStr.substring(150, 230).trim();
	myKadData["gender"] 		= gender === "P" ? "Female" : "Male";
	myKadData["old_ic"] 		= infoStr.substring(285, 292).trim();
	myKadData["state"] 			= infoStr.substring(296, 322).trim();
	myKadData["nationality"] 	= infoStr.substring(325, 343).trim();
	myKadData["race"] 			= infoStr.substring(343, 368).trim();
	myKadData["religion"] 		= infoStr.substring(368, 396).trim();
	myKadData["city"] 			= infoStr.substring(493, 517).trim();
	myKadData["state"] 			= infoStr.substring(518, 548).trim();
	myKadData["postcode"] 		= rowsArr[52].substring(30, 37).replace(/\s/g, "");
	myKadData["lastupdate"] 	= last_update.replace(/\s/g, "");
	myKadData["dob"] 			= dateofbirth.replace(/\s/g, "");

	if (myKadData["dob"] !== "" && myKadData["dob"].length === 10) 
	{
		let ageDate = new Date(new Date() - new Date(myKadData["dob"]));

		myKadData["age"] = Math.abs(ageDate.getUTCFullYear() - 1970);
	}

	return myKadData;
}
