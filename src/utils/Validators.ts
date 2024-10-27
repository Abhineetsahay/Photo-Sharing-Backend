import { check } from "express-validator";

export const registerValidation = [
  check('username', 'Username is required').not().isEmpty().optional(),
  check('email', 'Please provide a valid email').isEmail(),
  check('password', 'Password should be at least 6 characters').isLength({ min: 6 })
];
