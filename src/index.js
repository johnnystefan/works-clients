const path = require("path");
const express = require("express");
const db = require("./models");
const morgan = require("morgan");
const Work = require("./models/workmodel.js");
const moment = require("moment");

const app = express();
app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  const IndexPath = path.join(__dirname, "../public/index.html");
  res.sendFile(IndexPath);
});

// Example fetching one work
app.get("/example", async (req, res) => {
  const oneWork = await Work.all().exec();
  res.send(oneWork);
});

// Question 1
app.get("/works-by-client", async (req, res, next) => {
  const workId = req.query.idClient;
  const from = moment.utc(req.query.from).format("YYYY-MM-DD");
  const to = moment.utc(req.query.to).format("YYYY-MM-DD");

  try {
    const worksByClient = await Work.find({ idClient: workId }).exec();

    const timeWorksFilter = worksByClient.filter((work) => {
      const date = moment.utc(work.day).format("YYYY-MM-DD");

      return from <= date && to >= date && from <= to;
    });
    console.log("work of the client: ", worksByClient);
    console.log("WorkFILTERED:", timeWorksFilter);

    const numberWorks = timeWorksFilter.length;
    return res.status(200).json({
      numberWorks: numberWorks || {},
      message: numberWorks ? "Works found" : "¡Works not found!",
    });
  } catch (error) {
    return next(error);
  }
});

// Question 2
app.get("/pm-works", async (req, res, next) => {
  const from = moment.utc(req.query.from).format("YYYY-MM-DD");
  const to = moment.utc(req.query.to).format("YYYY-MM-DD");
  const fromHour = moment.utc({ hour: 12, minute: 00 }).format("HH:mm:ss");
  const toHour = moment.utc({ hour: 23, minute: 59 }).format("HH:mm:ss");

  try {
    const worksByClient = await Work.find({
      day: {
        $in: [from, to],
      },
    }).exec();

    const pmWorks = worksByClient.filter((work) => {
      return work.resources.filter((resource) => {
        const pmHours = moment.utc(resource.to).format("HH:mm:ss");
        return pmHours >= fromHour && pmHours <= toHour;
      });
    });

    const worksWithIdClients = pmWorks.filter((work) => work.idClient != null);
    const worksNoIdClients = pmWorks.filter((work) => work.idClient == null);

    return res.status(200).json({
      worksByClients: worksWithIdClients || {},
      worksNoIdClients: worksNoIdClients || {},
      message:
        worksWithIdClients || worksNoIdClients
          ? "Works found"
          : "¡Works not found!",
    });
  } catch (error) {
    return next(error);
  }
});

// Question 3
app.get("/availability", async (req, res, next) => {
  const idClient = req.query.idClient;
  const day = moment(req.query.day).format("YYYY-MM-DD");
  const fromHour = moment({ hour: 08, minute: 00 }).format("HH:mm:ss");
  const toHour = moment({ hour: 20, minute: 00 }).format("HH:mm:ss");


  try {
    const worksAvailableClient = await Work.find({
      idClient: idClient,
      day: { $eq: day },
    }).exec();

    console.log(worksAvailableClient);

    const pmWorks = worksAvailableClient.filter((work) => {
      return work.resources.filter((resource) => {
        const workFrom = moment(resource.from).format("HH:mm:ss");
        const workTo = moment(resource.to).format("HH:mm:ss");

        var a = moment(workFrom)
        console.log("QUe es esto:", a);
        return fromHour.diff(workFrom, "hours");
      });
    });
    return res.status(200).json({
      intervals: pmWorks || {},
      message: pmWorks ? "Works found" : "¡Works not found!",
    });
  } catch (error) {
    return next(error);
  }
});

// Question 4
app.get("/availability-minutes", (req, res) => {
  res.send(req.query);
});

app.listen(8080);
