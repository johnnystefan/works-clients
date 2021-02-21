const express = require("express");
const WorksService = require("../../services/works");

function workApi (app) {
  const workService = new WorksService()

  const router = express.Router();
  app.use("/api/works", router);

  router.get("/", workService.getWorks)

  router.get("/find/worksId", workService.getWorksId)

  router.get("/works-by-client", workService.worksByClient)

  router.get("/pm-works", workService.getPmWorks)

  router.get("/availability", workService.getAvailability)

}

module.exports = workApi;