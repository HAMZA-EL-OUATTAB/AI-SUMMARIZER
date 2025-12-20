const BASE_URL = "http://127.0.0.1:8000/api"; // <-- your FastAPI backend

export interface SignupParams {
  email: string;
  username: string;
  password: string;
  full_name: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  full_name?: string;
}

export interface UserProfile {
  email: string;
  username: string;
  full_name: string;
}

// -----------------
// AUTH APIs
// -----------------

// Signup
export async function signupUser(payload: SignupParams) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Signup failed");
  }

  return await res.json();
}

// Login
export async function loginUser(payload: LoginParams): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Login failed");
  }

  return await res.json();
}

// -----------------
// PROFILE APIs
// -----------------

// Fetch user profile
export async function fetchUserProfile(token: string): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return await res.json();
}

// Update user info
export async function updateUserProfile(
  token: string,
  payload: { username?: string; full_name?: string }
): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to update profile");
  }

  return await res.json();
}

// Update password
export async function updatePassword(
  token: string,
  payload: { old_password: string; new_password: string }
) {
  const res = await fetch(`${BASE_URL}/auth/profile/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to update password");
  }

  return await res.json();
}

// Delete account
export async function deleteAccount(token: string) {
  const res = await fetch(`${BASE_URL}/auth/profile`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to delete account");
  }

  return await res.json();
}
