import Posts from '../models/posts.model';

export const findAllPosts = async () => {
  const posts = await Posts.find().sort({ postCreated: 'desc' }).limit(10);
  return posts;
};

export const createPost = async (
  content: string,
  image: string,
  user: string
) => {
  // TODO:
  //   [ ] Validate
  //   [ ] Sanitize

  const posts = new Posts({
    content: content,
    image: image,
    likes: [],
    user: user,
    comments: [],
    postCreate: Date.now,
  });

  posts.save(function (err) {
    if (err) return err;
  });

  return posts;
};
