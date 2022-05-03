const { StatusCodes } = require("http-status-codes");
const Event = require("./model");
const CustomAPI = require("../../../errors");
const Category = require("../categories/model");
const Speaker = require("../speakers/model");
const fs = require("fs");
const config = require("../../../config");

const getAllEvent = async (req, res, next) => {
  try {
    const { keyword, category, speaker } = req.query;
    const user = req.user.id;

    let condition = { user: user };

    if (keyword) {
      condition = { ...condition, title: { $regex: keyword, $options: "i" } };
    }

    if (category) {
      condition = { ...condition, category: category };
    }
    if (speaker) condition = { ...condition, speaker: speaker }; //code alternatif utk 1 line

    //filter
    const result = await Event.find(condition)
      .populate({
        path: "category",
        select: "_id name",
      })
      .populate({
        path: "speaker",
        select: "_id name role avatar",
      });

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      price,
      date,
      about,
      venueName,
      tagLine,
      keyPoint,
      category,
      speaker,
    } = req.body;

    const user = req.user.id;
    // console.log('Keypoint >>');
    // console.log(typeof(keyPoint));

    if (!keyPoint)
      throw new CustomAPI.BadRequestError("Please Provide Keypoints");

    const checkCategory = await Category.findOne({ _id: category });
    const checkSpeaker = await Speaker.findOne({ _id: speaker });

    if (!checkCategory) {
      throw new CustomAPI.NotFoundError("No Category with id :" + category);
    }

    if (!checkSpeaker) {
      throw new CustomAPI.NotFoundError("No Speaker with id :" + speaker);
    }

    let result;

    if (!req.file) {
      throw new CustomAPI.BadRequestError("Please upload image/cover");
    } else {
      result = new Event({
        title,
        price,
        date,
        about,
        venueName,
        tagLine,
        keyPoint: JSON.parse(keyPoint),
        category,
        speaker,
        cover: req.file.filename,
        user,
      });
    }

    await result.save();

    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const getOneEvent = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;

    const result = await Event.findOne({ _id: eventId });

    if (!result) {
      throw new CustomAPI.NotFoundError("No Event With id " + eventId);
    }

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const {
      title,
      price,
      date,
      about,
      venueName,
      tagLine,
      keyPoint,
      category,
      speaker,
    } = req.body;

    const user = req.user.id;

    if (!keyPoint)
      throw new CustomAPI.BadRequestError("Please Provide Keypoints");

    const checkCategory = await Category.findOne({ _id: category });

    const checkSpeaker = await Speaker.findOne({ _id: speaker });

    if (!checkCategory) {
      throw new CustomAPI.NotFoundError("No Category with id :" + category);
    }

    if (!checkSpeaker) {
      throw new CustomAPI.NotFoundError("No Speaker with id :" + speaker);
    }

    let result = await Event.findOne({ _id: eventId });

    if (!req.file) {
      result.title = title;
      result.price = price;
      result.date = date;
      result.about = about;
      result.venueName = venueName;
      result.tagLine = tagLine;
      result.keyPoint = JSON.parse(keyPoint);
      result.category = category;
      result.speaker = speaker;
      result.user = user;
    } else {
      let currentImage = `${config.rootPath}/public/uploads/${result.cover}`;

      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }
      result.title = title;
      result.price = price;
      result.date = date;
      result.about = about;
      result.venueName = venueName;
      result.tagLine = tagLine;
      result.keyPoint = JSON.parse(keyPoint);
      result.category = category;
      result.speaker = speaker;
      result.user = user;
      result.cover = req.file.filename;
    }

    await result.save();

    res.status(StatusCodes.OK).json({ data: result });
  } catch (error) {}
};

const deleteEvent = async (req, res, next) => {
  try {
    const user = req.user.id;
    const { id: eventId } = req.params;

    let result = await Event.findOne({ _id: eventId, user });

    if (!result) {
      throw new CustomAPI.NotFoundError("No Event with Id :" + eventId);
    }

      let currentImage = `${config.rootPath}/public/uploads/${result.cover}`;

      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

    await result.remove();
    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEvent,
  createEvent,
  getOneEvent,
  updateEvent,
  deleteEvent,
};
