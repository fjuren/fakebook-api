/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable import/no-extraneous-dependencies */
// Randomly generated data for Users, Posts, & Comments. Data created and then stored in local mongodb

import * as dotenv from 'dotenv';
dotenv.config();
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import PostsModelling from './src/models/posts.model';
import CommentsModelling from './src/models/comments.model';
import UsersModelling from './src/models/users.model';

const users: any = [];
const posts: any = [];
const comments: any = [];

const uri = process.env.MONGO_URI!;

async function main() {
  await mongoose.connect(uri);
}
main().catch((err) => {
  console.log(err);
});

const seedUsers = () => {
  for (let u = 0; u < 100; u++) {
    const fakeUser = new UsersModelling({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(20, true),
      friendRequest: [],
      userRequests: [],
      posts: [],
      comments: [],
      avatar: faker.internet.avatar(),
      accountCreated: faker.date.between(
        '2015-01-01T00:00:00.000Z',
        '2023-01-01T00:00:00.000Z'
      ),
    });
    users.push(fakeUser);
  }
};

const seedComments = (fakeUser: any) => {
  for (let u = 0; u < 1; u++) {
    const fakeComment = new CommentsModelling({
      content: faker.lorem.sentence(),
      userLikes: [],
      user: fakeUser.id,
      commentCreated: faker.date.between(
        '2015-01-01T00:00:00.000Z',
        '2023-01-01T00:00:00.000Z'
      ),
    });
    comments.push(fakeComment);
    fakeUser.comments.push(fakeComment);
  }
  // Add comment data to user
  // fakeUser.comments?.push(fakeComment.id);
};

const seedPosts = (fakeUser: any) => {
  for (let p = 0; p < 1; p++) {
    const fakePost = new PostsModelling({
      content: faker.lorem.paragraph(),
      image: faker.internet.avatar(),
      likes: [],
      user: fakeUser.id,
      comments: [],
      postCreated: faker.date.between(
        '2015-01-01T00:00:00.000Z',
        '2023-01-01T00:00:00.000Z'
      ),
    });
    posts.push(fakePost);
    fakeUser.posts.push(fakePost);
  }
};

const populateDB = async () => {
  seedUsers();

  try {
    users.forEach(async (user: any) => {
      seedComments(user);
      seedPosts(user);
      try {
        await user.save();
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    });

    posts.forEach(async (post: any) => {
      try {
        await post.save();
        console.log(post);
      } catch (error) {
        console.log(error);
      }
    });

    comments.forEach(async (comment: any) => {
      try {
        await comment.save();
        console.log(comment);
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

populateDB()
  .then(() => console.log('Database seeded with fresh post data!'))
  .catch((error) => console.log(error));

export default populateDB;
