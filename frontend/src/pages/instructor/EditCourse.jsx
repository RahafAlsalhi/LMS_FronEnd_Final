import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  ArrowLeft,
} from "lucide-react";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  useEffect(() => {
    fetchCourseData();
    fetchCategories();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/courses/categories/all",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/courses/${id}/edit-details`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(id);

      if (response.ok) {
        const result = await response.json();
        const course = result.course;

        setCourseData({
          title: course.title || "",
          description: course.description || "",
          category_id: course.category_id || "",
          price: course.price || 0,
        });

        setModules(course.modules || []);
      } else {
        setError("Failed to load course data");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      setError("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseDataChange = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const saveCourseBasicInfo = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        setSuccess("Course information updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error("Failed to update course");
      }
    } catch (error) {
      setError("Failed to update course: " + error.message);
    } finally {
      setSaving(false);
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
          course_id: id,
          ...moduleData,
        }),
      });

      if (response.ok) {
        const newModule = await response.json();
        newModule.lessons = [];
        setModules((prev) => [...prev, newModule]);
        setShowModuleForm(false);
        setSuccess("Module added successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError("Failed to add module");
    }
  };

  const addLesson = async (lessonData, videoFile) => {
    try {
      const formData = new FormData();
      Object.keys(lessonData).forEach((key) => {
        formData.append(key, lessonData[key]);
      });
      if (videoFile) {
        formData.append("video", videoFile);
      }

      const response = await fetch("http://localhost:5000/api/lessons", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newLesson = await response.json();
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
        setSuccess("Lesson added successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setError("");
      } else {
        const errorData = await response.json();
        setError(`Failed to add lesson: ${errorData.message}`);
      }
    } catch (error) {
      setError("Failed to add lesson: " + error.message);
    }
  };

  const addAssignment = async (assignmentData) => {
    try {
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

      if (response.ok) {
        const result = await response.json();
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
        setSuccess("Assignment added successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add assignment");
      }
    } catch (error) {
      setError(`Failed to add assignment: ${error.message}`);
    }
  };

  const addQuiz = async (quizData) => {
    try {
      const response = await fetch("http://localhost:5000/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(quizData),
      });

      if (response.ok) {
        const result = await response.json();
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
        setSuccess("Quiz added successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add quiz");
      }
    } catch (error) {
      setError(`Failed to add quiz: ${error.message}`);
    }
  };

  // Form Components (reuse from CreateCourse)
  const ModuleForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({ title: "", description: "" });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      setFormData({ title: "", description: "" });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
      if (
        !formData.option1 ||
        !formData.option2 ||
        !formData.option3 ||
        !formData.option4
      ) {
        alert("Please fill in all answer options");
        return;
      }

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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Answer Options *
              </label>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_answer"
                      value={index}
                      checked={formData.correct_answer === index}
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
                      value={formData[`option${index + 1}`]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`option${index + 1}`]: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      required
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-2">
                Select the radio button next to the correct answer
              </p>
            </div>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 mt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Course</h1>
              <p className="text-gray-600">
                Update your course content and information
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Basic Information */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Course Information
              </h2>
              <button
                onClick={saveCourseBasicInfo}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
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
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={courseData.description}
                  onChange={(e) =>
                    handleCourseDataChange("description", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your course"
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
                  Price (USD)
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail URL
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
          </div>

          {/* Course Structure */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Course Structure
              </h2>
              <button
                onClick={() => setShowModuleForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create First Module
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
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
                      <button
                        onClick={() => {
                          setCurrentModule(module.id);
                          setShowLessonForm(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        <Plus size={12} />
                        Lesson
                      </button>
                    </div>

                    <div className="text-sm text-gray-500 mb-2">
                      {module.lessons?.length || 0} lessons,{" "}
                      {module.lessons?.reduce(
                        (total, lesson) =>
                          total + (lesson.assignments?.length || 0),
                        0
                      ) || 0}{" "}
                      assignments,{" "}
                      {module.lessons?.reduce(
                        (total, lesson) =>
                          total + (lesson.quizzes?.length || 0),
                        0
                      ) || 0}{" "}
                      quizzes
                    </div>

                    {/* Show lessons */}
                    {module.lessons?.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="bg-gray-50 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Video size={14} className="text-blue-600" />
                                <span className="text-sm font-medium">
                                  {lesson.title}
                                </span>
                                {lesson.content_type === "video" && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Video
                                  </span>
                                )}
                                {lesson.content_url && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    Has Media
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    setCurrentLesson(lesson.id);
                                    setShowAssignmentForm(true);
                                  }}
                                  className="flex items-center gap-1 px-2 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
                                >
                                  <FileText size={10} />
                                  Assignment
                                </button>
                                <button
                                  onClick={() => {
                                    setCurrentLesson(lesson.id);
                                    setShowQuizForm(true);
                                  }}
                                  className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                                >
                                  <HelpCircle size={10} />
                                  Quiz
                                </button>
                              </div>
                            </div>

                            {/* Show assignments and quizzes */}
                            {(lesson.assignments?.length > 0 ||
                              lesson.quizzes?.length > 0) && (
                              <div className="mt-2 space-y-1">
                                {lesson.assignments?.map((assignment) => (
                                  <div
                                    key={assignment.id}
                                    className="flex items-center gap-2 text-xs text-gray-600"
                                  >
                                    <FileText
                                      size={10}
                                      className="text-orange-600"
                                    />
                                    <span>Assignment: {assignment.title}</span>
                                    <span className="bg-orange-100 text-orange-800 px-1 py-0.5 rounded">
                                      {assignment.max_points} pts
                                    </span>
                                  </div>
                                ))}
                                {lesson.quizzes?.map((quiz) => (
                                  <div
                                    key={quiz.id}
                                    className="flex items-center gap-2 text-xs text-gray-600"
                                  >
                                    <HelpCircle
                                      size={10}
                                      className="text-purple-600"
                                    />
                                    <span>
                                      Quiz: {quiz.question.substring(0, 30)}...
                                    </span>
                                    <span className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded">
                                      {quiz.points} pts
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showModuleForm && (
          <ModuleForm
            onSubmit={addModule}
            onClose={() => setShowModuleForm(false)}
          />
        )}

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
    </div>
  );
};

export default EditCourse;
