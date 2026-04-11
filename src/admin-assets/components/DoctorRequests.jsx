import { motion } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import myaxios from "../../assets/utilities/myaxios";
import { successToast, errorToast } from "../../assets/utilities/toast";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const BASE_URL = "http://127.0.0.1:8000";

export default function DoctorRequests({ requests = [] }) {
  const [apiData, setApiData] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  
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
              onClick={() => setSelectedDoctor(request)}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/7 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{request.full_name}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Specialization: <span className="text-cyan-300">{request.specialization}</span>
                    </p>
                  </div>

                  <div className="rounded-full bg-slate-950/50 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
                    {new Date(request.date_of_birth).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(request);
                    }}
                    className="flex-1 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200"
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
                    className="flex-1 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300 hover:bg-rose-500/20 hover:text-rose-200"
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

      {/* MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-2xl w-[90%] max-w-2xl relative">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-3 right-3 text-white"
            >
              ✕
            </button>

            <img
              src={
                selectedDoctor.img_url?.startsWith("http")
                  ? selectedDoctor.img_url
                  : `${BASE_URL}${selectedDoctor.img_url}`
              }
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <h2 className="text-xl font-bold text-white mb-2">{selectedDoctor.full_name}</h2>
            <p className="text-slate-400">Qualification: {selectedDoctor.qualification}</p>
            <p className="text-slate-400">Gender: {selectedDoctor.gender}</p>
            <p className="text-slate-400 mb-4">License: {selectedDoctor.license_count}</p>

            {/* CV Preview */}
            <div className="h-64 border border-white/10 rounded-lg overflow-hidden">
              <iframe
                title="cv"
                src={`https://docs.google.com/gview?url=${BASE_URL}${selectedDoctor.cv}&embedded=true`}
                className="w-full h-full"
              />
            </div>

            <a
              href={`${BASE_URL}${selectedDoctor.cv}`}
              target="_blank"
              download
              className="mt-3 inline-block bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30"
            >
              Download CV
            </a>
          </div>
        </div>
      )}
    </>
  );
}


