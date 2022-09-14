//Other Imports
const csv = require("csv-parser");
const fs = require("fs");
const hash = require("../util/hash");
const UserModel = require("../models/user.model");
const registrationEmail = require("../util/notification");

module.exports.upload = async (csvFile, ip, useragent) => {
  // parse the upcoming csv
  // get the email and password
  // send email using queue
  // add the same in db
  const csvData = [];
  fs.createReadStream(csvFile)
    .pipe(csv())
    .on("data", (data) => csvData.push(data))
    .on("end", async () => {
      console.log(csvData);
      const documentToUpload = csvData.map((item, i, arr) => {
        let val = {};
        val.name = item["Employee name"];
        val.email = item["Email"];
        val.DateofJoin = item["Date of join"];
        val.password = hash(item["password"]);
        (val.accountType = "user"),
          (val.createdBy = ip),
          (val.createdAgent = useragent);

        return val;
      });
      // this option prevents additional documents from being inserted if one fails
      const options = { ordered: true };
      const result = await UserModel.insertMany(documentToUpload, options);
      if (result) {
        // send email
        csvData.forEach(async (item) => {
          await registrationEmail(
            item["Email"],
            item["Employee name"],
            item["password"]
          );
        });
      }
    });
  return result;
};
