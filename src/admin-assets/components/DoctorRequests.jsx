import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, User, Mail, Phone, Calendar, Stethoscope, GraduationCap, Award, FileText, Download, Eye, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import myaxios from "../../assets/utilities/myaxios";
import { successToast, errorToast } from "../../assets/utilities/toast";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const BASE_URL = "http://127.0.0.1:8000";

// Doctor Profile Modal Component
function DoctorRequestModal({ doctorId, isOpen, onClose }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && doctorId) {
      fetchProfileDetails();
    }
  }, [isOpen, doctorId]);

  const fetchProfileDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await myaxios.get(`admin/doctor-profile/${doctorId}/`);
      if (res.data.status) {
        setProfileData(res.data.data);
      } else {
        setError("Failed to load profile data");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Error loading profile details");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const InfoRow = ({ icon: Icon, label, value, color = "blue", isLink = false }) => (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/3 border border-white/5">
      <div className={`p-2 rounded-lg bg-${color}-500/10`}>
        <Icon className={`h-4 w-4 text-${color}-400`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        {isLink && value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 truncate block"
          >
            View Document
          </a>
        ) : (
          <p className="text-sm text-white capitalize truncate">{value || "N/A"}</p>
        )}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-white/6 bg-[#0a0f1e] p-6 shadow-2xl shadow-black/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-400">{error}</div>
          ) : profileData ? (
            <>
              {/* Header with Profile Image */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/6">
                <div className="relative">
                  <img
                    src={
                      profileData.img_url?.startsWith("http")
                        ? profileData.img_url
                        : `${BASE_URL}${profileData.img_url}`
                    }
                    alt={profileData.user.full_name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-500/30"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-white capitalize truncate">
                    {profileData.user.full_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-sm text-slate-400">@{profileData.user.username}</span>
                    {profileData.is_approved ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 ring-1 ring-green-500/20">
                        <ShieldCheck className="h-3 w-3" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400 ring-1 ring-yellow-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                        Pending Approval
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Professional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InfoRow icon={Stethoscope} label="Specialization" value={profileData.specialization} color="blue" />
                  <InfoRow icon={GraduationCap} label="Qualification" value={profileData.qualification} color="purple" />
                  <InfoRow icon={Award} label="License Number" value={profileData.license_number} color="amber" />
                  <InfoRow icon={FileText} label="License Count" value={profileData.license_count > 0 ? `${profileData.license_count} licenses` : "N/A"} color="orange" />
                  <InfoRow icon={User} label="Total Patients" value={profileData.patient_count > 0 ? `${profileData.patient_count} patients` : "No patients"} color="green" />
                </div>
              </div>

              {/* Personal Information */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InfoRow icon={Calendar} label="Date of Birth" value={profileData.date_of_birth ? new Date(profileData.date_of_birth).toLocaleDateString() : "N/A"} color="pink" />
                  <InfoRow icon={User} label="Gender" value={profileData.gender || "N/A"} color="cyan" />
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InfoRow icon={Mail} label="Email" value={profileData.user.email} color="blue" />
                  <InfoRow icon={Phone} label="Phone" value={profileData.user.phone || "N/A"} color="green" />
                </div>
              </div>

              {/* CV Document */}
              {profileData.cv && (
                <div className="pt-6 border-t border-white/6">
                  <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/3 border border-white/5">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <FileText className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500">CV / Resume</p>
                        <div className="flex gap-3 mt-1">
                          <a
                            href={`${BASE_URL}${profileData.cv}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            Preview
                          </a>
                          <a
                            href={`${BASE_URL}${profileData.cv}`}
                            download
                            className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* CV Preview */}
                    <div className="rounded-lg border border-white/10 overflow-hidden bg-black/20">
                      <iframe
                        title="CV Preview"
                        src={`https://docs.google.com/gview?url=${BASE_URL}${profileData.cv}&embedded=true`}
                        className="w-full h-64"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function DoctorRequests({ requests = [] }) {
  const [apiData, setApiData] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await myaxios.get("admin/doctor-request/");
        setApiData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  const data = apiData.length > 0 ? apiData : requests;

  const requestHandle = async (doctorId, isApproved) => {
    try {
      const res = await myaxios.post("admin/update-approval-request/", {
        doctor_id: doctorId,
        is_approved: isApproved,
      });

      if (res.data.status) {
        setApiData((prev) =>
          prev.filter((doc) => doc.id !== doctorId)
        );
        successToast(`Doctor ${isApproved == "true" ? "approved" : "rejected"} successfully`);
      } else {
        errorToast(res.data.message || "Request failed");
      }
    } catch (error) {
      console.error(error);
      errorToast("Network error");
    }
  };

  const handleApprove = (doc) => requestHandle(doc.id, "true");
  const handleReject = (doc) => requestHandle(doc.id, "false");

  const handleDoctorClick = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctorId(null);
  };

  return (
    <>
      <motion.article
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        className="xl:col-span-2 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Pending Doctor Requests</h2>
          <p className="mt-1 text-sm text-slate-400">
            Approve or reject incoming doctor requests.
          </p>
        </div>

        <div className="space-y-3">
          {data.map((request, index) => (
            <div
              key={index}
              onClick={() => handleDoctorClick(request.id)}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/7 cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        request.img_url?.startsWith("http")
                          ? request.img_url
                          : `${BASE_URL}${request.img_url}`
                      }
                      alt={request.full_name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {request.full_name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Specialization: <span className="text-cyan-300">{request.specialization}</span>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-full bg-slate-950/50 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10 shrink-0">
                    {request.date_of_birth ? new Date(request.date_of_birth).toLocaleDateString() : "N/A"}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(request);
                    }}
                    className="flex-1 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 transition-colors"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Approve
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(request);
                    }}
                    className="flex-1 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition-colors"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <X className="h-4 w-4" />
                      Reject
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.article>

      {/* Doctor Request Modal */}
      <DoctorRequestModal 
        doctorId={selectedDoctorId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}