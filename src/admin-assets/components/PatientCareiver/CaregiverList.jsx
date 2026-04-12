import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import myaxios from "../../../assets/utilities/myaxios";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const statusStyles = {
  active: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
  inactive: "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20",
  rejected: "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20",
};

function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-violet-600/40 to-pink-600/40 ring-1 ring-white/10 text-xs font-semibold text-white shrink-0">
      {initials}
    </div>
  );
}

export default function CaregiverList() {
  const [caregivers, setCaregivers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCaregivers = useCallback(async () => {
    setLoading(true);
    try {
      let query = `/admin/caregiver-list/?page=${page}&limit=10`;
      if (search) query += `&search=${search}`;
      const res = await myaxios.get(query);
      if (res.data.status) {
        setCaregivers(res.data.data);
        setTotalCount(res.data.count);
        setTotalPages(res.data.total_pages);
      }
    } catch (err) {
      console.error("Error fetching caregivers:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const delay = setTimeout(() => fetchCaregivers(), 500);
    return () => clearTimeout(delay);
  }, [fetchCaregivers]);

  return (
    <motion.article
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      className="xl:col-span-3 rounded-3xl border border-white/6 bg-[#0a0f1e] p-5 shadow-2xl shadow-black/40 sm:p-6"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Caregiver List</h2>
          <p className="mt-1 text-sm text-slate-500">All registered caregivers in the system.</p>
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
                <th className="px-4 py-4 font-medium">Caregiver</th>
                <th className="px-4 py-4 font-medium">Email</th>
                <th className="px-4 py-4 font-medium">Phone</th>
                <th className="px-4 py-4 font-medium">Patient</th>
                <th className="px-4 py-4 font-medium">Relation</th>
                <th className="px-4 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4 bg-black/20">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                  </td>
                </tr>
              ) : caregivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-600">
                    No caregivers found.
                  </td>
                </tr>
              ) : (
                caregivers.map((c) => (
                  <tr key={c.id} className="transition hover:bg-white/3">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.full_name} />
                        <span className="font-medium text-white capitalize">{c.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-400">{c.email}</td>
                    <td className="px-4 py-4 text-slate-400">{c.phone}</td>
                    <td className="px-4 py-4 text-slate-400">
                      {c.patient_name ?? (
                        <span className="text-slate-600 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {c.relation_type ?? (
                        <span className="text-slate-600 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {c.status ? (
                        <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium capitalize ${statusStyles[c.status] ?? statusStyles.inactive}`}>
                          {c.status}
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
  );
}