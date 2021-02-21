require("../models");
const Work = require("../models/workmodel");
const moment = require("moment");

class WorkService {
  constructor() {}
  // Retrieve all works from the database.
  async getWorks(req, res, next) {
    try {
      const result = await Work.find().exec();

      return res.status(200).json({
        data: result || {},
        message: "test listed",
      });
    } catch (error) {
      return next(error);
    }
  }

  async test2(req, res, next) {
    try {
      const result = await Work.all().exec();

      return res.status(200).json({
        data: result || {},
        message: "test listed",
      });
    } catch (error) {
      return next(error);
    }
  }

  // Question 1
  async worksByClient(req, res, next) {
    const idClient = req.query.idClient;
    const from = moment.utc(req.query.from).format("YYYY-MM-DD");
    const to = moment.utc(req.query.to).format("YYYY-MM-DD");

    try {
      const worksNum = await Work.count({ idClient: idClient }).where({
        day: { $gte: from, $lte: to },
      });

      return res.status(200).json({
        numberWorks: worksNum || {},
        message: worksNum ? "Works found" : "¡Works not found!",
      });
    } catch (error) {
      return next(error);
    }
  }

  async getWorksId(req, res, next) {
    const idClient = req.query.idClient;

    try {
      const worksID = await Work.find({ idClient: idClient });

      return res.status(200).json({
        numberWorks: worksID || {},
        message: worksID ? "Works found" : "¡Works not found!",
      });
    } catch (error) {
      return next(error);
    }
  }

  // Question 2
  async getPmWorks(req, res, next) {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);

    try {
      const worksPm = await Work.aggregate([
        {
          $match: {
            day: { $gte: from, $lte: to },
          },
        },
        { $unwind: "$resources" },
        {
          $group: {
            _id: { idClient: "$idClient" },
            first_from: { $first: "$resources.from" },
            last_from: { $last: "$resources.to" },
            numWorks: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            idClient: "$_id.idClient",
            hourFrom: { $hour: "$first_from" },
            hourTo: { $hour: "$last_from" },
            minutesTo: { $minute: "$last_from" },
            numWorks: 1
          },
        },
        {
          $match: {
            hourFrom: { $gte: 12 },
            hourTo: { $lte: 23 },
            minutesTo: { $lte: 59 },
          },
        },
        {
          $project: {
            _id: 0,
            idClient: "$idClient",
            numWorks: 1
          },
        },
        {
          $sort: {
            first_from: 1,
          },
        },
      ]);
      console.log(worksPm);
      return res.status(200).json({
        worksByClients: worksPm || {},
        message: worksPm ? "Works found" : "¡Works not found!",
      });
    } catch (error) {
      return next(error);
    }
  }

  //  Question 3
  async getAvailability (req, res, next) {
    //   const idClient = req.query.idClient;
//   const day = moment(req.query.day).format("YYYY-MM-DD");
//   const fromHour = moment({ hour: 08, minute: 00 }).format("HH:mm:ss");
//   const toHour = moment({ hour: 20, minute: 00 }).format("HH:mm:ss");


//   try {
//     const worksAvailableClient = await Work.find({
//       idClient: idClient,
//       day: { $eq: day },
//     }).exec();

//     console.log(worksAvailableClient);

//     const pmWorks = worksAvailableClient.filter((work) => {
//       return work.resources.filter((resource) => {
//         const workFrom = moment(resource.from).format("HH:mm:ss");
//         const workTo = moment(resource.to).format("HH:mm:ss");

//         var a = moment(workFrom)
//         console.log("QUe es esto:", a);
//         return fromHour.diff(workFrom, "hours");
//       });
//     });
//     return res.status(200).json({
//       intervals: pmWorks || {},
//       message: pmWorks ? "Works found" : "¡Works not found!",
//     });
//   } catch (error) {
//     return next(error);
//   }
  }


// Question 4
// app.get("/availability-minutes", (req, res) => {
//   res.send(req.query);
// });
}

module.exports = WorkService;
