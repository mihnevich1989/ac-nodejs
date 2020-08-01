const { Router } = require("express");
const router = Router();
const UpdateDataBase = require("../models/connectPostgresModel");

router.get("/", (req, res) => {
  res.render("home", {
    title: "Главная страница",
    isHome: true,
  });
});

router.get("/update-mzk", async (req, res) => {
  const baseMzk = await UpdateDataBase.updateMzk();
  if (!baseMzk) {
    res.status(500).json();
  }
  res.status(200).json(baseMzk);
});

router.get("/update-lit", async (req, res) => {
  const baseLit = await UpdateDataBase.updateLit();
  if (!baseLit) {
    res.status(500).json();
  }
  res.status(200).json(baseLit);
});

module.exports = router;
