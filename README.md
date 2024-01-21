# Fakebook API

## API

# Users

| **Method** | **API Endpoint**                      | **Access** | **Description**                            |
| ---------- | ------------------------------------- | ---------- | ------------------------------------------ |
| /POST      | /api/users/signup                     | Public     | Create a new account                       |
| /POST      | /api/users/login                      | Public     | Login to app                               |
| /POST      | /api/users/logout                     | Protected  | Logout of app                              |
| /GET       | /api/update_profile_pic/:authedUserID | Protected  | View the user's profile picture            |
| /POST      | /api/update_profile_pic/:authedUserID | Protected  | Update the user's profile picture          |
| /POST      | /api/friend_request/:userID           | Protected  | Send another user a friend request         |
| /POST      | /api/friend_request_answer/           | Protected  | Accept a new friend request to friend list |
| /POST      | /api/unfriend/:userID                 | Protected  | Remove an existing friend from friend list |
| /GET       | /api/friends/                         | Protected  | Get a list of all existing friends         |
