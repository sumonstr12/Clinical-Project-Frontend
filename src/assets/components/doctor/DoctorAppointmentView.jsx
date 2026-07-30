import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Stethoscope,
  GraduationCap,
  FileText,
  Clock,
  Activity,
  UserCircle,
  Calendar as CalendarIcon,
  FileCheck,
  Clock as ClockIcon,
  AlertCircle,
  Pill,
  Syringe,
  Weight,
  Ruler,
  Droplet,
  MapPin,
} from "lucide-react";
import myaxios from "../../utilities/myaxios";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

function Avatar({ name, imgUrl }) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
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

function AppointmentProfileModal({ appointment, isOpen, onClose }) {
  if (!isOpen || !appointment) return null;

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    color = "blue",
    isLink = false,
  }) => (
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
          <p className="text-sm text-white truncate">{value || "N/A"}</p>
        )}
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "text-green-400 bg-green-500/10 ring-green-500/20";
      case "PENDING":
        return "text-yellow-400 bg-yellow-500/10 ring-yellow-500/20";
      case "CANCELLED":
        return "text-red-400 bg-red-500/10 ring-red-500/20";
      default:
        return "text-blue-400 bg-blue-500/10 ring-blue-500/20";
    }
  };

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

          <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/6">
              <div className="relative">
                <Calendar className="h-12 w-12 text-blue-400 p-2 bg-blue-500/10 rounded-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-white">
                  Appointment Details
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-sm text-slate-400">
                    #{appointment.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1 ${getStatusColor(appointment.status)}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {appointment.status || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Patient Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/3 border border-white/5">
                  <Avatar name={appointment.patient?.user?.full_name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">Patient Name</p>
                    <p className="text-sm text-white capitalize truncate">
                      {appointment.patient?.user?.full_name || "N/A"}
                    </p>
                  </div>
                </div>
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={appointment.patient?.user?.email}
                  color="blue"
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={appointment.patient?.user?.phone}
                  color="green"
                />
                <InfoRow
                  icon={User}
                  label="Gender"
                  value={appointment.patient?.medical_profile?.gender}
                  color="pink"
                />
                <InfoRow
                  icon={CalendarIcon}
                  label="Date of Birth"
                  value={appointment.patient?.medical_profile?.date_of_birth}
                  color="purple"
                />
              </div>
            </div>

            {/* Appointment Details */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Appointment Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <InfoRow
                  icon={CalendarIcon}
                  label="Date"
                  value={
                    appointment.appointment_date
                      ? new Date(
                          appointment.appointment_date,
                        ).toLocaleDateString()
                      : "N/A"
                  }
                  color="blue"
                />
                <InfoRow
                  icon={ClockIcon}
                  label="Time"
                  value={appointment.slot}
                  color="orange"
                />
                <InfoRow
                  icon={CalendarIcon}
                  label="Created At"
                  value={
                    appointment.created_at
                      ? new Date(appointment.created_at).toLocaleString()
                      : "N/A"
                  }
                  color="purple"
                />
                <InfoRow
                  icon={User}
                  label={`Appointment By${appointment.appointment_by_role ? ` (${appointment.appointment_by_role})` : ""}`}
                  value={appointment.appointment_by || "N/A"}
                  color="blue"
                />
              </div>
            </div>

            {/* Medical Details */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Medical Details
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <InfoRow
                  icon={AlertCircle}
                  label="Issue Description"
                  value={appointment.issue_description}
                  color="red"
                />
                <InfoRow
                  icon={FileText}
                  label="Additional Notes"
                  value={appointment.additional_notes}
                  color="amber"
                />
              </div>
            </div>

            {/* Patient Medical Profile */}
            {appointment.patient?.medical_profile && (
              <div className="pt-6 border-t border-white/6">
                <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Patient Medical Profile
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InfoRow
                    icon={Activity}
                    label="Cancer Type"
                    value={appointment.patient.medical_profile.cancer_type}
                    color="red"
                  />
                  <InfoRow
                    icon={Pill}
                    label="Treatment Type"
                    value={
                      appointment.patient.medical_profile.cancer_treatment_type
                    }
                    color="purple"
                  />
                  <InfoRow
                    icon={Syringe}
                    label="Chemo History"
                    value={
                      appointment.patient.medical_profile.chemo_history_count >
                      0
                        ? `${appointment.patient.medical_profile.chemo_history_count} sessions`
                        : "N/A"
                    }
                    color="orange"
                  />
                  <InfoRow
                    icon={Pill}
                    label="Medicine & Dose"
                    value={
                      appointment.patient.medical_profile.medicine_and_dose
                    }
                    color="blue"
                  />
                  <InfoRow
                    icon={Weight}
                    label="Weight"
                    value={
                      appointment.patient.medical_profile.weight
                        ? `${appointment.patient.medical_profile.weight} kg`
                        : "N/A"
                    }
                    color="emerald"
                  />
                  <InfoRow
                    icon={Ruler}
                    label="Height"
                    value={
                      appointment.patient.medical_profile.height
                        ? `${appointment.patient.medical_profile.height} cm`
                        : "N/A"
                    }
                    color="cyan"
                  />
                  <InfoRow
                    icon={Droplet}
                    label="Blood Group"
                    value={appointment.patient.medical_profile.blood_group}
                    color="rose"
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Region"
                    value={appointment.patient.medical_profile.region}
                    color="amber"
                  />
                </div>
              </div>
            )}
          </>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function StatusDropdown({ appointment, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const STATUS_OPTIONS = [
    {
      value: "PENDING",
      label: "Pending",
      color: "text-yellow-400 bg-yellow-500/10 ring-yellow-500/20",
    },
    {
      value: "APPROVED",
      label: "Approved",
      color: "text-green-400 bg-green-500/10 ring-green-500/20",
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
      color: "text-red-400 bg-red-500/10 ring-red-500/20",
    },
    {
      value: "COMPLETED",
      label: "Completed",
      color: "text-blue-400 bg-blue-500/10 ring-blue-500/20",
    },
  ];

  const getStatusStyle = (status) => {
    const option = STATUS_OPTIONS.find(
      (opt) => opt.value === status?.toUpperCase(),
    );
    return option?.color || "text-gray-400 bg-gray-500/10 ring-gray-500/20";
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === appointment.status) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await myaxios.post("/doctor/appointment/approval/", {
        appointment_id: appointment.id,
        status: newStatus,
      });

      if (response.data.status) {
        
        onStatusChange?.(appointment.id, newStatus);
       
        setIsOpen(false);
        
        console.log("Status updated successfully");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatus = appointment.status || "PENDING";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-all hover:ring-2 ${getStatusStyle(currentStatus)} ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        )}
        {currentStatus}
        {!isLoading && (
          <svg
            className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {isOpen && !isLoading && (
        <div className="absolute right-0 mt-2 w-48 bg-[#0a0f1e] border border-white/6 rounded-xl shadow-2xl shadow-black/60 py-1 z-50 overflow-hidden">
          {STATUS_OPTIONS.map((option) => {
            const isActive = option.value === currentStatus;
            return (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                disabled={isActive}
                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                  isActive
                    ? "bg-white/5 text-white cursor-default"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    option.value === "PENDING"
                      ? "bg-yellow-400"
                      : option.value === "APPROVED"
                        ? "bg-green-400"
                        : option.value === "CANCELLED"
                          ? "bg-red-400"
                          : "bg-blue-400"
                  }`}
                />
                {option.label}
                {isActive && (
                  <svg
                    className="h-4 w-4 ml-auto text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DoctorAppointmentView() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      let query = `/doctor/appointment/view-list/?page=${page}&limit=10`;
      if (search) query += `&search=${search}`;
      const res = await myaxios.get(query);
      if (res.data.status) {
        setAppointments(res.data.data);
        setTotalCount(res.data.count);
        setTotalPages(res.data.total_pages);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const delay = setTimeout(() => fetchAppointments(), 500);
    return () => clearTimeout(delay);
  }, [fetchAppointments]);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "text-green-400 bg-green-500/10 ring-green-500/20";
      case "PENDING":
        return "text-yellow-400 bg-yellow-500/10 ring-yellow-500/20";
      case "CANCELLED":
        return "text-red-400 bg-red-500/10 ring-red-500/20";
      default:
        return "text-blue-400 bg-blue-500/10 ring-blue-500/20";
    }
  };

  const handleStatusUpdate = useCallback((appointmentId, newStatus) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((app) =>
        app.id === appointmentId ? { ...app, status: newStatus } : app,
      ),
    );
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
            <h2 className="text-lg font-semibold text-white">Appointments</h2>
            <p className="mt-1 text-sm text-slate-500">
              All patient appointments in the system.
            </p>
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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by patient name or username..."
            className="w-full rounded-2xl border border-white/6 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-medium">Patient</th>
                  <th className="px-4 py-4 font-medium">Provider</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                  <th className="px-4 py-4 font-medium">Slot</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-black/20">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-slate-600"
                    >
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="transition hover:bg-white/5 cursor-pointer group"
                      
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3" 
                            onClick={() => handleAppointmentClick(appointment)}
                        >
                          <Avatar name={appointment.patient?.user?.full_name} />
                          <span className="font-medium text-white capitalize group-hover:text-blue-400 transition-colors">
                            {appointment.patient?.user?.full_name || "N/A"}
                            
                          </span>
                          
                        </div>
                        
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs">Dr.</span>
                          <span className="text-slate-300 group-hover:text-blue-400 transition-colors">
                            {appointment.provider?.user?.full_name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {formatDate(appointment.appointment_date)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 ring-1 ring-blue-500/20">
                          <Clock className="h-3 w-3" />
                          {appointment.slot}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusDropdown 
                            appointment={appointment} 
                            onStatusChange={handleStatusUpdate}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-slate-600">
            Page {page} of {totalPages}
          </span>
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

      {/* Appointment Profile Modal */}
      <AppointmentProfileModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
