import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Star,
  Users,
  BookOpen,
  Award,
  Play,
  ArrowRight,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const ModernLandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isVisible, setIsVisible] = useState(false);

  // Check if user is logged in - REPLACE THIS with your actual auth check
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // REPLACE THIS SECTION with your actual authentication check
    // Example options:
    // 1. Check localStorage: const token = localStorage.getItem('authToken');
    // 2. Check context: const { isAuthenticated } = useAuth();
    // 3. Check Redux: const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const checkAuthStatus = () => {
      // Option 1: localStorage check
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);

      // Option 2: If you use a different key
      // const user = localStorage.getItem('user');
      // setIsLoggedIn(!!user);

      // Option 3: If you use sessionStorage
      // const token = sessionStorage.getItem('authToken');
      // setIsLoggedIn(!!token);
    };

    checkAuthStatus();
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Expert-Led Courses",
      description:
        "Learn from industry professionals with real-world experience and cutting-edge knowledge",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborative Learning",
      description:
        "Join study groups, participate in discussions, and network with peers globally",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certified Success",
      description:
        "Earn recognized certificates and track your progress with detailed analytics",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Students" },
    { number: "500+", label: "Expert Courses" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Developer",
      content:
        "This platform transformed my career. The courses are practical and the community is amazing!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616c78746a1?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "Michael Rodriguez",
      role: "Data Scientist",
      content:
        "Outstanding instructors and comprehensive content. Highly recommend for anyone looking to upskill.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "Emily Johnson",
      role: "UX Designer",
      content:
        "The interactive approach and real projects made learning engaging and effective.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div
          className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Master Skills That
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Shape Tomorrow
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners advancing their careers with our
            cutting-edge courses, expert instructors, and hands-on projects that
            matter.
          </p>

          {/* UPDATED: Conditional rendering - button only shows when NOT logged in */}
          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/register">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105">
                  <span className="flex items-center text-white">
                    Start Learning Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white/60 rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience learning like never before with our innovative approach
              and cutting-edge features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                  style={{
                    background: `linear-gradient(to right, ${
                      feature.gradient.split(" ")[1]
                    }, ${feature.gradient.split(" ")[3]})`,
                  }}
                ></div>

                <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 h-full">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}
                  >
                    {feature.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See how our students are transforming their careers and achieving
              their goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-gray-300 mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - UPDATED: Also conditional */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Transform Your Future?
            </h2>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of successful learners who have already started
              their journey with us. Your future self will thank you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* UPDATED: Conditional rendering for CTA buttons too */}
              {!isLoggedIn ? (
                <>
                  <Link to="/register">
                    <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105">
                      <span className="flex items-center justify-center">
                        Get Started Free
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                  </Link>
                  <Link to="/courses">
                    <button className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 font-semibold text-lg">
                      Browse Courses
                    </button>
                  </Link>
                </>
              ) : (
                // Show different content for logged in users
                <Link to="/dashboard">
                  <button className="group px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105">
                    <span className="flex items-center justify-center">
                      Go to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernLandingPage;
