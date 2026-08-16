import { motion, AnimatePresence } from "framer-motion";
import { 
  CircleCheckBig, CircleDashed, CircleX, User, Mail, Phone, 
  Calendar, Stethoscope, GraduationCap, FileText, Clock, Activity, 
  UserCircle, Calendar as CalendarIcon, FileCheck, Clock as ClockIcon, 
  AlertCircle, Pill, Syringe, Weight, Ruler, Droplet, MapPin, X 
} from "lucide-react";
import { useState, useEffect } from "react";
import myaxios from "../../assets/utilities/myaxios";

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

function AppointmentProfileModal({ appointment, isOpen, onClose }) {
  if (!isOpen || !appointment) return null;

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
          <p className="text-sm text-white truncate">{value || "N/A"}</p>
        )}
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'COMPLETED':
        return 'text-green-400 bg-green-500/10 ring-green-500/20';
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-500/10 ring-yellow-500/20';
      case 'CANCELLED':
        return 'text-red-400 bg-red-500/10 ring-red-500/20';
      default:
        return 'text-blue-400 bg-blue-500/10 ring-blue-500/20';
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
      
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <>
      
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/6">
              <div className="relative">
                <Calendar className="h-12 w-12 text-blue-400 p-2 bg-blue-500/10 rounded-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-white">
                  Appointment Details
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1 ${getStatusColor(appointment.status)}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {appointment.status || "N/A"}
                  </span>
                </div>
              </div>
            </div>

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
                <InfoRow icon={Mail} label="Email" value={appointment.patient?.user?.email} color="blue" />
                <InfoRow icon={Phone} label="Phone" value={appointment.patient?.user?.phone} color="green" />
                <InfoRow icon={User} label="Gender" value={appointment.patient?.medical_profile?.gender} color="pink" />
                <InfoRow icon={CalendarIcon} label="Date of Birth" value={appointment.patient?.medical_profile?.date_of_birth} color="purple" />
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Healthcare Provider
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/3 border border-white/5">
                  <Avatar name={appointment.provider?.user?.full_name} imgUrl={appointment.provider?.img_url} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">Provider Name</p>
                    <p className="text-sm text-white capitalize truncate">
                      Dr. {appointment.provider?.user?.full_name || "N/A"}
                    </p>
                  </div>
                </div>
                <InfoRow icon={Stethoscope} label="Specialization" value={appointment.provider?.specialization} color="blue" />
                <InfoRow icon={GraduationCap} label="Qualification" value={appointment.provider?.qualification} color="purple" />
                <InfoRow icon={Phone} label="Phone" value={appointment.provider?.user?.phone} color="green" />
                <InfoRow icon={Mail} label="Email" value={appointment.provider?.user?.email} color="cyan" />
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Appointment Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <InfoRow icon={CalendarIcon} label="Date" value={appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString() : "N/A"} color="blue" />
                <InfoRow icon={ClockIcon} label="Time" value={appointment.slot} color="orange" />
                <InfoRow icon={CalendarIcon} label="Created At" value={appointment.created_at ? new Date(appointment.created_at).toLocaleString() : "N/A"} color="purple" />
                <InfoRow 
                  icon={User} 
                  label={`Appointment By${appointment.appointment_by_role ? ` (${appointment.appointment_by_role})` : ''}`}
                  value={appointment.appointment_by || "N/A"} 
                  color="blue" 
                />
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Medical Details
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <InfoRow icon={AlertCircle} label="Issue Description" value={appointment.issue_description} color="red" />
                <InfoRow icon={FileText} label="Additional Notes" value={appointment.additional_notes} color="amber" />
              </div>
            </div>

            {appointment.patient?.medical_profile && (
              <div className="pt-6 border-t border-white/6">
                <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Patient Medical Profile
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InfoRow icon={Activity} label="Cancer Type" value={appointment.patient.medical_profile.cancer_type} color="red" />
                  <InfoRow icon={Pill} label="Treatment Type" value={appointment.patient.medical_profile.cancer_treatment_type} color="purple" />
                  <InfoRow icon={Syringe} label="Chemo History" value={appointment.patient.medical_profile.chemo_history_count > 0 ? `${appointment.patient.medical_profile.chemo_history_count} sessions` : "N/A"} color="orange" />
                  <InfoRow icon={Pill} label="Medicine & Dose" value={appointment.patient.medical_profile.medicine_and_dose} color="blue" />
                  <InfoRow icon={Weight} label="Weight" value={appointment.patient.medical_profile.weight ? `${appointment.patient.medical_profile.weight} kg` : "N/A"} color="emerald" />
                  <InfoRow icon={Ruler} label="Height" value={appointment.patient.medical_profile.height ? `${appointment.patient.medical_profile.height} cm` : "N/A"} color="cyan" />
                  <InfoRow icon={Droplet} label="Blood Group" value={appointment.patient.medical_profile.blood_group} color="rose" />
                  <InfoRow icon={MapPin} label="Region" value={appointment.patient.medical_profile.region} color="amber" />
                </div>
              </div>
            )}
          </>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function RecentAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(7);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    current_page: 1,
    days_filtered: 7,
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = async (page = 1, daysFilter = days) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await myaxios.get("/admin/recent-appointments/", {
        params: {
          days: daysFilter,
          page: page,
          limit: 10,
        },
      });

      if (response.data.status) {
        setAppointments(response.data.data);
        setPagination({
          count: response.data.count,
          total_pages: response.data.total_pages,
          current_page: response.data.current_page,
          days_filtered: response.data.days_filtered,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch appointments");
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDaysChange = (newDays) => {
    setDays(newDays);
    fetchAppointments(1, newDays);
  };

  const handlePageChange = (newPage) => {
    fetchAppointments(newPage, days);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: "N/A", time: "N/A" };
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric" 
      }),
      time: date.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit" 
      }),
    };
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      Completed: CircleCheckBig,
      Pending: CircleDashed,
      Cancelled: CircleX,
      Scheduled: CircleDashed,
      "In Progress": CircleDashed,
    };
    const IconComponent = statusIcons[status] || CircleDashed;
    return <IconComponent className="h-3.5 w-3.5" />;
  };

  const getStatusStyles = (status) => {
    const styles = {
      Completed: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20",
      Pending: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/20",
      Cancelled: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/20",
      Scheduled: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20",
      "In Progress": "bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/20",
    };
    return styles[status] || "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/20";
  };

  if (loading) {
    return (
      <motion.article
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        className="xl:col-span-3 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-400">Loading appointments...</div>
        </div>
      </motion.article>
    );
  }

  if (error) {
    return (
      <motion.article
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        className="xl:col-span-3 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-rose-400">Error: {error}</div>
        </div>
      </motion.article>
    );
  }

  return (
    <>
      <motion.article
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        className="xl:col-span-3 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Appointments</h2>
            <p className="mt-1 text-sm text-slate-400">
              Latest activity across the medical system.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => handleDaysChange(Number(e.target.value))}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
              {pagination.count} records
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-4 font-medium">Patient Name</th>
                  <th className="px-4 py-4 font-medium">Doctor Name</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                  <th className="px-4 py-4 font-medium">Time</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/30">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      No appointments found for the selected period
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment, index) => {
                    const  date = formatDateTime(appointment.appointment_date || appointment.created_at).date;
                    const time = appointment.slot || "N/A";
                    const patientName = appointment.patient?.user?.full_name || "Unknown Patient";
                    const doctorName = appointment.provider?.user?.full_name || "Unknown Doctor";
                    
                    return (
                      <tr 
                        key={appointment.id || index} 
                        className="transition hover:bg-white/5 cursor-pointer group"
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={patientName} />
                            <span className="font-medium text-white capitalize group-hover:text-blue-400 transition-colors">
                              {patientName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs">Dr.</span>
                            <span className="text-slate-300 group-hover:text-blue-400 transition-colors">
                              {doctorName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-400">
                          {date}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 ring-1 ring-blue-500/20">
                            <Clock className="h-3 w-3" />
                            {time}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusStyles(appointment.status)}`}
                          >
                            {getStatusIcon(appointment.status)}
                            {appointment.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination.total_pages > 1 && (
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Page {pagination.current_page} of {pagination.total_pages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.article>

      <AppointmentProfileModal 
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}