import PostsModelling from '../models/posts.model';

export const findAllPosts = async () => {
  const posts = await PostsModelling.find()
    .sort({ postCreated: 'desc' })
    .limit(10);
  return posts;
};
