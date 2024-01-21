# Fakebook API

## API

## Users

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

# Posts

| **Method** | **API Posts Endpoints**    | **Access**              | **Description**             |
| ---------- | -------------------------- | ----------------------- | --------------------------- |
| /GET       | /api/posts/timeline        | Protected               | Returns timeline posts      |
| /GET       | /api/posts/profile/:userID | Protected               | Returns user-specific posts |
| /POST      | /api/posts/create_post     | Protected               | Creates a new posts record  |
| /DELETE    | /api/posts/:postId         | Public (needs updating) | Deletes a post record       |
| /POST      | /api/posts/like_post       | Public (needs updating) | Adds/removes a post a like  |

# Comments

| **Method** | **API Comments Endpoints**   | **Access** | **Description**                  |
| ---------- | ---------------------------- | ---------- | -------------------------------- |
| /POST      | /api/comments/create_comment | Protected  | Adds comment to an existing post |
