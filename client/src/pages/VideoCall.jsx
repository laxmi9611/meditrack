import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JitsiMeeting } from "@jitsi/react-sdk";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const VideoCall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await API.get(`/appointments/${id}`);
        if (
          data.status !== "confirmed" &&
          data.status !== "pending"
        ) {
          toast.error("This appointment is not active");
          navigate("/appointments");
          return;
        }
        setAppointment(data);
      } catch (err) {
        toast.error("Appointment not found");
        navigate("/appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id, navigate]);

  const handleEndCall = () => {
    navigate(`/appointments/${id}`);
  };

  if (loading) return <Loader message="Preparing video call..." />;
  if (!appointment) return null;

  const other =
    user.role === "doctor" ? appointment.patient : appointment.doctor;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>🎥 Video Consultation</h1>
          <p style={styles.subtext}>
            In call with{" "}
            {user.role === "doctor"
              ? other?.name
              : `Dr. ${other?.name}`}
          </p>
        </div>
        <button onClick={handleEndCall} style={styles.endBtn}>
          End Call
        </button>
      </div>

      <div style={styles.iframeWrap}>
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={appointment.roomId || `meditrack-${appointment._id}`}
          configOverwrite={{
            startWithAudioMuted: true,
            disableModeratorIndicator: true,
            startScreenSharing: false,
            enableEmailInStats: false,
            prejoinPageEnabled: true,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
          }}
          userInfo={{
            displayName:
              user.role === "doctor"
                ? `Dr. ${user.name}`
                : user.name,
            email: user.email,
          }}
          onApiReady={(externalApi) => {
            externalApi.addListener("videoConferenceLeft", () => {
              handleEndCall();
            });
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";
            iframeRef.style.border = "none";
            iframeRef.style.borderRadius = "14px";
          }}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "1.5rem",
    height: "calc(100vh - 130px)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  heading: { fontSize: "1.4rem", color: "#0f172a" },
  subtext: { color: "#64748b", fontSize: "0.9rem", marginTop: "0.2rem" },
  endBtn: {
    padding: "0.7rem 1.5rem",
    background: "#dc2626",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  iframeWrap: {
    flex: 1,
    minHeight: "500px",
    background: "#0f172a",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
};

export default VideoCall;