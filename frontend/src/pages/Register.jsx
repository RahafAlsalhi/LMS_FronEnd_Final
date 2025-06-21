import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError } from "../store/slices/authSlice";

const Register = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return "Full name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (name.trim().length > 50) {
      return "Name must be less than 50 characters";
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      return "Name can only contain letters, spaces, hyphens, and apostrophes";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    if (email.length > 100) {
      return "Email must be less than 100 characters";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (password.length > 128) {
      return "Password must be less than 128 characters";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return "Password must contain at least one special character (@$!%*?&)";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    if (confirmPassword !== password) {
      return "Passwords do not match";
    }
    return "";
  };

  const validateTerms = (termsAccepted) => {
    if (!termsAccepted) {
      return "You must accept the Terms of Service and Privacy Policy";
    }
    return "";
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    errors.name = validateName(formData.name);
    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);
    errors.confirmPassword = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );
    errors.termsAccepted = validateTerms(termsAccepted);

    // Remove empty error messages
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    return errors;
  };

  // Real-time validation
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const errors = validateForm();
      setValidationErrors(errors);
    }
  }, [formData, touched, termsAccepted]);

  // Get password strength
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[@$!%*?&])/.test(password)) score++;

    if (score === 0)
      return { strength: "none", color: "bg-gray-200", text: "" };
    if (score <= 2)
      return { strength: "weak", color: "bg-red-500", text: "Weak" };
    if (score <= 3)
      return { strength: "fair", color: "bg-yellow-500", text: "Fair" };
    if (score <= 4)
      return { strength: "good", color: "bg-blue-500", text: "Good" };
    return { strength: "strong", color: "bg-green-500", text: "Strong" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      termsAccepted: true,
    });

    // Validate form
    const errors = validateForm();
    setValidationErrors(errors);

    // If there are validation errors, don't submit
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Submit form (keep original registration process)
    dispatch(registerUser(formData));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getInputClassName = (fieldName) => {
    const baseClass =
      "block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none transition-colors";
    const errorClass = "border-red-300 focus:ring-red-500 focus:border-red-500";
    const normalClass =
      "border-slate-200 focus:ring-blue-500 focus:border-blue-500";

    return `${baseClass} ${
      validationErrors[fieldName] && touched[fieldName]
        ? errorClass
        : normalClass
    }`;
  };

  const getPasswordInputClassName = (fieldName) => {
    const baseClass =
      "block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none transition-colors";
    const errorClass = "border-red-300 focus:ring-red-500 focus:border-red-500";
    const normalClass =
      "border-slate-200 focus:ring-blue-500 focus:border-blue-500";

    return `${baseClass} ${
      validationErrors[fieldName] && touched[fieldName]
        ? errorClass
        : normalClass
    }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e")`,
        }}
      ></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>

      <div
        className="w-full max-w-md relative z-10"
        style={{ paddingTop: "50px" }}
      >
        {/* Main Card */}
        <div className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-2xl font-semibold text-center text-slate-800 mb-2">
              Create Account
            </h2>
            <p className="text-center text-slate-600">
              Join thousands of learners worldwide
            </p>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {error && (
              <div className="flex items-center p-4 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className={`h-5 w-5 ${
                        validationErrors.name && touched.name
                          ? "text-red-400"
                          : "text-slate-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName("name")}
                    placeholder="Enter your full name"
                    aria-invalid={
                      validationErrors.name && touched.name ? "true" : "false"
                    }
                    aria-describedby={
                      validationErrors.name && touched.name
                        ? "name-error"
                        : undefined
                    }
                  />
                </div>
                {validationErrors.name && touched.name && (
                  <p
                    id="name-error"
                    className="mt-2 text-sm text-red-600 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className={`h-5 w-5 ${
                        validationErrors.email && touched.email
                          ? "text-red-400"
                          : "text-slate-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName("email")}
                    placeholder="Enter your email"
                    aria-invalid={
                      validationErrors.email && touched.email ? "true" : "false"
                    }
                    aria-describedby={
                      validationErrors.email && touched.email
                        ? "email-error"
                        : undefined
                    }
                  />
                </div>
                {validationErrors.email && touched.email && (
                  <p
                    id="email-error"
                    className="mt-2 text-sm text-red-600 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className={`h-5 w-5 ${
                        validationErrors.password && touched.password
                          ? "text-red-400"
                          : "text-slate-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getPasswordInputClassName("password")}
                    placeholder="Create a strong password"
                    aria-invalid={
                      validationErrors.password && touched.password
                        ? "true"
                        : "false"
                    }
                    aria-describedby={
                      validationErrors.password && touched.password
                        ? "password-error"
                        : "password-strength"
                    }
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div id="password-strength" className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{
                            width: `${
                              getPasswordStrength(formData.password)
                                .strength === "none"
                                ? 0
                                : getPasswordStrength(formData.password)
                                    .strength === "weak"
                                ? 20
                                : getPasswordStrength(formData.password)
                                    .strength === "fair"
                                ? 40
                                : getPasswordStrength(formData.password)
                                    .strength === "good"
                                ? 70
                                : 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      {passwordStrength.text && (
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.strength === "weak"
                              ? "text-red-600"
                              : passwordStrength.strength === "fair"
                              ? "text-yellow-600"
                              : passwordStrength.strength === "good"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        >
                          {passwordStrength.text}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {validationErrors.password && touched.password && (
                  <p
                    id="password-error"
                    className="mt-2 text-sm text-red-600 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className={`h-5 w-5 ${
                        validationErrors.confirmPassword &&
                        touched.confirmPassword
                          ? "text-red-400"
                          : "text-slate-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getPasswordInputClassName("confirmPassword")}
                    placeholder="Confirm your password"
                    aria-invalid={
                      validationErrors.confirmPassword &&
                      touched.confirmPassword
                        ? "true"
                        : "false"
                    }
                    aria-describedby={
                      validationErrors.confirmPassword &&
                      touched.confirmPassword
                        ? "confirm-password-error"
                        : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword &&
                  touched.confirmPassword && (
                    <p
                      id="confirm-password-error"
                      className="mt-2 text-sm text-red-600 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {validationErrors.confirmPassword}
                    </p>
                  )}
              </div>

              {/* Role Selection */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  I want to join as
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  <option value="student">Student - Learn new skills</option>
                  <option value="instructor">
                    Instructor - Teach and inspire
                  </option>
                </select>
              
              </div>

              {/* Terms and Conditions */}
              <div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={termsAccepted}
                    onChange={handleTermsChange}
                    onBlur={handleBlur}
                    className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mt-1 transition-colors ${
                      validationErrors.termsAccepted && touched.termsAccepted
                        ? "border-red-300 focus:ring-red-500"
                        : ""
                    }`}
                    aria-invalid={
                      validationErrors.termsAccepted && touched.termsAccepted
                        ? "true"
                        : "false"
                    }
                    aria-describedby={
                      validationErrors.termsAccepted && touched.termsAccepted
                        ? "terms-error"
                        : undefined
                    }
                  />
                  <label
                    htmlFor="termsAccepted"
                    className="ml-2 text-sm text-slate-600"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {validationErrors.termsAccepted && touched.termsAccepted && (
                  <p
                    id="terms-error"
                    className="mt-2 text-sm text-red-600 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {validationErrors.termsAccepted}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            {/* Sign In Link */}
            <div className="text-center text-sm text-slate-600">
              {"Already have an account? "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>© 2024 EduHikerz. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link
              to="/privacy"
              className="hover:text-slate-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-slate-700 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
