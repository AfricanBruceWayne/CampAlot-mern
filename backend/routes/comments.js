const express     =   require("express");
const router      =   express.Router({mergeParams: true});
const Campground  =   require("../models/Campground");
const Comment     =   require("../models/Comment");
const middleware  =   require("../middleware");
const { isLoggedIn, checkUserComment, isAdmin } = middleware;

// Comments New
router.get('/new', isLoggedIn, (req, res) => {
    // find campgorund by id
    console.log(req.params.id);
    Campground.findById(req.params.id, (err,campground) => {
       if(err) 
       {
           console.log(err);
       } else 
       {
           // render show template with that campground
           res.render("comments/new", {campground: campground});
       }
    });
});

// Comments Create
router.post("/", isLoggedIn, (req, res) => {
    // lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
       if (err)
       {
           console.log(err);
           res.redirect("/campgrounds");
       } else 
       {
           Comment.create(req.body.comment, (err, comment) => {
               if (err)
               {
                   console.log(err);
               } else 
               {
                   // add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   // save comment
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   console.log(comment);
                   req.flash('success', 'Created a comment!');
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
    });
});

// COMMENT EDIT ROUTE
   router.get("/:commentId/edit", isLoggedIn, checkUserComment, (req, res) => 
   {
        res.render("comments/edit", {campground_id: req.params.id, comment: req.comment});   
    });
    
// COMMENT UPDATE ROUTE
router.put("/:commentId", isAdmin, (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, updatedComment) => {
        if (err)
        {
            console.log(err);
            res.render("edit");
        } else 
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:commentId", isLoggedIn, checkUserComment, (req, res) => {
    // find campground, remove comment from comments array, delete comment in db
    Campground.findByIdAndUpdate(req.params.id, {
        $pull: {
            comments: req.comment.id
        }
    }, (err) => {
        if (err)
        {
            console.log(err);
            req.flash('error', err.message);
            res.redirect('/');
        } else 
        {
            req.comment.remove((err) => {
                if (err) 
                {
                    req.flash('error', err.message);
                    return res.redirect('/');
                }
                req.flash('error', 'Comment deleted!');
                res.redirect("/campgrounds/" + req.params.id);
            });
        }
    });
});
    
module.exports = router;