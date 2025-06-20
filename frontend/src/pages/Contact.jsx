// Contact.jsx
import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HeadphonesIcon,
  Globe,
} from "lucide-react";
import { useEffect } from "react";
const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setSuccessMessage(
        "Thank you for your message! We'll get back to you soon."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsLoading(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: "support@eduhikerz.com",
      subDetails: "We'll respond within 24 hours",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: "+962 6 123 4567",
      subDetails: "Sun - Thu: 9AM - 6PM (Jordan Time)",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: "Amman, Jordan",
      subDetails: "King Abdullah II Street",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Online Support",
      details: "24/7 Help Center",
      subDetails: "Chat support available",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const faqs = [
    {
      question: "Is EduHikerz really free?",
      answer:
        "Yes! All our courses, assignments, and quizzes are completely free for learners of all ages.",
    },
    {
      question: "Do I get a certificate after completing a course?",
      answer:
        "Absolutely! You'll receive a certificate of completion for every course you finish successfully.",
    },
    {
      question: "Can I access courses on my mobile device?",
      answer:
        "Yes, our platform is fully responsive and works perfectly on all devices including phones and tablets.",
    },
    {
      question: "How do I track my learning progress?",
      answer:
        "Your dashboard shows detailed progress tracking for all courses, assignments, and quiz scores.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8"></div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Contact
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              EduHikerz
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Have questions about our courses? Need support? Want to partner with
            us? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="group relative">
                <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 h-full text-center">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${info.gradient} mb-4 mx-auto`}
                  >
                    {info.icon}
                  </div>

                  <h3 className="text-lg font-bold mb-2 text-white">
                    {info.title}
                  </h3>

                  <p className="text-gray-300 font-medium mb-1">
                    {info.details}
                  </p>

                  <p className="text-gray-400 text-sm">{info.subDetails}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 mb-8">
              Quick answers to common questions about EduHikerz.
            </p>
          </div>

          <div className="space-y-6 mb-12">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-3xl mx-auto"
              >
                <h3 className="text-lg font-semibold text-white mb-3 flex items-start">
                  <MessageSquare className="w-5 h-5 text-cyan-400 mr-3 mt-1 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-300 leading-relaxed ml-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Support Hours */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 backdrop-blur-sm border border-white/10 max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-cyan-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">
                Support Hours
              </h3>
            </div>
            <div className="space-y-3 text-gray-300">
              <p>
                <span className="text-white font-medium">
                  Sunday - Thursday:
                </span>{" "}
                9:00 AM - 6:00 PM
              </p>
              <p>
                <span className="text-white font-medium">
                  Friday - Saturday:
                </span>{" "}
                Closed
              </p>
              <p className="text-sm text-gray-400 mt-4">
                <HeadphonesIcon className="w-4 h-4 inline mr-1" />
                Online chat support available 24/7
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Find Us in Amman
          </h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
            <MapPin className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              EduHikerz Headquarters
            </h3>
            <p className="text-gray-300 mb-4">
              King Abdullah II Street, Amman, Jordan
            </p>
            <p className="text-gray-400">
              Located in the heart of Amman, we're easily accessible by public
              transport and car.
            </p>
            {/* You can replace this with an actual Google Maps embed */}
            <div className="mt-6 h-64 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center">
              <p className="text-gray-400">Interactive Map Coming Soon</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
