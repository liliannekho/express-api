const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

//we are testing these routes below
router.post('/', userController.createUser)
router.post('/login', userController.loginUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.auth, userController.deleteUser)

module.exports = router

// the routes put in the user controllers and then ccall the function 


//req.body from the frontend // eg youtube you see all three things below
// {
//     userId,
//     commentBody,
//     postId
//   }
  
// {
//     body: String,
//     userId: (type: mongoose.Schema.Types.objectId, ref: 'User')
// }
  
// {
//     title: String,
//     body: String,
//     Comments: ({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'})
// }

//   const commentOnPost = async (req, res) => {
//       try {
//           const user = await User.findOne({ '_id': req.body.userId})
//           if(!user) throw new Error('No user found with the given id do you think they were deleted?')
//           const foundPost = await Post.findOne('_id': req.body.postId) 
//           if(foundPost) throw new Error('User was valid but there was no post found, was the post deleted?')
//           const comment = new Comment({body:req.body.commentBody})
//           foundPost.comments.push(comment._id)
//           await comment.save()
//           await foundPost.save()
//           res.status('201').json(comment)
  
//       } catch (error) {
//           res.status('400').json({ msg: 'Could not add comment to database', details: error.message})
//       }
//   }