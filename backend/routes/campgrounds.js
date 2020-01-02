var express = require('express'),
    router = express.Router(),
    Campground = require('../models/Campground'),
    Comment = require('../models/Comment'),
    middleware = require('../middleware'),
    { isLoggedIn, checkUserCampground, checkUserComment, isAdmin, isSafe } = middleware;

// Define escapeRegex function for search feature
function escapeRegex(text) 
{
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Index - Show all campgrounds
router.get('/', (req, res) => {
    if (req.query.search && req.xhr)
    {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all the campgrounds from DB
        Campground.find({ name: regex }, (err, allCampgrounds) => {
            if (err)
            {
                console.log(err);
            } else 
            {
                res.status(200).json(allCampgrounds);
            }
        });
    } else
    {
        // Get all campgrounds from DB
        Campground.find({}, (err, allCampgrounds) => {
            if (err)
            {
                console.log(err);
            } else 
            {
                if (req.xhr)
                {
                    res.json(allCampgrounds);
                } else
                {
                    res.render({campgrounds: allCampgrounds});
                }
            }
        });
    }
});

// CREATE - Add new campground to DB
router.post('/', isLoggedIn, (req, res) => {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author
    }
    // create a new campgrounnd and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err)
        {
            console.log(err);
        } else 
        {
            // redirect back to campgrounds array
            console.log(newlyCreated);
            res.redirect("/campgrounds");   
        }
    });
});

// SHOW - Shows more information about a specific campground
router.get('/:id', (req, res) => {
    // find campground with provided ID
    Campground.findById(req.params.id)
        .populate("comments").exec((err, foundCampground) => {
            if (err || !foundCampground)
            {
                console.log('error', 'Sorry, that campground does not exist!');
                return res.redirect('/campgrounds');
            }
            console.log(foundCampground);
            // render show template with that
            res.render({ campground: foundCampground });
        });
});

// EDIT - shows edit form for a campground
router.get('/:id/edit', isLoggedIn, checkUserCampground, (req, res) => {
    // render edit form with that campgorund
    res.render('campgrounds/edit', { campground: req.campground });
});

// PUT - updates campground in the DB
router.put('/:id', (req, res) => {
    var newData = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    }
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, { $set: newData }, (err, campground) => {
        if (err)
        {
            req.flash('error', err.message);
            res.redirect('back');
        } else 
        {
            // redirect somewhere (show page)
            req.flash('success', 'Successfully Updated!');
            res.redirect('/campgrounds/' + campground._id);
        }
    });
});

// DELETE - removes campground and its comments from the DB
router.delete('/:id', isLoggedIn, checkUserCampground, (req, res) => {
    Comment.remove({
        _id: {
            $in: req.campground.comments
        }
    }, (err) => {
        if (err)
        {
            req.flash('error', err.message);
            res.redirect('/');
        } else
        {
            req.campground.remove((err) => {
                if (err)
                {
                    req.flash('error', err.message);
                    return res.redirect('/');
                }
                req.flash('error', 'Campground deleted!');
                res.redirect('/campgrounds');
            });
        }
    });
});

module.exports = router;