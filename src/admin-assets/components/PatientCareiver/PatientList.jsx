import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, ChevronLeft, ChevronRight, X, User, Mail, Phone, Calendar, Droplet, Ruler, Weight, MapPin, Pill, Syringe, Activity } from "lucide-react";
import myaxios from "../../../assets/utilities/myaxios";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-600/40 to-violet-600/40 ring-1 ring-white/10 text-xs font-semibold text-white shrink-0">
      {initials}
    </div>
  );
}

// Floating Profile Component
function PatientProfileModal({ patientId, isOpen, onClose }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchProfileDetails();
    }
  }, [isOpen, patientId]);

  const fetchProfileDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await myaxios.get(`/admin/patient-profile/${patientId}/`);
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

  const InfoRow = ({ icon: Icon, label, value, color = "blue" }) => (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/3 border border-white/5">
      <div className={`p-2 rounded-lg bg-${color}-500/10`}>
        <Icon className={`h-4 w-4 text-${color}-400`} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm text-white capitalize">{value || "N/A"}</p>
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
                <Avatar name={profileData.user.full_name} />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white capitalize">
                    {profileData.user.full_name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-400">@{profileData.user.username}</span>
                   
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 ring-1 ring-green-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                        Patient
                      </span>
                    
                  </div>
                </div>
              </div>

              {/* Medical Profile */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Medical Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InfoRow icon={Calendar} label="Date of Birth" value={profileData.medical_profile.date_of_birth || "N/A"} color="purple" />
                  <InfoRow icon={User} label="Gender" value={profileData.medical_profile.gender || "N/A"} color="pink" />
                  <InfoRow icon={Droplet} label="Blood Group" value={profileData.medical_profile.blood_group || "N/A"} color="red" />
                  <InfoRow icon={Ruler} label="Height" value={profileData.medical_profile.height && profileData.medical_profile.height !== "0.00" ? `${profileData.medical_profile.height} cm` : "N/A"} color="cyan" />
                  <InfoRow icon={Weight} label="Weight" value={profileData.medical_profile.weight && profileData.medical_profile.weight !== "0.00" ? `${profileData.medical_profile.weight} kg` : "N/A"} color="orange" />
                  <InfoRow icon={MapPin} label="Region" value={profileData.medical_profile.region || "N/A"} color="green" />
                </div>
              </div>

              {/* Cancer Details */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <Syringe className="h-4 w-4" />
                  Cancer & Treatment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InfoRow icon={Activity} label="Cancer Type" value={profileData.medical_profile.cancer_type || "N/A"} color="red" />
                  <InfoRow icon={Pill} label="Treatment Type" value={profileData.medical_profile.cancer_treatment_type || "N/A"} color="purple" />
                  <InfoRow icon={Syringe} label="Chemo History" value={profileData.medical_profile.chemo_history_count > 0 ? `${profileData.medical_profile.chemo_history_count} sessions` : "N/A"} color="orange" />
                  <InfoRow icon={Pill} label="Medicine & Dose" value={profileData.medical_profile.medicine_and_dose || "N/A"} color="blue" />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InfoRow icon={Mail} label="Email" value={profileData.user.email} color="blue" />
                  <InfoRow icon={Phone} label="Phone" value={profileData.user.phone || "N/A"} color="green" />
                </div>
              </div>

              {/* Weight History (if available) */}
              {profileData.weight_history && profileData.weight_history.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/6">
                  <h4 className="text-sm font-medium text-slate-400 mb-3">Weight History</h4>
                  <div className="space-y-1">
                    {profileData.weight_history.map((record, index) => (
                      <div key={index} className="flex items-center justify-between text-sm py-1 px-2 rounded bg-white/3">
                        <span className="text-slate-400">{new Date(record.date).toLocaleDateString()}</span>
                        <span className="text-white font-medium">{record.weight} kg</span>
                      </div>
                    ))}
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

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      let query = `/admin/patient-list/?page=${page}&limit=10`;
      if (search) query += `&search=${search}`;
      const res = await myaxios.get(query);
      if (res.data.status) {
        setPatients(res.data.data);
        setTotalCount(res.data.count);
        setTotalPages(res.data.total_pages);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const delay = setTimeout(() => fetchPatients(), 500);
    return () => clearTimeout(delay);
  }, [fetchPatients]);

  const handlePatientClick = (patientId) => {
    setSelectedPatientId(patientId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatientId(null);
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
            <h2 className="text-lg font-semibold text-white">Patient List</h2>
            <p className="mt-1 text-sm text-slate-500">All registered patients in the system.</p>
          </div>
          <div className="rounded-2xl border border-white/6 bg-white/3 px-3 py-2 text-xs text-slate-400 shrink-0">
            {totalCount} records
          </div>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full rounded-2xl border border-white/6 bg-white/3 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/3 text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-medium">Patient</th>
                  <th className="px-4 py-4 font-medium">Email</th>
                  <th className="px-4 py-4 font-medium">Phone</th>
                  <th className="px-4 py-4 font-medium">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4 bg-black/20">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-slate-600">
                      No patients found.
                    </td>
                  </tr>
                ) : (
                  patients.map((p) => (
                    <tr 
                      key={p.id} 
                      className="transition hover:bg-white/5 cursor-pointer group"
                      onClick={() => handlePatientClick(p.id)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={p.full_name} />
                          <span className="font-medium text-white capitalize group-hover:text-blue-400 transition-colors">
                            {p.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-400">{p.email}</td>
                      <td className="px-4 py-4 text-slate-400">{p.phone}</td>
                      <td className="px-4 py-4">
                        {p.age ? (
                          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 ring-1 ring-blue-500/20">
                            {p.age} yrs
                          </span>
                        ) : (
                          <span className="text-slate-600 text-xs">N/A</span>
                        )}
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
              className="flex items-center gap-1 rounded-xl border border-white/6 bg-white/3 px-3 py-2 text-xs text-slate-400 transition hover:bg-white/6 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 rounded-xl border border-white/6 bg-white/3 px-3 py-2 text-xs text-slate-400 transition hover:bg-white/6 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.article>

      {/* Patient Profile Modal */}
      <PatientProfileModal 
        patientId={selectedPatientId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}