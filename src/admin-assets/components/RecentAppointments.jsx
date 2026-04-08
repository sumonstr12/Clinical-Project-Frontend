import { motion } from "framer-motion";
import { CircleCheckBig, CircleDashed, CircleX } from "lucide-react";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const statusStyles = {
  Completed: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20",
  Pending: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/20",
  Cancelled: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/20",
};

const recentAppointments = [
  { patient: "Olivia Carter", doctor: "Dr. Maya Patel", date: "Jun 14, 2026", time: "09:00 AM", status: "Completed" },
  { patient: "Ethan Brooks", doctor: "Dr. Liam Chen", date: "Jun 14, 2026", time: "10:30 AM", status: "Pending" },
  { patient: "Sophia Reed", doctor: "Dr. Amina Khan", date: "Jun 13, 2026", time: "01:15 PM", status: "Cancelled" },
  { patient: "Noah Wilson", doctor: "Dr. Daniel Ortiz", date: "Jun 13, 2026", time: "02:45 PM", status: "Completed" },
  { patient: "Isabella Moore", doctor: "Dr. Sarah Kim", date: "Jun 12, 2026", time: "11:20 AM", status: "Pending" },
];

export default function RecentAppointments() {
  return (
    <motion.article
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      className="xl:col-span-3 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent Appointments</h2>
          <p className="mt-1 text-sm text-slate-400">Latest activity across the medical system.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
          5 recent records
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
              {recentAppointments.map((row, index) => (
                <tr key={index} className="transition hover:bg-white/5">
                  <td className="px-4 py-4 font-medium text-white">{row.patient}</td>
                  <td className="px-4 py-4 text-slate-300">{row.doctor}</td>
                  <td className="px-4 py-4 text-slate-300">{row.date}</td>
                  <td className="px-4 py-4 text-slate-300">{row.time}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${statusStyles[row.status]}`}>
                      {row.status === "Completed" && <CircleCheckBig className="h-3.5 w-3.5" />}
                      {row.status === "Pending" && <CircleDashed className="h-3.5 w-3.5" />}
                      {row.status === "Cancelled" && <CircleX className="h-3.5 w-3.5" />}
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.article>
  );
}