import React, { useState, useEffect } from "react";
import { X, Upload, FileText, Download, Check, Clock } from "lucide-react";

const AssignmentSubmissionModal = ({ assignment, onClose, httpClient }) => {
  const [submission, setSubmission] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExistingSubmission();
  }, [assignment.id]);

  const fetchExistingSubmission = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(
        `/submissions/assignment/${assignment.id}/my`
      );
      setSubmission(response);
      if (response) {
        setSubmissionText(response.submission_text || "");
      }
    } catch (error) {
      // No existing submission found - this is normal
      console.log("No existing submission found");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError("File too large. Maximum size is 10MB.");
        return;
      }

      // Check file type
      const allowedTypes = [
        "pdf",
        "doc",
        "docx",
        "txt",
        "ppt",
        "pptx",
        "xls",
        "xlsx",
      ];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        setError(
          "Please upload a valid document file (PDF, DOC, DOCX, TXT, PPT, PPTX, XLS, XLSX)"
        );
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!submissionText.trim() && !selectedFile) {
      setError("Please provide either text submission or upload a file.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("assignment_file", selectedFile);
      }

      if (submissionText.trim()) {
        formData.append("submission_text", submissionText.trim());
      }

      const response = await fetch(
        `http://localhost:5000/api/submissions/assignment/${assignment.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSubmission(result);
        setSuccess("Assignment submitted successfully!");
        setSelectedFile(null);

        // Clear file input
        const fileInput = document.getElementById("assignment-file");
        if (fileInput) fileInput.value = "";

        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit assignment");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError("Failed to submit assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/submissions/assignment/${assignment.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = submission.file_name || "assignment_file";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Failed to download file");
      }
    } catch (error) {
      setError("Failed to download file");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue =
    assignment.deadline && new Date() > new Date(assignment.deadline);
  const canSubmit = !isOverdue; // Allow resubmission since your backend handles upsert

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {assignment.title}
              </h2>
              <p className="text-sm text-gray-600">Assignment Submission</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Assignment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Assignment Details
            </h3>
            <p className="text-gray-700 mb-3">{assignment.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center text-orange-600">
                <span className="font-medium">
                  Max Points: {assignment.max_points}
                </span>
              </div>

              {assignment.deadline && (
                <div
                  className={`flex items-center ${
                    isOverdue ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Due: {formatDate(assignment.deadline)}</span>
                  {isOverdue && (
                    <span className="ml-1 font-medium">(Overdue)</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Existing Submission Display */}
          {submission && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-3">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">
                  {submission.grade !== null
                    ? "Graded Submission"
                    : "Submitted"}
                </h3>
                <span className="ml-auto text-sm text-green-600">
                  {formatDate(submission.submitted_at)}
                </span>
              </div>

              {submission.submission_text && (
                <div className="mb-3">
                  <h4 className="font-medium text-gray-700 mb-1">
                    Text Submission:
                  </h4>
                  <p className="text-gray-600 bg-white p-3 rounded border">
                    {submission.submission_text}
                  </p>
                </div>
              )}

              {submission.submission_url && (
                <div className="mb-3">
                  <h4 className="font-medium text-gray-700 mb-1">
                    File Submission:
                  </h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDownload}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download: {submission.file_name || "Submitted File"}
                    </button>
                    {submission.file_type && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {submission.file_type.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {submission.grade !== null && (
                <div className="bg-white p-3 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">Grade:</span>
                    <span className="text-lg font-bold text-green-600">
                      {submission.grade}/{assignment.max_points}
                    </span>
                  </div>
                  {submission.feedback && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Feedback:
                      </span>
                      <p className="text-gray-600 mt-1">
                        {submission.feedback}
                      </p>
                    </div>
                  )}
                  {submission.graded_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Graded on {formatDate(submission.graded_at)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submission Form - Always show if not overdue (allows resubmission) */}
          {canSubmit && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-blue-800 text-sm">
                  {submission
                    ? "You can update your submission by submitting again. This will replace your previous submission."
                    : "Submit your assignment below using text, file upload, or both."}
                </p>
              </div>

              {/* Text Submission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Submission
                </label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Type your submission here..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Upload (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload a document (PDF, DOC, DOCX, TXT, PPT, PPTX, XLS,
                    XLSX)
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Maximum file size: 10MB
                  </p>

                  <input
                    id="assignment-file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                    className="hidden"
                  />

                  <label
                    htmlFor="assignment-file"
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </label>

                  {selectedFile && (
                    <div className="mt-3 p-2 bg-orange-50 rounded border">
                      <p className="text-sm text-orange-800">
                        Selected: {selectedFile.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting || (!submissionText.trim() && !selectedFile)
                  }
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {submission ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {submission ? "Update Submission" : "Submit Assignment"}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Overdue Notice */}
          {isOverdue && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">
                This assignment is overdue.
              </p>
              <p className="text-red-600 text-sm">
                {submission
                  ? "You have a submission, but the deadline has passed for updates."
                  : "Submissions are no longer accepted."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissionModal;
