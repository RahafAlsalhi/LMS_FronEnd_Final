// AboutUs.jsx
import React from "react";
import {
  BookOpen,
  Users,
  Award,
  Globe,
  Heart,
  Target,
  CheckCircle,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    {
      number: "500+",
      label: "Students Worldwide",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "30+",
      label: "Expert Courses",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      number: "100+",
      label: "Assignments & Quizzes",
      icon: <Award className="w-6 h-6" />,
    },
    {
      number: "24/7",
      label: "Learning Support",
      icon: <Globe className="w-6 h-6" />,
    },
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Inclusive Learning",
      description:
        "We believe education should be accessible to everyone, regardless of age, background, or location.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Quality Excellence",
      description:
        "Our courses are designed by experts and updated regularly to ensure the highest quality content.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Community",
      description:
        "Join learners from around the world in our supportive and collaborative learning environment.",
      gradient: "from-purple-500 to-indigo-500",
    },
  ];

  const features = [
    "Interactive video lessons",
    "Hands-on assignments",
    "Real-time quizzes",
    "Progress tracking",
    "Certificate of completion",
    "Community forums",
    "Mobile-friendly platform",
    "Lifetime access to courses",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
              🎓 About EduHikerz
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Empowering Minds,
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Shaping Futures
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            EduHikerz is Jordan's premier free learning platform, dedicated to
            providing quality education for learners of all ages through
            interactive courses, assignments, and quizzes.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-center mb-3 text-cyan-400">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                At EduHikerz, we're on a mission to democratize education and
                make high-quality learning accessible to everyone. Based in the
                heart of Amman, Jordan, we serve learners globally with our
                comprehensive online learning platform.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                We believe that education is the cornerstone of personal and
                societal growth. That's why we've created a platform that breaks
                down barriers and opens doors to knowledge for learners of all
                ages and backgrounds.
              </p>

              <div className="flex items-center space-x-4 text-gray-400">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>Amman, Jordan | Serving the World</span>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <h3 className="text-2xl font-bold mb-6 text-white">
                  What Makes Us Different
                </h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do at EduHikerz
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group relative">
                <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 h-full">
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${value.gradient} mb-6`}
                  >
                    {value.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {value.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl p-12 backdrop-blur-sm border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our Vision for the Future
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We envision a world where quality education knows no boundaries.
              Through EduHikerz, we're building a global community of learners
              who support each other's growth and success.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              From our base in Jordan, we're expanding our reach to touch lives
              across the globe, one student at a time. Join us in this journey
              of discovery, growth, and transformation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of learners who are already transforming their lives
            with EduHikerz
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 inline-block text-center"
            >
              Explore Courses
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 font-semibold text-lg inline-block text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
