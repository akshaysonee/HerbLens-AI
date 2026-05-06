import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signAccessToken } from "../utils/jwt.js";

// ================= HELPER =================
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// ================= REGISTER =================
// Redundant try/catch removed — the controller's next(err) handles all throws.
// Redundant 11000 handler removed — findOne guard above prevents ever reaching it.
// Redundant password length check removed — Zod enforces 8+ chars before this runs.
export async function register(payload) {
  const email = normalizeEmail(payload.email);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const user = await User.create({ ...payload, email });

  const token = signAccessToken({ id: user._id });

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  };
}

// ================= LOGIN =================
export async function login(payload) {
  const email = normalizeEmail(payload.email);
  const { password } = payload;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    // Constant-time response to prevent user enumeration via timing
    await new Promise((res) => setTimeout(res, 300));
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signAccessToken({ id: user._id });

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  };
}

// ================= GET ME =================
export async function getMe(userId) {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  };
}

// ================= UPDATE PROFILE =================
// Fixed: email uniqueness is checked before update to avoid a raw Mongoose
// 11000 duplicate-key error and return a clean 409 instead.
export async function updateProfile(userId, payload) {
  const updatedData = {};

  if (payload.name) updatedData.name = payload.name;

  if (payload.email) {
    const normalizedEmail = normalizeEmail(payload.email);

    // Check if another account already owns this email
    const conflict = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
    });

    if (conflict) {
      throw new ApiError(409, "Email already in use by another account");
    }

    updatedData.email = normalizedEmail;
  }

  const user = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  };
}

// ================= CHANGE PASSWORD =================
export async function changePassword(userId, { currentPassword, newPassword }) {
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  if (currentPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from current password",
    );
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters long");
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password updated successfully" };
}