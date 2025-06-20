import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Filter,
  Search,
  Grid,
  List,
  ChevronDown,
  User,
  DollarSign,
  Award,
  Play,
} from "lucide-react";
import { fetchCourses } from "../store/slices/courseSlice";

const CoursesPage = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, error } = useSelector((state) => state.courses);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchCourses());
  }, [dispatch]);

  // Mock categories for filtering (you can replace with actual categories from your store)
  const categories = [
    { id: "all", name: "All Courses" },
    { id: "web-dev", name: "Web Development" },
    { id: "data-science", name: "Data Science" },
    { id: "design", name: "Design" },
    { id: "business", name: "Business" },
  ];

  // Filter and sort courses
  const filteredCourses =
    courses
      ?.filter((course) => {
        const matchesSearch =
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" ||
          course.category_name?.toLowerCase().includes(selectedCategory);
        return matchesSearch && matchesCategory;
      })
      ?.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.created_at) - new Date(a.created_at);
          case "oldest":
            return new Date(a.created_at) - new Date(b.created_at);
          case "price-low":
            return (a.price || 0) - (b.price || 0);
          case "price-high":
            return (b.price || 0) - (a.price || 0);
          case "popular":
            return (b.enrollments_count || 0) - (a.enrollments_count || 0);
          default:
            return 0;
        }
      }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading amazing courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          <p className="text-red-400 text-lg">Error loading courses: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
              📚 Explore Courses
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Discover Amazing
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Learning Experiences
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Explore our collection of expert-crafted courses designed to help
            you master new skills and advance your career.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {courses?.length || 0}
              </div>
              <div className="text-gray-400 text-sm">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-gray-400 text-sm">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-gray-400 text-sm">Free</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all pr-10"
                >
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-slate-800"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all pr-10"
                >
                  <option value="newest" className="bg-slate-800">
                    Newest
                  </option>
                  <option value="oldest" className="bg-slate-800">
                    Oldest
                  </option>
                  <option value="popular" className="bg-slate-800">
                    Most Popular
                  </option>
                  <option value="price-low" className="bg-slate-800">
                    Price: Low to High
                  </option>
                  <option value="price-high" className="bg-slate-800">
                    Price: High to Low
                  </option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-cyan-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-cyan-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No courses found
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No courses are available at the moment"}
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 ${
                    viewMode === "list" ? "flex gap-6 p-6" : "overflow-hidden"
                  }`}
                >
                  {/* Course Thumbnail */}
                  <div
                    className={`relative ${
                      viewMode === "list"
                        ? "w-48 h-32 flex-shrink-0"
                        : "h-48 w-full"
                    } bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl overflow-hidden`}
                  >
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-cyan-400" />
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>

                    {/* Price Badge */}
                    {course.price > 0 && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ${course.price}
                      </div>
                    )}
                    {course.price === 0 && (
                      <div className="absolute top-3 right-3 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        FREE
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className={`${viewMode === "list" ? "flex-1" : "p-6"}`}>
                    {/* Category Badge */}
                    {course.category_name && (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {course.category_name}
                        </span>
                      </div>
                    )}

                    {/* Course Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Course Description */}
                    <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                      {course.description?.substring(0, 120)}
                      {course.description?.length > 120 && "..."}
                    </p>

                    {/* Course Meta */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{course.instructor_name}</span>
                      </div>

                      {course.enrollments_count > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{course.enrollments_count} students</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Only show if user is not authenticated */}
      {!isAuthenticated && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl p-12 backdrop-blur-sm border border-white/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Start Learning?
              </h2>
              <p className="text-xl text-gray-300 mb-10">
                Join thousands of learners who are already transforming their
                careers with EduHikerz
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 font-semibold text-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CoursesPage;
