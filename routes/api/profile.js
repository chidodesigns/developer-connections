//  Express
const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const cors = require("cors");
router.use(cors());
//  ENV Variables
const dotenv = require("dotenv");
dotenv.config();
//  Request
const request = require("request");
const axios = require("axios");

//  Auth
const auth = require("../../middleware/auth");
//  Profile Model
const Profile = require("../../models/Profile");
//  User Model
const User = require("../../models/User");
//  Post Model
const Post = require("../../models/Post");

//  @route      GET api/profile/me
//  @desc       Get Current User Profile
//  @access     Private
router.get("/me", auth, async (req, res) => {
  try {
    //  adding fields from user onto the Profile Route
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(400)
        .json({ msg: `There Is No Profile For The User ${req.user.name}` });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ msg: "Server Error" });
  }
});

//  @route      POST api/profile/
//  @desc       Create or Update A User Profile
//  @access     Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //  Build Profile Obj
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    //  Build Social Object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //  Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //  Create A Profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//  @route      GET api/profile/
//  @desc       Get All Profiles
//  @access     Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//  @route      GET api/profile/user/:user_id
//  @desc       Get Profile By User ID
//  @access     Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    //  if actual user object BUT wrong user object
    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    res.status(500).send("Server Error");
  }
});

//  @route      DELETE api/profile/
//  @desc       Delete profile & user & post
//  @access     Private
router.delete("/", auth, async (req, res) => {
  try {
    //  Remove User Posts
    await Post.deleteMany({ user: req.user.id });

    //  Delete Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //  Delete User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User delete" });
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//  @route      PUT api/profile/experience
//  @desc       Add profile Experience
//  @access     Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//  @route      DELETE api/profile/experience/:exp_id
//  @desc       Delete experience from profile
//  @access     Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //  Get Experience Index To Be deleted
    const removeIndex = profile.experience
      .map((exp) => exp.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//  @route      PUT api/profile/education
//  @desc       Add profile education
//  @access     Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//  @route      DELETE api/profile/education/:edu_id
//  @desc       Delete education from profile
//  @access     Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //  Get Experience Index To Be deleted
    const removeIndex = profile.education
      .map((exp) => exp.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//  @route      GET api/profile/github/:username
//  @desc       Get User Repos From Github
//  @access     Public
router.get("/github/:username", async (req, res) => {
  try {
 
    const response = await axios.get(`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created`)

    if (response.status !== 200) {

        console.log(response.status + response.statusText);
        return res.status(404).json({ msg: "No Github Profile Found" });

    }

    userResponseData = response.data;

      res.json(userResponseData);
    }catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
