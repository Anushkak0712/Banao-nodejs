const express=require('express')
const router=express.Router()
const fs = require('fs');
const path = require('path');
const auth=require('./auth')

const postsFile = path.join(__dirname, './posts.json');

const readPostsFile= ()=>{
    const data = fs.readFileSync(postsFile,'utf8');
    return JSON.parse(data);
};

const writePostsFile= (data)=>{
    fs.writeFileSync(postsFile, JSON.stringify(data, null, 2));
};

const generateId = (posts) => {
    const maxId = posts.reduce((max, post) => (post.id > max ? post.id : max), 0);
    return maxId + 1;
  };

router.get('/all',auth.isLoggedIn,(req,res)=>{
    const posts=readPostsFile();
    const page=Number(req.query.page)||1;
    const limit=Number(req.query.limit)||5;
    const skip=(page-1)*limit;
    const paginated_posts=posts.slice(skip,skip+limit);
    res.status(200).json({
        posts:paginated_posts
    })
})

router.get('/:id',auth.isLoggedIn,(req,res)=>{
    const posts=readPostsFile();
    const post=posts.find(post=>post.id==req.params.id);
    if(post){
        res.status(200).json(post)
        }else{
            res.status(404).json({message:"Post not found"})
            }
})
router.post('/add',auth.isLoggedIn,(req,res)=>{
    const {content,hashtag}=req.body;
    const posts=readPostsFile();
    const username=req.user.username;
    const id=generateId(posts);
    try {
        posts.push({id,postedBy:username,postedAt:new Date(),content,hashtag,totalLikes:0,likedBy:[],comments:[]});
        writePostsFile(posts);
        res.status(201).json({
            message:'Post created successfully!'
        });
        
    }
     catch (error) {
        res.status(500).json({message:'error in posting',error});
        console.log(error)
    }

})
router.patch('/:id',auth.isLoggedIn, (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const username=req.user.username;
    const posts = readPostsFile();
    const postIndex = posts.findIndex((p) => p.id == id);
  
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }
  
    // Merge the existing post with the updates
    if (posts[postIndex].postedBy==username){
    const updatedPost = { ...posts[postIndex], ...updates };
    posts[postIndex] = updatedPost;
    writePostsFile(posts);
  
    res.json(updatedPost);}else{res.json({message:`user ${username} does not have editing rights for this post.`})}
  });
router.delete('/:id',auth.isLoggedIn, (req, res) => {
    const { id } = req.params;
    const username=req.user.username;
    const posts = readPostsFile();
    const postIndex = posts.findIndex((p) => p.id == id);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
      }
      if (posts[postIndex].postedBy==username){
      posts.splice(postIndex, 1);
      writePostsFile(posts);
    
      res.json({ message: 'Post deleted successfully' });}else{res.json({message:`user ${username} does not have editing rights for this post.`})}
    });
router.post('/like/:id',auth.isLoggedIn,(req,res)=>{
    const {id}=req.params;
    const posts=readPostsFile();
    const postIndex=posts.findIndex((p)=>p.id==id);
    if(postIndex===-1){
        return res.status(404).json({error:'Post not found'})
        }else{
            if (posts[postIndex].likedBy.includes(req.user.username)){
                return res.status(200).json({message:"post already liked by this user"})
            }
            posts[postIndex].totalLikes+=1;
            posts[postIndex].likedBy.push(req.user.username);
            writePostsFile(posts);
            return res.status(200).json({message:"post liked successfully",post:posts[postIndex]});
        }
})
router.post('/comment/:id',auth.isLoggedIn,(req,res)=>{
    const {id}=req.params;
    const comment_text=req.body.comment;
    const posts=readPostsFile();
    const postIndex=posts.findIndex((p)=>p.id==id);
    if(postIndex===-1){
        return res.status(404).json({error:'Post not found'})
        }else{
            posts[postIndex].comments.push({username:req.user.username,comment_text});
            writePostsFile(posts);
            return res.status(200).json({message:"comment added successfully",post:posts[postIndex]});
        }
})
router.get('/comments/:id',auth.isLoggedIn,(req,res)=>{
    const {id}=req.params;
    const posts=readPostsFile();
    const postIndex=posts.findIndex((p)=>p.id==id);
    if(postIndex===-1){
        return res.status(404).json({error:'Post not found'})
        }else{
            return res.status(200).json({comments:posts[postIndex].comments});
        }
})
module.exports=router;

/*Examples 

1. get all posts
 URL: http://localhost:5100/post/all

 
2. get post by id
 URL: http://localhost:5100/post/6
 
 
3. create post
 URL: http://localhost:5100/post/add
 
 body: 
 {
    "content":"this is my 8th post",
    "hashtag":["hashtag1","hashtag2"]
}
 
4. update post by id
 URL: http://localhost:5100/post/6
 
 body:
 {
    "content":"this is my new 6th post",
 }   
5. delete post
 URL: http://localhost:5100/post/6
 

 
6. like post
 URL: http://localhost:5100/post/5
 

 
7. comment on post
 URL: http://localhost:5100/post/5
 
 body:
 {
    "comment":"this is my first comment"
}

8. get all comments for a post by id
URL: http://localhost:5100/post/comments/5
 
*/ 