import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Video,
  FileText,
  HelpCircle,
  Edit,
  Trash2,
  Save,
  Upload,
  Play,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const CourseManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeTab, setActiveTab] = useState("modules");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedModules, setExpandedModules] = useState(new Set());

  // Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const [courseRes, modulesRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch(`/api/modules/course/${courseId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      if (courseRes.ok && modulesRes.ok) {
        const courseData = await courseRes.json();
        const modulesData = await modulesRes.json();
        setCourse(courseData);
        setModules(modulesData);
      }
    } catch (err) {
      setError("Failed to fetch course data");
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const ModuleForm = ({ module, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      title: module?.title || "",
      description: module?.description || "",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      const url = module ? `/api/modules/${module.id}` : "/api/modules";
      const method = module ? "PUT" : "POST";

      const payload = module ? formData : { ...formData, course_id: courseId };

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          onSave();
          onClose();
          fetchCourseData();
        }
      } catch (err) {
        setError("Failed to save module");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">
            {module ? "Edit Module" : "Create Module"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
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
                {module ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const LessonForm = ({ lesson, moduleId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      title: lesson?.title || "",
      content_type: lesson?.content_type || "video",
      content_text: lesson?.content_text || "",
      duration: lesson?.duration || 0,
    });
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setUploading(true);

      try {
        const formDataToSend = new FormData();
        formDataToSend.append("module_id", moduleId);
        formDataToSend.append("title", formData.title);
        formDataToSend.append("content_type", formData.content_type);
        formDataToSend.append("content_text", formData.content_text);
        formDataToSend.append("duration", formData.duration);

        if (videoFile) {
          formDataToSend.append("video", videoFile);
        }

        const url = lesson ? `/api/lessons/${lesson.id}` : "/api/lessons";
        const method = lesson ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataToSend,
        });

        if (response.ok) {
          onSave();
          onClose();
          fetchCourseData();
        }
      } catch (err) {
        setError("Failed to save lesson");
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {lesson ? "Edit Lesson" : "Create Lesson"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
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
                {lesson?.content_url && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current: {lesson.content_url.split("/").pop()}
                  </p>
                )}
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
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional content or description..."
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
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : lesson ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AssignmentForm = ({ assignment, moduleId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      title: assignment?.title || "",
      description: assignment?.description || "",
      instructions: assignment?.instructions || "",
      due_date: assignment?.due_date ? assignment.due_date.split("T")[0] : "",
      max_points: assignment?.max_points || 100,
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      const url = assignment
        ? `/api/assignments/${assignment.id}`
        : "/api/assignments";
      const method = assignment ? "PUT" : "POST";

      const payload = assignment
        ? formData
        : { ...formData, module_id: moduleId };

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          onSave();
          onClose();
          fetchCourseData();
        }
      } catch (err) {
        setError("Failed to save assignment");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {assignment ? "Edit Assignment" : "Create Assignment"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
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
              <label className="block text-sm font-medium mb-2">
                Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed instructions for students..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
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
                {assignment ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const QuizForm = ({ quiz, lessonId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      question: quiz?.question || "",
      options: quiz?.options || ["", "", "", ""],
      correct_answer: quiz?.correct_answer || 0,
      points: quiz?.points || 1,
    });

    const updateOption = (index, value) => {
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
      setFormData({ ...formData, options: [...formData.options, ""] });
    };

    const removeOption = (index) => {
      if (formData.options.length > 2) {
        const newOptions = formData.options.filter((_, i) => i !== index);
        setFormData({
          ...formData,
          options: newOptions,
          correct_answer:
            formData.correct_answer >= newOptions.length
              ? 0
              : formData.correct_answer,
        });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const url = quiz ? `/api/quizzes/${quiz.id}` : "/api/quizzes";
      const method = quiz ? "PUT" : "POST";

      const payload = quiz ? formData : { ...formData, lesson_id: lessonId };

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          onSave();
          onClose();
          fetchCourseData();
        }
      } catch (err) {
        setError("Failed to save quiz");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {quiz ? "Edit Quiz" : "Create Quiz"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Question</label>
              <textarea
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Options</label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="radio"
                    name="correct_answer"
                    checked={formData.correct_answer === index}
                    onChange={() =>
                      setFormData({ ...formData, correct_answer: index })
                    }
                    className="mt-2"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Option
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: parseInt(e.target.value) })
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
                {quiz ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {course?.title}
              </h1>
              <p className="text-gray-600 mt-1">Manage your course content</p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Course Modules</h2>
              <button
                onClick={() => setShowModuleModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Module
              </button>
            </div>
          </div>

          <div className="p-6">
            {modules.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No modules yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first module to get started
                </p>
                <button
                  onClick={() => setShowModuleModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Module
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="border border-gray-200 rounded-lg"
                  >
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="flex items-center gap-3">
                        {expandedModules.has(module.id) ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {module.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {module.lesson_count} lessons •{" "}
                            {Math.floor(module.total_duration / 60)} minutes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingItem(module);
                            setShowModuleModal(true);
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                "Are you sure you want to delete this module?"
                              )
                            ) {
                              // Delete module logic
                            }
                          }}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {expandedModules.has(module.id) && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="flex gap-2 mb-4">
                          <button
                            onClick={() => {
                              setSelectedModuleId(module.id);
                              setShowLessonModal(true);
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            <Video size={14} />
                            Add Lesson
                          </button>
                          <button
                            onClick={() => {
                              setSelectedModuleId(module.id);
                              setShowAssignmentModal(true);
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                          >
                            <FileText size={14} />
                            Add Assignment
                          </button>
                        </div>

                        {/* Module content would be loaded here */}
                        <div className="text-sm text-gray-500">
                          Click "Add Lesson" or "Add Assignment" to start
                          building this module
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showModuleModal && (
          <ModuleForm
            module={editingItem}
            onClose={() => {
              setShowModuleModal(false);
              setEditingItem(null);
            }}
            onSave={() => {
              setEditingItem(null);
            }}
          />
        )}

        {showLessonModal && (
          <LessonForm
            moduleId={selectedModuleId}
            onClose={() => {
              setShowLessonModal(false);
              setSelectedModuleId(null);
            }}
            onSave={() => {
              setSelectedModuleId(null);
            }}
          />
        )}

        {showAssignmentModal && (
          <AssignmentForm
            moduleId={selectedModuleId}
            onClose={() => {
              setShowAssignmentModal(false);
              setSelectedModuleId(null);
            }}
            onSave={() => {
              setSelectedModuleId(null);
            }}
          />
        )}

        {showQuizModal && (
          <QuizForm
            lessonId={selectedLessonId}
            onClose={() => {
              setShowQuizModal(false);
              setSelectedLessonId(null);
            }}
            onSave={() => {
              setSelectedLessonId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
