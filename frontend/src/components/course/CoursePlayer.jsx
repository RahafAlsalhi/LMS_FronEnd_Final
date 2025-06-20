import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import httpClient from "../../services/httpClient";
import AssignmentSubmissionModal from "./AssignmentSubmissionModal";
import QuizModal from "./QuizModal";

// Icons
const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
      clipRule="evenodd"
    />
  </svg>
);

const QuizIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

const AssignmentIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path
      fillRule="evenodd"
      d="M4 5a2 2 0 012-2v1a2 2 0 002 2h4a2 2 0 002-2V3a2 2 0 012 2v6h-3a3 3 0 00-3 3v4a1 1 0 01-1 1H6a2 2 0 01-2-2V5zm8 8a1 1 0 00-1 1v3l3-3h-2z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const courseResponse = await httpClient.get(`/courses/${courseId}`);
      setCourse(courseResponse);

      // Fetch modules and lessons
      const modulesResponse = await httpClient.get(
        `/modules/course/${courseId}`
      );

      // Fetch lessons for each module
      const modulesWithLessons = await Promise.all(
        modulesResponse.map(async (module) => {
          const moduleDetail = await httpClient.get(`/modules/${module.id}`);

          // Fetch assignments and quizzes for each lesson
          if (moduleDetail.lessons && moduleDetail.lessons.length > 0) {
            const lessonsWithContent = await Promise.all(
              moduleDetail.lessons.map(async (lesson) => {
                try {
                  // Fetch assignments for this lesson
                  const assignmentsResponse = await httpClient.get(
                    `/assignments/lesson/${lesson.id}`
                  );
                  lesson.assignments = Array.isArray(assignmentsResponse)
                    ? assignmentsResponse
                    : [];
                } catch (error) {
                  console.log(`No assignments found for lesson ${lesson.id}`);
                  lesson.assignments = [];
                }

                try {
                  // Fetch quizzes for this lesson
                  const quizzesResponse = await httpClient.get(
                    `/quizzes/lesson/${lesson.id}`
                  );
                  lesson.quizzes = Array.isArray(quizzesResponse)
                    ? quizzesResponse
                    : [];
                } catch (error) {
                  console.log(`No quizzes found for lesson ${lesson.id}`);
                  lesson.quizzes = [];
                }

                return lesson;
              })
            );
            moduleDetail.lessons = lessonsWithContent;
          }

          return moduleDetail;
        })
      );

      setModules(modulesWithLessons);

      // Set first lesson as current if available
      if (
        modulesWithLessons.length > 0 &&
        modulesWithLessons[0].lessons?.length > 0
      ) {
        setCurrentLesson(modulesWithLessons[0].lessons[0]);
      }

      // Try to fetch completion status and update progress
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const completionResponse = await httpClient.get(
            `/lessons/course/${courseId}/progress`
          );
          const completedSet = new Set(
            completionResponse.map((item) => item.lesson_id)
          );
          setCompletedLessons(completedSet);

          // Calculate progress with actual completed lessons
          const totalLessons = modulesWithLessons.reduce(
            (acc, module) => acc + (module.lessons?.length || 0),
            0
          );
          const actualProgress =
            totalLessons > 0 ? (completedSet.size / totalLessons) * 100 : 0;
          setProgress(actualProgress);
        } else {
          // If no token, calculate progress with current completed lessons
          const totalLessons = modulesWithLessons.reduce(
            (acc, module) => acc + (module.lessons?.length || 0),
            0
          );
          const currentProgress =
            totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;
          setProgress(currentProgress);
        }
      } catch (progressError) {
        console.log("Progress fetch failed, using local state");
        // Calculate progress with current state
        const totalLessons = modulesWithLessons.reduce(
          (acc, module) => acc + (module.lessons?.length || 0),
          0
        );
        const fallbackProgress =
          totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;
        setProgress(fallbackProgress);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    setSidebarOpen(false);
  };

  const handleMarkComplete = async (lessonId) => {
    try {
      const response = await httpClient.post(`/lessons/${lessonId}/complete`);
      const newCompletedLessons = new Set([...completedLessons, lessonId]);
      setCompletedLessons(newCompletedLessons);

      const totalLessons = modules.reduce(
        (acc, module) => acc + (module.lessons?.length || 0),
        0
      );
      const newProgress =
        totalLessons > 0 ? (newCompletedLessons.size / totalLessons) * 100 : 0;
      setProgress(newProgress);

      console.log("Lesson completed successfully:", response);
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      alert("Failed to mark lesson as complete. Please try again.");
    }
  };

  const getNextLesson = () => {
    if (!currentLesson) return null;
    let found = false;
    for (const module of modules) {
      for (const lesson of module.lessons || []) {
        if (found) return lesson;
        if (lesson.id === currentLesson.id) found = true;
      }
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!currentLesson) return null;
    let previous = null;
    for (const module of modules) {
      for (const lesson of module.lessons || []) {
        if (lesson.id === currentLesson.id) return previous;
        previous = lesson;
      }
    }
    return null;
  };

  const getVideoUrl = (contentUrl) => {
    if (!contentUrl) return null;

    if (contentUrl.startsWith("http://") || contentUrl.startsWith("https://")) {
      return contentUrl;
    }

    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const SERVER_BASE_URL = API_BASE_URL.replace("/api", "");

    let videoPath = contentUrl;

    if (
      !videoPath.startsWith("uploads/") &&
      !videoPath.startsWith("/uploads/")
    ) {
      videoPath = `uploads/videos/${videoPath}`;
    }

    if (videoPath.startsWith("/")) {
      videoPath = videoPath.slice(1);
    }

    return `${SERVER_BASE_URL}/${videoPath}`;
  };

  const getYouTubeEmbedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return url;
  };

  const getVimeoEmbedUrl = (url) => {
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1].split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const getContentIcon = (contentType) => {
    switch (contentType) {
      case "video":
        return <PlayIcon />;
      case "text":
        return <DocumentIcon />;
      case "quiz":
        return <QuizIcon />;
      case "assignment":
        return <AssignmentIcon />;
      default:
        return <DocumentIcon />;
    }
  };

  const getIconColor = (contentType) => {
    switch (contentType) {
      case "video":
        return "text-blue-500";
      case "text":
        return "text-gray-500";
      case "quiz":
        return "text-purple-500";
      case "assignment":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  const renderLessonContent = (lesson) => {
    if (!lesson) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <div className="text-blue-600">
              <PlayIcon />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Select a lesson to start learning
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            Choose from the course content sidebar to begin your learning
            journey
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Main Lesson Content */}
        {renderMainLessonContent(lesson)}

        {/* Assignments Section */}
        {lesson.assignments && lesson.assignments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <AssignmentIcon />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Assignments ({lesson.assignments.length})
              </h3>
            </div>
            <div className="space-y-4">
              {lesson.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border border-orange-200 rounded-lg p-4 bg-orange-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {assignment.title}
                    </h4>
                    <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      {assignment.max_points} pts
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    {assignment.description}
                  </p>
                  {assignment.deadline && (
                    <p className="text-xs text-orange-600 mb-3">
                      Due: {new Date(assignment.deadline).toLocaleDateString()}
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setShowAssignmentModal(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Assignment
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quizzes Section */}
        {lesson.quizzes && lesson.quizzes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <QuizIcon />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Quizzes ({lesson.quizzes.length})
              </h3>
            </div>
            <div className="space-y-4">
              {lesson.quizzes.map((quiz, index) => (
                <div
                  key={quiz.id}
                  className="border border-purple-200 rounded-lg p-4 bg-purple-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      Quiz {index + 1}: {quiz.question.substring(0, 50)}...
                    </h4>
                    <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {quiz.points} pts
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{quiz.question}</p>
                  <button
                    onClick={() => {
                      setSelectedQuizzes(lesson.quizzes);
                      setShowQuizModal(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Take Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMainLessonContent = (lesson) => {
    switch (lesson.content_type) {
      case "video":
        return (
          <div className="space-y-6">
            {lesson.content_url ? (
              <div className="relative">
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                  {lesson.content_url.includes("youtube.com") ||
                  lesson.content_url.includes("youtu.be") ? (
                    <iframe
                      className="w-full h-full"
                      src={getYouTubeEmbedUrl(lesson.content_url)}
                      frameBorder="0"
                      allowFullScreen
                      title={lesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : lesson.content_url.includes("vimeo.com") ? (
                    <iframe
                      className="w-full h-full"
                      src={getVimeoEmbedUrl(lesson.content_url)}
                      frameBorder="0"
                      allowFullScreen
                      title={lesson.title}
                      allow="autoplay; fullscreen; picture-in-picture"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                        <div className="text-blue-600">
                          <PlayIcon />
                        </div>
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-4">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-300 text-center mb-6 max-w-md">
                        Click below to watch this video lesson
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <a
                          href={getVideoUrl(lesson.content_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <div className="mr-2">
                            <PlayIcon />
                          </div>
                          <span>Watch Video</span>
                        </a>
                        <button
                          onClick={() => {
                            const width = 900;
                            const height = 600;
                            const left = (window.innerWidth - width) / 2;
                            const top = (window.innerHeight - height) / 2;

                            window.open(
                              getVideoUrl(lesson.content_url),
                              "videoPlayer",
                              `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,menubar=no`
                            );
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Open in Popup
                        </button>
                      </div>

                      <div className="mt-6 text-center">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-700 text-gray-300">
                          <ClockIcon />
                          <span className="ml-1">
                            {lesson.duration || 0} minutes
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                  <PlayIcon />
                </div>
                <p className="text-gray-600 font-medium">
                  Video content will be available soon
                </p>
              </div>
            )}
            {lesson.content_text && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  About this video
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {lesson.content_text}
                </p>
              </div>
            )}
          </div>
        );

      case "text":
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {lesson.content_text || "Content will be available soon."}
              </p>
            </div>
          </div>
        );

      case "quiz":
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-purple-600">
                <QuizIcon />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quiz: {lesson.title}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {lesson.content_text ||
                "This lesson contains a quiz to test your understanding."}
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Start Quiz
            </button>
          </div>
        );

      case "assignment":
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-orange-600">
                <AssignmentIcon />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Assignment: {lesson.title}
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              {lesson.content_text ||
                "Complete this assignment to demonstrate your skills."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {lesson.content_url && (
                <a
                  href={lesson.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  View Instructions
                </a>
              )}
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Submit Assignment
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              {lesson.content_text || "Content will be available soon."}
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 font-medium text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();

  return (
    <div className="mt-17 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-screen lg:h-auto">
        {/* Static Sidebar - Desktop */}
        <div className="hidden lg:flex lg:w-96 lg:flex-col bg-white shadow-2xl border-r border-gray-200">
          {/* Course Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <button
                onClick={() => navigate("/courses")}
                className="p-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeftIcon />
              </button>
              <h2 className="text-xl font-bold truncate flex-1">
                {course?.title}
              </h2>
            </div>
            <p className="text-blue-100 text-sm mb-4">
              {course?.instructor_name} • {course?.category_name}
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-semibold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-blue-400/30 rounded-full h-3">
                <div
                  className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-blue-100">
                <span>{modules.length} modules</span>
                <span>
                  {modules.reduce(
                    (acc, m) => acc + (m.lessons?.length || 0),
                    0
                  )}{" "}
                  lessons
                </span>
              </div>
            </div>
          </div>

          {/* Modules List */}
          <div className="flex-1 overflow-y-auto">
            {modules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <DocumentIcon />
                </div>
                <p className="text-gray-500 text-center">
                  No modules available yet
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {modules.map((module, moduleIndex) => (
                  <div
                    key={module.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {module.lessons?.length || 0} lessons
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {module.lessons?.filter((lesson) =>
                            completedLessons.has(lesson.id)
                          ).length || 0}{" "}
                          completed
                        </span>
                        {/* Show assignment and quiz counts */}
                        {module.lessons && (
                          <>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {module.lessons.reduce(
                                (acc, lesson) =>
                                  acc + (lesson.assignments?.length || 0),
                                0
                              )}{" "}
                              assignments
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {module.lessons.reduce(
                                (acc, lesson) =>
                                  acc + (lesson.quizzes?.length || 0),
                                0
                              )}{" "}
                              quizzes
                            </span>
                          </>
                        )}
                      </div>
                      {module.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {module.description}
                        </p>
                      )}
                    </div>

                    <div className="divide-y divide-gray-50">
                      {module.lessons?.length === 0 ? (
                        <div className="py-6 px-4 text-center">
                          <p className="text-sm text-gray-500 italic">
                            No lessons available
                          </p>
                        </div>
                      ) : (
                        module.lessons?.map((lesson, lessonIndex) => {
                          const isSelected = currentLesson?.id === lesson.id;
                          const isCompleted = completedLessons.has(lesson.id);

                          return (
                            <div key={lesson.id}>
                              <button
                                onClick={() => handleLessonSelect(lesson)}
                                className={`
                                  w-full flex items-center space-x-3 p-4 text-left hover:bg-blue-50 transition-all duration-200 group
                                  ${
                                    isSelected
                                      ? "bg-blue-50 border-r-4 border-blue-500"
                                      : ""
                                  }
                                  ${
                                    isCompleted && !isSelected
                                      ? "bg-green-50/50"
                                      : ""
                                  }
                                `}
                              >
                                <div
                                  className={`flex-shrink-0 transition-colors duration-200 ${
                                    isCompleted
                                      ? "text-green-600"
                                      : getIconColor(lesson.content_type)
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckIcon />
                                  ) : (
                                    getContentIcon(lesson.content_type)
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`
                                    text-sm font-medium truncate transition-all duration-200
                                    ${
                                      isSelected
                                        ? "text-blue-900"
                                        : "text-gray-900"
                                    }
                                    ${
                                      isCompleted
                                        ? "line-through text-gray-500"
                                        : ""
                                    }
                                  `}
                                  >
                                    {lessonIndex + 1}. {lesson.title}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    {isCompleted ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                        ✓ Completed
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                        {lesson.content_type}
                                      </span>
                                    )}
                                    {lesson.duration > 0 && (
                                      <span className="flex items-center text-xs text-gray-500">
                                        <ClockIcon />
                                        <span className="ml-1">
                                          {lesson.duration} min
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                  {/* Show assignment and quiz indicators */}
                                  {(lesson.assignments?.length > 0 ||
                                    lesson.quizzes?.length > 0) && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      {lesson.assignments?.length > 0 && (
                                        <span className="flex items-center text-xs text-orange-600">
                                          <AssignmentIcon />
                                          <span className="ml-1">
                                            {lesson.assignments.length}
                                          </span>
                                        </span>
                                      )}
                                      {lesson.quizzes?.length > 0 && (
                                        <span className="flex items-center text-xs text-purple-600">
                                          <QuizIcon />
                                          <span className="ml-1">
                                            {lesson.quizzes.length}
                                          </span>
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {isSelected && <ArrowRightIcon />}
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-80 bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Course Content
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Mobile Progress */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <h3 className="font-semibold mb-2 text-sm">{course?.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-semibold">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-400/30 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Modules List */}
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-0">
                  {modules.map((module, moduleIndex) => (
                    <div
                      key={module.id}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                          Module {moduleIndex + 1}: {module.title}
                        </h3>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {module.lessons?.length || 0} lessons
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {module.lessons?.filter((lesson) =>
                              completedLessons.has(lesson.id)
                            ).length || 0}{" "}
                            completed
                          </span>
                          {module.lessons && (
                            <>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                {module.lessons.reduce(
                                  (acc, lesson) =>
                                    acc + (lesson.assignments?.length || 0),
                                  0
                                )}{" "}
                                assignments
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {module.lessons.reduce(
                                  (acc, lesson) =>
                                    acc + (lesson.quizzes?.length || 0),
                                  0
                                )}{" "}
                                quizzes
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="divide-y divide-gray-50">
                        {module.lessons?.map((lesson, lessonIndex) => {
                          const isSelected = currentLesson?.id === lesson.id;
                          const isCompleted = completedLessons.has(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => handleLessonSelect(lesson)}
                              className={`
                                w-full flex items-center space-x-3 p-4 text-left hover:bg-blue-50 transition-all duration-200
                                ${
                                  isSelected
                                    ? "bg-blue-50 border-r-4 border-blue-500"
                                    : ""
                                }
                                ${
                                  isCompleted && !isSelected
                                    ? "bg-green-50/50"
                                    : ""
                                }
                              `}
                            >
                              <div
                                className={`flex-shrink-0 transition-colors duration-200 ${
                                  isCompleted
                                    ? "text-green-600"
                                    : getIconColor(lesson.content_type)
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckIcon />
                                ) : (
                                  getContentIcon(lesson.content_type)
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`
                                  text-sm font-medium truncate transition-all duration-200
                                  ${
                                    isSelected
                                      ? "text-blue-900"
                                      : "text-gray-900"
                                  }
                                  ${
                                    isCompleted
                                      ? "line-through text-gray-500"
                                      : ""
                                  }
                                `}
                                >
                                  {lessonIndex + 1}. {lesson.title}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  {isCompleted ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                      ✓ Completed
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                      {lesson.content_type}
                                    </span>
                                  )}
                                  {lesson.duration > 0 && (
                                    <span className="flex items-center text-xs text-gray-500">
                                      <ClockIcon />
                                      <span className="ml-1">
                                        {lesson.duration} min
                                      </span>
                                    </span>
                                  )}
                                </div>
                                {/* Mobile assignment and quiz indicators */}
                                {(lesson.assignments?.length > 0 ||
                                  lesson.quizzes?.length > 0) && (
                                  <div className="flex items-center space-x-1 mt-1">
                                    {lesson.assignments?.length > 0 && (
                                      <span className="flex items-center text-xs text-orange-600">
                                        <AssignmentIcon />
                                        <span className="ml-1">
                                          {lesson.assignments.length}
                                        </span>
                                      </span>
                                    )}
                                    {lesson.quizzes?.length > 0 && (
                                      <span className="flex items-center text-xs text-purple-600">
                                        <QuizIcon />
                                        <span className="ml-1">
                                          {lesson.quizzes.length}
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Desktop Course Header */}
          <div className="hidden lg:block bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-4 xl:space-y-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {course?.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  {course?.instructor_name} • {course?.category_name}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-40 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Current Lesson Header */}
            {currentLesson && (
              <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        {getContentIcon(currentLesson.content_type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                        {currentLesson.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                          {currentLesson.content_type}
                        </span>
                        {currentLesson.duration > 0 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                            <ClockIcon />
                            <span className="ml-1">
                              {currentLesson.duration} min
                            </span>
                          </span>
                        )}
                        {completedLessons.has(currentLesson.id) && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <CheckIcon />
                            <span className="ml-1">Completed</span>
                          </span>
                        )}
                        {/* Show assignment and quiz counts in header */}
                        {currentLesson.assignments?.length > 0 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                            <AssignmentIcon />
                            <span className="ml-1">
                              {currentLesson.assignments.length} Assignment
                              {currentLesson.assignments.length > 1 ? "s" : ""}
                            </span>
                          </span>
                        )}
                        {currentLesson.quizzes?.length > 0 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            <QuizIcon />
                            <span className="ml-1">
                              {currentLesson.quizzes.length} Quiz
                              {currentLesson.quizzes.length > 1 ? "zes" : ""}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mark Complete Button */}
                  <div className="flex-shrink-0">
                    {!completedLessons.has(currentLesson.id) ? (
                      <button
                        onClick={() => handleMarkComplete(currentLesson.id)}
                        className="w-full lg:w-auto flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <span>Mark Complete</span>
                      </button>
                    ) : (
                      <div className="w-full lg:w-auto flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg">
                        <CheckIcon />
                        <span className="ml-2">Completed ✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            <div className="p-4 lg:p-8">
              {renderLessonContent(currentLesson)}
            </div>

            {/* Navigation Footer */}
            {currentLesson && (
              <div className="bg-white border-t border-gray-200 px-4 lg:px-8 py-6 mt-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <button
                    onClick={() =>
                      previousLesson && handleLessonSelect(previousLesson)
                    }
                    disabled={!previousLesson}
                    className={`
                      flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5
                      ${
                        previousLesson
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md hover:shadow-lg"
                          : "bg-gray-50 text-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    <ArrowLeftIcon />
                    <span className="ml-2">Previous</span>
                  </button>

                  <div className="hidden sm:block text-center">
                    <p className="text-sm text-gray-600 font-medium truncate max-w-xs">
                      {currentLesson.title}
                    </p>
                  </div>

                  <button
                    onClick={() => nextLesson && handleLessonSelect(nextLesson)}
                    disabled={!nextLesson}
                    className={`
                      flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5
                      ${
                        nextLesson
                          ? completedLessons.has(currentLesson.id)
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-md hover:shadow-lg"
                          : "bg-gray-50 text-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    <span className="mr-2">Next</span>
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assignment Submission Modal */}
      {showAssignmentModal && selectedAssignment && (
        <AssignmentSubmissionModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowAssignmentModal(false);
            setSelectedAssignment(null);
          }}
          httpClient={httpClient}
        />
      )}

      {/* Quiz Modal */}
      {showQuizModal && selectedQuizzes.length > 0 && (
        <QuizModal
          quizzes={selectedQuizzes}
          lessonTitle={currentLesson?.title || ""}
          onClose={() => {
            setShowQuizModal(false);
            setSelectedQuizzes([]);
          }}
          httpClient={httpClient}
        />
      )}
    </div>
  );
};

export default CoursePlayer;
