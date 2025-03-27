import { createUser, findUserByEmail } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validasi input
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Cek apakah email atau username sudah terdaftar
  const existingUserByEmail = await findUserByEmail(email);
  const existingUserByUsername = await findUserByUsername(username);

  if (existingUserByEmail || existingUserByUsername) {
    return res.status(400).json({ message: 'Email or username already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buat user baru
  try {
    const user = await createUser(username, email, hashedPassword);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Cek apakah user ada
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Cek password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Generate JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ message: 'Login successful', token });
};