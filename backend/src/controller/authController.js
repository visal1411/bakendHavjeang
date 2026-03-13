// src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE;

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const {
      name,
      phone,
      password,
      usertype,
      working_hours,
      mechanic_lat,
      mechanic_lng,
    } = req.body;

    if (!name || !phone || !password || !usertype) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        usertype,
        working_hours: usertype === "mechanic" ? working_hours : null,
        mechanic_lat: usertype === "mechanic" ? mechanic_lat : null,
        mechanic_lng: usertype === "mechanic" ? mechanic_lng : null,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        usertype: user.usertype,
        mechanic_lat: user.mechanic_lat,
        mechanic_lng: user.mechanic_lng,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid phone or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid phone or password" });
    }

    const token = jwt.sign(
      { id: user.id, usertype: user.usertype },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRE,
      },
    );
    const header = JSON.parse(
      Buffer.from(token.split(".")[0], "base64").toString(),
    );
    console.log("JWT Algorithm:", header.alg);

    res.json({
      message: "Login successful",
      token,
      algorithm: header.alg,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        usertype: user.usertype,
        working_hours: user.working_hours,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const checkSession = async (req, res) => {
  // If this controller runs, the token is already valid
  // because authenticateToken middleware passed
  res.status(200).json({
    authenticated: true,
    user: req.user,
  });
};

// ============================
// PROFILE: Get user profile (mechanic or customer)
// Minimal: only basic info for all users; mechanics get extra fields
// ============================
export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        phone: true,
        usertype: true,
        mechanic_lat: true,
        mechanic_lng: true,
        working_hours: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      usertype: user.usertype,
    };

    if (user.usertype === "mechanic") {
      profile.location = {
        lat: user.mechanic_lat ?? null,
        lng: user.mechanic_lng ?? null,
      };
      profile.working_hours = user.working_hours ?? null;
    }

    res.status(200).json({ message: "Profile fetched successfully", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// PROFILE: Update user profile
// ============================
export const updateProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    // Ensure user can only update their own profile
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone, working_hours, mechanic_lat, mechanic_lng } = req.body;

    // Build update data based on what's provided
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    if (user.usertype === "mechanic") {
      if (working_hours !== undefined) updateData.working_hours = working_hours;
      if (mechanic_lat !== undefined) updateData.mechanic_lat = mechanic_lat;
      if (mechanic_lng !== undefined) updateData.mechanic_lng = mechanic_lng;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const profile = {
      id: updatedUser.id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      usertype: updatedUser.usertype,
    };

    if (updatedUser.usertype === "mechanic") {
      profile.location = {
        lat: updatedUser.mechanic_lat ?? null,
        lng: updatedUser.mechanic_lng ?? null,
      };
      profile.working_hours = updatedUser.working_hours ?? null;
    }

    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
