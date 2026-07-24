import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, ChevronLeft, ChevronRight, X, User, Mail, Phone, Calendar, Stethoscope, GraduationCap, Users, Award, FileText, BadgeCheck, Activity } from "lucide-react";
import myaxios from "../../../assets/utilities/myaxios";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

function Avatar({ name, imgUrl }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={name}
        className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-600/40 to-violet-600/40 ring-1 ring-white/10 text-xs font-semibold text-white shrink-0">
      {initials}
    </div>
  );
}

// Doctor Profile Modal Component
function DoctorProfileModal({ doctorId, isOpen, onClose }) {
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
      const res = await myaxios.get(`/admin/doctor-profile/${doctorId}/`);
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
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors"
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
              {/* Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/6">
                <Avatar 
                  name={profileData.user.full_name} 
                  imgUrl={profileData.img_url} 
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-white capitalize truncate">
                    {profileData.user.full_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-sm text-slate-400">@{profileData.user.username}</span>
                    {profileData.is_approved ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 ring-1 ring-green-500/20">
                        <BadgeCheck className="h-3 w-3" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400 ring-1 ring-yellow-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                        Pending
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
                </div>
              </div>

              {/* Personal Information */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InfoRow icon={Calendar} label="Date of Birth" value={profileData.date_of_birth || "N/A"} color="pink" />
                  <InfoRow icon={User} label="Gender" value={profileData.gender || "N/A"} color="cyan" />
                  <InfoRow icon={Users} label="Total Patients" value={profileData.patient_count > 0 ? `${profileData.patient_count} patients` : "No patients"} color="green" />
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

              {/* Documents */}
              {(profileData.cv || profileData.img_url) && (
                <div className="pt-6 border-t border-white/6">
                  <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {profileData.cv && (
                      <InfoRow icon={FileText} label="CV" value={profileData.cv} color="purple" isLink />
                    )}
                    {profileData.img_url && (
                      <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/3 border border-white/5">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <User className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500">Profile Image</p>
                          <img 
                            src={profileData.img_url} 
                            alt="Profile" 
                            className="mt-1 rounded-lg max-h-32 w-auto object-cover border border-white/10"
                          />
                        </div>
                      </div>
                    )}
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

export default function ApprovedDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      let query = `/available-doctors/?page=${page}&limit=10`;
      if (search) query += `&search=${search}`;
      const res = await myaxios.get(query);
      if (res.data.status) {
        setDoctors(res.data.data);
        setTotalCount(res.data.count);
        setTotalPages(res.data.total_pages);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const delay = setTimeout(() => fetchDoctors(), 500);
    return () => clearTimeout(delay);
  }, [fetchDoctors]);

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
        className="xl:col-span-3 rounded-3xl border border-white/6 bg-[#0a0f1e] p-5 shadow-2xl shadow-black/40 sm:p-6"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Approved Doctors</h2>
            <p className="mt-1 text-sm text-slate-500">Approved doctors in the system.</p>
          </div>
          <div className="rounded-2xl border border-white/6 bg-white/5 px-3 py-2 text-xs text-slate-400 shrink-0">
            {totalCount} records
          </div>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, specialization or qualification..."
            className="w-full rounded-2xl border border-white/6 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-medium">Doctor</th>
                  <th className="px-4 py-4 font-medium">Specialization</th>
                  <th className="px-4 py-4 font-medium">Qualification</th>
                  <th className="px-4 py-4 font-medium">Gender</th>
                  <th className="px-4 py-4 font-medium">Licenses</th>
                  <th className="px-4 py-4 font-medium">Total Patients</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-black/20">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                    </td>
                  </tr>
                ) : doctors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-600">
                      No doctors found.
                    </td>
                  </tr>
                ) : (
                  doctors.map((doc) => (
                    <tr 
                      key={doc.id} 
                      className="transition hover:bg-white/5 cursor-pointer group"
                      onClick={() => handleDoctorClick(doc.id)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar 
                            name={doc.user?.full_name} 
                            imgUrl={doc.img_url} 
                          />
                          <span className="font-medium text-white capitalize group-hover:text-blue-400 transition-colors">
                            {doc.user?.full_name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-400">
                        {doc.specialization}
                      </td>

                      <td className="px-4 py-4 text-slate-400">
                        {doc.qualification}
                      </td>

                      <td className="px-4 py-4 text-slate-400 capitalize">
                        {doc.gender}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 ring-1 ring-amber-500/20">
                          {doc.license_count} licenses
                        </span>
                      </td>

                      <td className="px-4 py-4 text-slate-400">
                        {doc.total_patients ?? 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-slate-600">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 rounded-xl border border-white/6 bg-white/5 px-3 py-2 text-xs text-slate-400 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 rounded-xl border border-white/6 bg-white/5 px-3 py-2 text-xs text-slate-400 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.article>

      {/* Doctor Profile Modal */}
      <DoctorProfileModal 
        doctorId={selectedDoctorId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}