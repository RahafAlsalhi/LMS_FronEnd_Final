import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Video,
  FileText,
  HelpCircle,
  Upload,
  Trash2,
  Edit,
  Save,
  X,
} from "lucide-react";

const CreateCourse = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdCourseId, setCreatedCourseId] = useState(null);

  // Course data
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category_id: "",
    price: 0,
    thumbnail_url: "",
  });

  // Content data
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      description: "Course title and pricing",
      icon: FileText,
    },
    {
      id: 2,
      title: "Course Details",
      description: "Description and category",
      icon: Edit,
    },
    {
      id: 3,
      title: "Course Structure",
      description: "Add modules and organize content",
      icon: Plus,
    },
    {
      id: 4,
      title: "Add Content",
      description: "Create lessons, assignments, and quizzes",
      icon: Video,
    },
    {
      id: 5,
      title: "Review & Publish",
      description: "Final review and publish",
      icon: Check,
    },
  ];

  useEffect(() => {
    // Use hardcoded categories for testing
    console.log("Using hardcoded categories for testing");
    setCategories([
      { id: "1", name: "Programming" },
      { id: "2", name: "Design" },
      { id: "3", name: "Business" },
      { id: "4", name: "Languages" },
      { id: "5", name: "Science" },
      { id: "6", name: "Arts" },
    ]);

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");

      const response = await fetch("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Categories loaded:", data);
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Keep hardcoded categories as fallback
    }
  };

  const handleCourseDataChange = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleNext = async () => {
    if (activeStep === 1 && !createdCourseId) {
      await createCourse();
    } else if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!courseData.title.trim()) {
          setError("Course title is required");
          return false;
        }
        return true;
      case 1:
        if (!courseData.description.trim()) {
          setError("Course description is required");
          return false;
        }
        if (!courseData.category_id) {
          setError("Please select a category");
          return false;
        }
        return true;
      case 2:
        if (modules.length === 0) {
          setError("Please add at least one module to your course");
          return false;
        }
        return true;
      case 3:
        const hasContent = modules.some(
          (module) => module.lessons && module.lessons.length > 0
        );
        if (!hasContent) {
          setError("Please add at least one lesson to your modules");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const createCourse = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        const result = await response.json();
        setCreatedCourseId(result.id);
        setActiveStep(2);
      } else {
        throw new Error("Failed to create course");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addModule = async (moduleData) => {
    try {
      const response = await fetch("http://localhost:5000/api/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          course_id: createdCourseId,
          ...moduleData,
        }),
      });

      if (response.ok) {
        const newModule = await response.json();
        newModule.lessons = [];
        setModules((prev) => [...prev, newModule]);
        setShowModuleForm(false);
      }
    } catch (error) {
      setError("Failed to add module");
    }
  };

  // Replace your entire addLesson function with this:
  const addLesson = async (lessonData, videoFile) => {
    console.log("addLesson called with:", lessonData);
    console.log("videoFile:", videoFile);

    try {
      const formData = new FormData();

      // Add all lesson data to FormData
      Object.keys(lessonData).forEach((key) => {
        formData.append(key, lessonData[key]);
      });

      // Add video file if provided
      if (videoFile) {
        formData.append("video", videoFile);
        console.log("📹 Adding video file:", videoFile.name);
      }

      console.log("📤 Sending FormData to server...");

      const response = await fetch("http://localhost:5000/api/lessons", {
        method: "POST",
        headers: {
          // ❌ DO NOT SET Content-Type - let browser set it for FormData
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData, // ✅ Send FormData instead of JSON
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const newLesson = await response.json();
        console.log("✅ New lesson created:", newLesson);
        newLesson.assignments = [];
        newLesson.quizzes = [];

        setModules((prev) =>
          prev.map((module) =>
            module.id === lessonData.module_id
              ? {
                  ...module,
                  lessons: [...(module.lessons || []), newLesson],
                }
              : module
          )
        );
        setShowLessonForm(false);
        setError(""); // Clear any previous errors
      } else {
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
        setError(`Failed to add lesson: ${errorData.message}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setError("Failed to add lesson: " + error.message);
    }
  };
  const addQuiz = async (quizData) => {
    try {
      console.log("Creating quiz with data:", quizData);

      const response = await fetch("http://localhost:5000/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(quizData),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Quiz created:", result);

        // Update the specific lesson with the new quiz
        setModules((prev) =>
          prev.map((module) => ({
            ...module,
            lessons:
              module.lessons?.map((lesson) =>
                lesson.id === quizData.lesson_id
                  ? {
                      ...lesson,
                      quizzes: [...(lesson.quizzes || []), result],
                    }
                  : lesson
              ) || [],
          }))
        );
        setShowQuizForm(false);
        setError("");
      } else {
        const errorData = await response.json();
        console.error("Quiz creation failed:", errorData);
        setError(errorData.message || "Failed to add quiz");
      }
    } catch (error) {
      console.error("Quiz creation error:", error);
      setError(`Failed to add quiz: ${error.message}`);
    }
  };

  const addAssignment = async (assignmentData) => {
    try {
      console.log("Creating assignment with data:", assignmentData);

      const response = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          lesson_id: assignmentData.lesson_id,
          title: assignmentData.title,
          description: assignmentData.description,
          deadline: assignmentData.deadline,
          max_points: assignmentData.max_points,
        }),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Assignment created:", result);

        // Update the specific lesson with the new assignment
        setModules((prev) =>
          prev.map((module) => ({
            ...module,
            lessons:
              module.lessons?.map((lesson) =>
                lesson.id === assignmentData.lesson_id
                  ? {
                      ...lesson,
                      assignments: [...(lesson.assignments || []), result],
                    }
                  : lesson
              ) || [],
          }))
        );
        setShowAssignmentForm(false);
        setError("");
      } else {
        const errorData = await response.json();
        console.error("Assignment creation failed:", errorData);
        setError(errorData.message || "Failed to add assignment");
      }
    } catch (error) {
      console.error("Assignment creation error:", error);
      setError(`Failed to add assignment: ${error.message}`);
    }
  };

  const publishCourse = async () => {
    setLoading(true);
    try {
      setSuccess("Course created and submitted for admin approval!");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      setError("Failed to finalize course");
    } finally {
      setLoading(false);
    }
  };

  // Form Components
  // Fixed ModuleForm Component
  const ModuleForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({ title: "", description: "" });

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Module form submitted with:", formData);
      onSubmit(formData); // Just pass formData, nothing else
      setFormData({ title: "", description: "" });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Add Module</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Module Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Module
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  const LessonForm = ({ moduleId, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
      title: "",
      content_type: "video",
      content_text: "",
      duration: 0,
    });
    const [videoFile, setVideoFile] = useState(null);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ ...formData, module_id: moduleId }, videoFile);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Add Lesson</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Lesson Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Content Type
              </label>
              <select
                value={formData.content_type}
                onChange={(e) =>
                  setFormData({ ...formData, content_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="video">Video</option>
                <option value="text">Text</option>
                <option value="document">Document</option>
              </select>
            </div>
            {formData.content_type === "video" && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Video File
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Content Text
              </label>
              <textarea
                value={formData.content_text}
                onChange={(e) =>
                  setFormData({ ...formData, content_text: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Lesson
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AssignmentForm = ({ lessonId, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      deadline: "",
      max_points: 100,
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ ...formData, lesson_id: lessonId });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Add Assignment</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Assignment Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Max Points
              </label>
              <input
                type="number"
                value={formData.max_points}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_points: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const QuizForm = ({ lessonId, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correct_answer: 0,
      points: 1,
    });

    const handleSubmit = (e) => {
      e.preventDefault();

      // Validate that all options are filled
      if (
        !formData.option1 ||
        !formData.option2 ||
        !formData.option3 ||
        !formData.option4
      ) {
        alert("Please fill in all answer options");
        return;
      }

      // Create options array from individual inputs
      const options = [
        formData.option1,
        formData.option2,
        formData.option3,
        formData.option4,
      ];

      const quizData = {
        lesson_id: lessonId,
        question: formData.question,
        options: options,
        correct_answer: formData.correct_answer,
        points: formData.points,
      };

      onSubmit(quizData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Add Quiz Question</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Question */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Question *
              </label>
              <textarea
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your question here..."
                required
              />
            </div>

            {/* Answer Options */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Answer Options *
              </label>

              {/* Option 1 */}
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct_answer"
                    value={0}
                    checked={formData.correct_answer === 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        correct_answer: parseInt(e.target.value),
                      })
                    }
                    className="text-blue-600"
                  />
                  <input
                    type="text"
                    value={formData.option1}
                    onChange={(e) =>
                      setFormData({ ...formData, option1: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Option A"
                    required
                  />
                </div>
              </div>

              {/* Option 2 */}
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct_answer"
                    value={1}
                    checked={formData.correct_answer === 1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        correct_answer: parseInt(e.target.value),
                      })
                    }
                    className="text-blue-600"
                  />
                  <input
                    type="text"
                    value={formData.option2}
                    onChange={(e) =>
                      setFormData({ ...formData, option2: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Option B"
                    required
                  />
                </div>
              </div>

              {/* Option 3 */}
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct_answer"
                    value={2}
                    checked={formData.correct_answer === 2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        correct_answer: parseInt(e.target.value),
                      })
                    }
                    className="text-blue-600"
                  />
                  <input
                    type="text"
                    value={formData.option3}
                    onChange={(e) =>
                      setFormData({ ...formData, option3: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Option C"
                    required
                  />
                </div>
              </div>

              {/* Option 4 */}
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct_answer"
                    value={3}
                    checked={formData.correct_answer === 3}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        correct_answer: parseInt(e.target.value),
                      })
                    }
                    className="text-blue-600"
                  />
                  <input
                    type="text"
                    value={formData.option4}
                    onChange={(e) =>
                      setFormData({ ...formData, option4: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Option D"
                    required
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Select the radio button next to the correct answer
              </p>
            </div>

            {/* Points */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    points: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Basic Course Information
              </h3>
              <p className="text-gray-600 mb-6">
                Let's start with the fundamentals of your course.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) =>
                  handleCourseDataChange("title", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a clear, descriptive title for your course"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Price (USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={courseData.price}
                  onChange={(e) =>
                    handleCourseDataChange(
                      "price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Course Details
              </h3>
              <p className="text-gray-600 mb-6">
                Provide detailed information about your course.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description *
              </label>
              <textarea
                rows={5}
                value={courseData.description}
                onChange={(e) =>
                  handleCourseDataChange("description", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what students will learn in this course..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={courseData.category_id}
                onChange={(e) =>
                  handleCourseDataChange("category_id", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL (Optional)
              </label>
              <input
                type="url"
                value={courseData.thumbnail_url}
                onChange={(e) =>
                  handleCourseDataChange("thumbnail_url", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Course Structure
                </h3>
                <p className="text-gray-600">
                  Organize your course into modules
                </p>
              </div>
              <button
                onClick={() => setShowModuleForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Module
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No modules yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first module to organize your course content
                </p>
                <button
                  onClick={() => setShowModuleForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create First Module
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {index + 1}. {module.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {module.lessons?.length || 0} lessons
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showModuleForm && (
              <ModuleForm
                onSubmit={addModule}
                onClose={() => setShowModuleForm(false)}
              />
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Add Content to Modules
              </h3>
              <p className="text-gray-600 mb-6">
                Add lessons and assignments to your modules.
              </p>
            </div>

            <div className="space-y-6">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="border border-gray-200 rounded-lg"
                >
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">
                      {module.title}
                    </h4>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => {
                          setCurrentModule(module.id);
                          setShowLessonForm(true);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        <Video size={14} />
                        Add Lesson
                      </button>
                    </div>

                    {/* Display existing content */}
                    <div className="space-y-3">
                      {module.lessons?.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="border-l-4 border-green-500 pl-4 bg-gray-50 p-3 rounded"
                        >
                          {/* Lesson header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Video size={16} className="text-green-600" />
                              <span className="font-medium text-gray-800">
                                {lesson.title}
                              </span>
                              {lesson.content_type === "video" && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Video
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setCurrentLesson(lesson.id);
                                setShowAssignmentForm(true);
                              }}
                              className="flex items-center gap-1 px-2 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
                            >
                              <FileText size={12} />
                              Add Assignment
                            </button>
                            <button
                              onClick={() => {
                                setCurrentLesson(lesson.id);
                                setShowQuizForm(true);
                              }}
                              className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                            >
                              <HelpCircle size={12} />
                              Add Quiz
                            </button>
                          </div>

                          {/* Show assignments for this lesson */}
                          {lesson.assignments?.length > 0 && (
                            <div className="ml-6 space-y-1">
                              {lesson.assignments.map((assignment) => (
                                <div
                                  key={assignment.id}
                                  className="flex items-center gap-2 text-sm text-gray-600"
                                >
                                  <FileText
                                    size={12}
                                    className="text-orange-600"
                                  />
                                  <span>Assignment: {assignment.title}</span>
                                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                    {assignment.max_points} pts
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          {lesson.quizzes?.length > 0 && (
                            <div className="ml-6 space-y-1">
                              {lesson.quizzes.map((quiz) => (
                                <div
                                  key={quiz.id}
                                  className="flex items-center gap-2 text-sm text-gray-600"
                                >
                                  <HelpCircle
                                    size={12}
                                    className="text-purple-600"
                                  />
                                  <span>
                                    Quiz: {quiz.question.substring(0, 50)}...
                                  </span>
                                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    {quiz.points} pts
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )) || []}
                    </div>
                    {/* Show quizzes for this lesson */}

                    {(!module.lessons || module.lessons.length === 0) && (
                      <div className="text-sm text-gray-500 italic">
                        No lessons added yet. Add lessons first, then you can
                        add assignments to specific lessons.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {showLessonForm && (
              <LessonForm
                moduleId={currentModule}
                onSubmit={addLesson}
                onClose={() => {
                  setShowLessonForm(false);
                  setCurrentModule(null);
                }}
              />
            )}

            {showAssignmentForm && (
              <AssignmentForm
                lessonId={currentLesson}
                onSubmit={addAssignment}
                onClose={() => {
                  setShowAssignmentForm(false);
                  setCurrentLesson(null);
                }}
              />
            )}
            {showQuizForm && (
              <QuizForm
                lessonId={currentLesson}
                onSubmit={addQuiz}
                onClose={() => {
                  setShowQuizForm(false);
                  setCurrentLesson(null);
                }}
              />
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Review & Submit
              </h3>
              <p className="text-gray-600 mb-6">
                Review your complete course before submitting for approval.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-800 mb-3">
                {courseData.title}
              </h4>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {courseData.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-700">Category</span>
                  </div>
                  <p className="text-gray-600">
                    {
                      categories.find((c) => c.id === courseData.category_id)
                        ?.name
                    }
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <span className="w-5 h-5 text-green-600 mr-2">💰</span>
                    <span className="font-medium text-gray-700">Price</span>
                  </div>
                  <p className="text-gray-600">
                    {courseData.price === 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Free Course
                      </span>
                    ) : (
                      <span className="text-xl font-bold text-green-600">
                        ${courseData.price}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-semibold text-gray-800">
                  Course Content Summary:
                </h5>
                {modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <h6 className="font-medium text-gray-900 mb-2">
                      Module {index + 1}: {module.title}
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Video size={14} className="text-green-600" />
                        <span>{module.lessons?.length || 0} Lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-orange-600" />
                        <span>
                          {module.lessons?.reduce(
                            (total, lesson) =>
                              total + (lesson.assignments?.length || 0),
                            0
                          ) || 0}{" "}
                          Assignments
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HelpCircle size={14} className="text-purple-600" />
                        <span>
                          {module.lessons?.reduce(
                            (total, lesson) =>
                              total + (lesson.quizzes?.length || 0),
                            0
                          ) || 0}{" "}
                          Quizzes
                        </span>
                      </div>
                    </div>

                    {/* Show lesson details */}
                    {module.lessons?.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="mt-3 pl-4 border-l-2 border-gray-200"
                      >
                        <div className="text-sm text-gray-600 mb-1">
                          Lesson {lessonIndex + 1}: {lesson.title}
                          {lesson.assignments?.length > 0 && (
                            <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              {lesson.assignments.length} assignment
                              {lesson.assignments.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Check className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">
                    Ready to Submit for Approval
                  </span>
                </div>
                <p className="text-blue-700 text-sm">
                  Your course is complete with {modules.length} modules and all
                  necessary content. It will be submitted for admin approval and
                  students will be able to enroll once approved.
                </p>
              </div>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <Check className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-green-800 font-medium">
                    Course Submitted Successfully!
                  </span>
                </div>
                <p className="text-green-700 mb-4">
                  Your course has been created and submitted for admin approval.
                  You'll be notified once it's approved and live for students to
                  enroll.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Complete Course
          </h1>
          <p className="text-gray-600">
            Build your course step by step with content, modules, and
            assessments
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Progress Steps */}
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                          index <= activeStep
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {index < activeStep ? (
                          <Check size={20} />
                        ) : (
                          <StepIcon size={20} />
                        )}
                      </div>
                      <div className="ml-3 hidden sm:block">
                        <p
                          className={`text-sm font-medium ${
                            index <= activeStep
                              ? "text-gray-800"
                              : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`hidden sm:block w-16 h-0.5 mx-4 transition-colors ${
                          index < activeStep ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Alerts */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <X className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Step Content */}
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                activeStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft size={16} />
              Back
            </button>

            <div className="flex items-center space-x-3">
              {activeStep === steps.length - 1 ? (
                <button
                  onClick={publishCourse}
                  disabled={loading || success}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : success ? (
                    <>
                      <Check size={16} />
                      <span>Submitted!</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span>Submit for Approval</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center gap-2"
                >
                  {loading && activeStep === 1 ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Course...</span>
                    </>
                  ) : (
                    <>
                      <span>Next Step</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
