import * as authService from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const result = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const result = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const result = await authService.changePassword(req.user.id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

