# Photo-Sharing API

This API allows users to manage their profiles, follow/unfollow other users, upload posts, and handle authentication. Built with Express and MongoDB.

## Table of Contents

- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Authentication Routes](#authentication-routes)
- [Middleware](#middleware)
- [Utils](#utils)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables (e.g., MongoDB URI, JWT secret, etc.)
5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### User Routes

- `GET /user/:id`  
  Get user profile by ID.  
  **Authentication Required**

- `PUT /EditUserbio/:id`  
  Update user bio.  
  **Authentication Required**

- `PUT /EditProfilePic/:id`  
  Update user profile picture.  
  **Authentication Required**

- `GET /GetFollowers`  
  Get the list of followers for the authenticated user.  
  **Authentication Required**

- `GET /GetFollowing`  
  Get the list of users the authenticated user is following.  
  **Authentication Required**

- `POST /followUser`  
  Follow a user.  
  **query Parameters**: `{ "followUserId" }`  
  **Authentication Required**

- `POST /unfollowUser`  
  Unfollow a user.  
  **query Parameters**: `{ "unfollowUserId" }`  
  **Authentication Required**

- `POST /UploadPost`  
  Upload a post.  
  **query Parameters**:`{"caption"} `
  **Authentication Required**

- `POST /AddComment`  
  Add a comment to a post.  
  **query Parameters**:`{"postId","content"} `
  **Authentication Required**

- `DELETE /DeletePost`  
  Delete a post.  
  **query Parameters**:`{"postId"} `
  **Authentication Required**

- `DELETE /DeleteComment`  
  Delete a comment.  
  **query Parameters**:`{ "postId", "commentId" } `
  **Authentication Required**

### Authentication Routes

- `POST /register`  
  Register a new user.  
  **Body Parameters**: `{ "username": "<username>", "email": "<email>", "password": "<password>", "file": "<profile-picture-file>" }`

- `POST /login`  
  Log in a user.  
  **Body Parameters**: `{ "email": "<email>", "password": "<password>" }`

- `POST /logout`  
  Log out the authenticated user.  
  **Authentication Required**

## Middleware

- **authenticateToken**: Middleware to protect routes, ensuring that users are authenticated.
- **Multer**: Middleware for handling multipart/form-data, used for uploading files (like images) in requests.

## Utils

- **Cloudinary**: Utility functions for uploading and deleting images on Cloudinary. Used in user profile picture updates and post uploads.
- **Generate Token**: Utility for generating JSON Web Tokens (JWT) for user authentication.
- **Validators**: Contains validation logic for user inputs (like registration and login).