import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import myaxios from '../../utilities/myaxios';

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  return (
    <div style={{
      width: 64, height: 64, borderRadius: "50%",
      background: "linear-gradient(135deg, #1e40af, #7c3aed)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 22, fontWeight: 700, color: "#fff",
      border: "2px solid rgba(99,102,241,0.3)", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: "12px 16px",
    }}>
      <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#475569", margin: "0 0 4px 0" }}>
        {label}
      </p>
      {value !== null && value !== undefined && value !== "" ? (
        <p style={{ fontSize: 14, fontWeight: 500, color: "#cbd5e1", margin: 0 }}>{value}</p>
      ) : (
        <span style={{
          display: "inline-block", fontSize: 11,
          background: "#1e293b", color: "#475569",
          borderRadius: 6, padding: "2px 8px",
        }}>N/A</span>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 600, textTransform: "uppercase",
      letterSpacing: "0.1em", color: "#6366f1", margin: "0 0 16px 0",
    }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "24px 0" }} />;
}

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await myaxios.get("user-profile");
        if (res.data.status) setProfile(res.data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#030812", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ minHeight: "100vh", background: "#030812", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#475569", fontSize: 14 }}>Profile not found.</p>
      </div>
    );
  }

  const user = profile.user ?? {};
  const med = profile.medical_profile ?? {};  // null হলে {} হবে, error নেই

  return (
    <div style={{ minHeight: "100vh", background: "#030812", padding: "32px" }}>
      <motion.div
        variants={sectionReveal}
        initial="hidden"
        animate="show"
        style={{
          background: "#060d1f",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 24,
          padding: "32px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <Avatar name={user.full_name} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
                {user.full_name}
              </h1>
              <span style={{
                display: "inline-flex", alignItems: "center",
                background: "rgba(99,102,241,0.15)", color: "#818cf8",
                border: "1px solid rgba(99,102,241,0.25)",
                borderRadius: 20, fontSize: 11, fontWeight: 500, padding: "3px 10px",
              }}>
                Patient
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>@{user.username}</p>
          </div>
        </div>

        <Divider />

        <SectionTitle>Account Information</SectionTitle>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12, marginBottom: 24,
        }}>
          <Field label="Username" value={user.username} />
          <Field label="Full Name" value={user.full_name} />
          <Field label="Email" value={user.email} />
          <Field label="Phone" value={user.phone} />
        </div>

        <Divider />

        <SectionTitle>Medical Profile</SectionTitle>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}>
          <Field label="Cancer Type" value={med.cancer_type} />
          <Field label="Treatment Type" value={med.cancer_treatment_type} />
          <Field label="Medicine & Dose" value={med.medicine_and_dose} />
          <Field label="Chemo History Count" value={med.chemo_history_count} />
          <Field label="Gender" value={med.gender} />
          <Field label="Date of Birth" value={med.date_of_birth} />
          <Field label="Height (m)" value={med.height} />
          <Field label="Weight (kg)" value={med.weight} />
          <Field label="Region" value={med.region} />
        </div>
      </motion.div>
    </div>
  );
}