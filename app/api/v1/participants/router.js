const router = require("express").Router();
const { signup, signin, landingPage, detailPage } = require("./controller");

router.post("/participants/auth/signup", signup);
router.post("/participants/auth/signin", signin);
router.get("/participants/landing-page", landingPage);
router.get("/participants/detail-page/:id", detailPage);

module.exports = router;

