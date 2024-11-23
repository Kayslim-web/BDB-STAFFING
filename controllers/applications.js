
const express = require('express');

const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    res.render('applications/index.ejs', { applications: currentUser.applications });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Create
router.get('/new', async (req, res) => {
  res.render('applications/new.ejs');
});

router.post('/', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Push req.body (the new form data object) to the
    // applications array of the current user
    currentUser.applications.push(req.body);
    // Save changes to the user
    await currentUser.save();
    // Redirect back to the applications index view
    res.redirect(`/users/${currentUser._id}/applications`);
  } catch (error) {
    res.redirect('/');
  }
});

// Update

// Delete
router.delete('/:applicationId', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // use two helper methods from mongoose library.
    // 1st is the id() to find the specific emb doc
    // 2nd deleteOne() on the document we found

    currentUser.applications.id(req.params.applicationId).deleteOne();

    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/applications`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:applicationId', async (req, res) => {
  // Look up the user from req.session
  const currentUser = await User.findById(req.session.user._id);

  // use a mongoose helper method to find a specific embeded document
  // within the model
  const application = currentUser.applications.id(req.params.applicationId);

  res.render('applications/show.ejs', { application });
});

router.get('/:applicationId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);
    res.render('applications/edit.ejs', {
      application,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:applicationId', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);

    // use a mongoose helper method to find a specific embeded document
    // within the model
    const application = currentUser.applications.id(req.params.applicationId);

    // When updating we want to use the mongoose helper method that will override the value in the array
    application.set(req.body);

    // save the model changes
    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/applications/${req.params.applicationId}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});
module.exports = router;