import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/register", {
        user_name: username,
        user_email: useremail,
        password: password,
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMsg("Registration successful! You can now log in.");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMsg("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-300 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fadeIn"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent px-4 mb-6 text-center">
          Register
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={useremail}
          onChange={(e) => setUseremail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />

        {errorMsg && (
          <div className="text-red-600 text-sm mb-4 text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="text-green-600 text-sm mb-4 text-center">
            {successMsg}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-400 to-blue-400 text-white py-2 rounded-md transition hover:brightness-110"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
