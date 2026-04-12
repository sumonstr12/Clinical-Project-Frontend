import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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

export default function ApprovedDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
          <h2 className="text-lg font-semibold text-white">Non-Approved Doctors</h2>
          <p className="mt-1 text-sm text-slate-500">Doctors pending approval review.</p>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-black/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-600">
                    No doctors found.
                  </td>
                </tr>
              ) : (
                doctors.map((doc) => (
                  <tr key={doc.id} className="transition hover:bg-white/5">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={doc.full_name} imgUrl={doc.img_url} />
                        <span className="font-medium text-white capitalize">{doc.user.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-400">{doc.specialization}</td>
                    <td className="px-4 py-4 text-slate-400">{doc.qualification}</td>
                    <td className="px-4 py-4 text-slate-400 capitalize">{doc.gender}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 ring-1 ring-amber-500/20">
                        {doc.license_count} licenses
                      </span>
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
  );
}