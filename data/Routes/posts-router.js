
const router = require("express").Router();

const Posts = require("../db")
// returns an array of all post objects in DB
router.get("/", (req, res) => {
    Posts.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error retrieving the posts"
            });       
        });
});
// GET posts by post ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
    Posts.findById(id)
        .then(post => {
          if (post) {
            res.status(200).json(post);
          } else {
              res.status(404).json({
                  message: "The post with the specified ID does not exist."
              });
          }
        })
        .catch(error => {
            console.log(500).json({
                message: "The post information could not be retrieved."
            });
        });
});
//GET array of all comments objects associated with specific post ID
router.get("/:id/comments", (req, res) => {
    const id = req.params.id;
      Posts.findCommentById(id)
        .then(idcom => {
            if (idcom) {
                res.status(200).json(idcom);
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                });
            }
          })
          .catch(error => {
              console.log(500).json({
                  message: "The comments information could not be retrieved."
              });
          });   
});
//POST creates a post using the info sent inside req.body
router.post("/", (req, res) => {
    const { title, contents } = req.body;
    if (title && contents) {
    Posts.insert(req.body)
        .then(ins => {
            res.status(201).json(ins);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "There was an error while saving the post to the database"
            });
        })
    } else {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        });
    }
});
// POST creates a comment for the post with specified ID using info sent inside of req.body
router.post("/:id/comments", (req, res) => {
    const { text } = req.body;
    const id = req.params.id;
        if (!text) {
                req.status(400).json({
                    message: "Please provide text for the comment."});
        }
              
        if (!id) {
                req.status(400).json({
                    message: "The post with the specified ID does not exist."});
        }
    Posts.findById(id)
        .then(pstid => {
            if (pstid.length < 1){
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                Posts.insertComment(text)
                    .then(insrt => {
                        console.log(insrt);
                        res.status(201).json(text);
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(500).json({
                            error: "There was an error while saving the comment to the database"
                        });
                    });
            }
        });  
});
//DELETE removes the post with secific ID
router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
    .then(remove => {
      if (remove)
        res.status(200).json(remove);
       else 
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The post could not be removed"
      });
    });
  });
// UPDATE the post with a specific ID returns modified doc.
router.put('/:id', (req, res) => {
    const newPost = req.body;
    const id = req.params.id;
    Posts.update(id, newPost)
    .then(pst => {
      if (pst) {
        res.status(200).json(pst);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The post information could not be modified."
      });
    });
  });


//


module.exports = router;