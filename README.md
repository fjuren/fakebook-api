# Fakebook

Welcome to Fakebook - a fun and lighthearted take on a popular social networking site. Try the [live](https://social-personal-project.netlify.app/) site.

If you don't want to create your own account, use the "Log in with a test account" option on the login page

## Table of contents

- [API](#api)
- API [Users](#users)
- API [Posts](#posts)
- API [Comments](#comments)
- [Technologies User](#technologies-used)
- [Fakebook](#fakebook)
- [License](#license)

## API

### Users

| **Method** | **API Users Endpoints**                     | **Access** | **Description**                            |
| ---------- | ------------------------------------------- | ---------- | ------------------------------------------ |
| /POST      | /api/users/signup                           | Public     | Create a new account                       |
| /POST      | /api/users/login                            | Public     | Login to app                               |
| /POST      | /api/users/logout                           | Protected  | Logout of app                              |
| /GET       | /api/users/update_profile_pic/:authedUserID | Protected  | Returns the user's profile picture         |
| /POST      | /api/users/update_profile_pic/:authedUserID | Protected  | Update the user's profile picture          |
| /POST      | /api/users/friend_request/:userID           | Protected  | Send another user a friend request         |
| /POST      | /api/users/friend_request_answer/           | Protected  | Accept a new friend request to friend list |
| /POST      | /api/users/unfriend/:userID                 | Protected  | Remove an existing friend from friend list |
| /GET       | /api/users/friends/                         | Protected  | Returns a list of all existing friends     |

### Posts

| **Method** | **API Posts Endpoints**    | **Access**              | **Description**             |
| ---------- | -------------------------- | ----------------------- | --------------------------- |
| /GET       | /api/posts/timeline        | Protected               | Returns timeline posts      |
| /GET       | /api/posts/profile/:userID | Protected               | Returns user-specific posts |
| /POST      | /api/posts/create_post     | Protected               | Creates a new posts record  |
| /DELETE    | /api/posts/:postId         | Public (needs updating) | Deletes a post record       |
| /POST      | /api/posts/like_post       | Public (needs updating) | Adds/removes a post a like  |

### Comments

| **Method** | **API Comments Endpoints**   | **Access** | **Description**                  |
| ---------- | ---------------------------- | ---------- | -------------------------------- |
| /POST      | /api/comments/create_comment | Protected  | Adds comment to an existing post |

## Technologies Used

- Typescript
- Node
- Express
- MongoDB (database)
- Passport/Passport JWT (authentication)
- Firebase (file hosting)
- Hosted on Render (server hosting)

## Fakebook

This API supports [Fakebook](https://github.com/fjuren/fakebook-frontend.git) for server-side functionalities.

## License

This project is licensed under the [MIT License](LICENSE).
