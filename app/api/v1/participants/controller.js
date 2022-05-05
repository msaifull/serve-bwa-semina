const Participant = require("./model");
const Event = require("../events/model");
const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../../errors");
const { createTokenUser, createJWT } = require("../../../utils");

const signup = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const result = new Participant({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    await result.save();

    delete result._doc.password;
    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomAPI.BadRequestError(
        "Please provide email and password!!!"
      );
    }

    const result = await Participant.findOne({ email: email });
    if (!result) {
      throw new CustomAPI.UnauthorizedError("Invalid Credentials");
    }

    const isPasswordCorrect = await result.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new CustomAPI.UnauthorizedError("invalid Credentials");
    }

    const token = createJWT({ payload: createTokenUser(result) });
    res.status(StatusCodes.OK).json({ data: { token } });
  } catch (err) {
    next(err);
  }
};

const landingPage = async (req, res, next) => {
  try {
    const result = await Event.find({ status: true })
      .select("_id title date price category venueName cover")
      .populate({ path: "category", select: "_id name" })
      .limit(4);

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const detailPage = async (req, res, next) => {
  try {
    const { id: detailPageId } = req.params;

    const result = await Event.findOne({ _id: detailPageId, status: true })
      .select(
        "_id speaker title date price venueName cover keyPoint tagLine about"
      )
      .populate({ path: "speaker", select: "_id name role avatar" });

    if (!result) {
      throw new CustomAPI.NotFoundError("No Event with Id :" + detailPageId);
    }

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, signin, landingPage, detailPage };
