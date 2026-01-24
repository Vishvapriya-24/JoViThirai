import { useState, useEffect } from "react";
import { FaEnvelope, FaEdit, FaSave, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../../api/ProfileApi";

const API = import.meta.env.VITE_API_URL;

function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    gender: "",
    nickname: "",
    country: "",
    language: "",
    timezone: "GMT-5",
    profile_pic: "",
  });

  const [profileFile, setProfileFile] = useState(null);

  // ✅ auth states
  const [userId, setUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());

  // ✅ 1) CHECK AUTH (cookie based)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/check-auth`, {
          method: "GET",
          credentials: "include", // ✅ must send cookie
        });

        if (!res.ok) throw new Error("Not logged in");

        const data = await res.json();
        setUserId(data.user.id); // backend returns req.user
      } catch (err) {
        setUserId(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ 2) FETCH PROFILE
  useEffect(() => {
    if (!userId) return;

    getProfile(userId)
      .then((res) => {
        setProfile(res.data.profile);
      })
      .catch((err) => {
        console.log("Get profile failed:", err);
      });
  }, [userId]);

  // ✅ auto update time
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);

      // preview image
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, profile_pic: imageUrl }));
    }
  };

  const handleSubmitChanges = async () => {
    if (!userId) return;

    if (editing) {
      try {
        const formData = new FormData();
        formData.append("full_name", profile.full_name);
        formData.append("nickname", profile.nickname);
        formData.append("gender", profile.gender);
        formData.append("country", profile.country);
        formData.append("language", profile.language);
        formData.append("timezone", profile.timezone);

        if (profileFile) {
          formData.append("profile_pic", profileFile);
        }

        await updateProfile(userId, formData);
        alert("Profile updated successfully!");
      } catch (err) {
        console.log("Update failed:", err);
        alert("Failed to update profile");
      }
    }

    setEditing((prev) => !prev);
  };

  // ✅ loading
  if (authLoading) {
    return (
      <h2 style={{ color: "white", textAlign: "center", marginTop: "80px" }}>
        Loading...
      </h2>
    );
  }

  // ✅ not logged in
  if (!userId) {
    return (
      <div style={{ marginTop: "100px", textAlign: "center" }}>
        <h2 style={{ color: "white" }}>Please login to view profile</h2>
        <button
          style={{
            marginTop: "15px",
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#4a6cf7",
            color: "white",
            fontWeight: "bold",
          }}
          onClick={() => navigate("/signin")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ✅ handle profile image
  const profileImageSrc = profile.profile_pic
    ? profile.profile_pic.startsWith("blob:")
      ? profile.profile_pic
      : `${API}${profile.profile_pic}`
    : "/default-avatar.png";

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#f4f6fa",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      background: "linear-gradient(135deg, #4a6cf7, #6ec1e4)",
      color: "#fff",
      padding: "50px 20px",
      textAlign: "center",
    },
    card: {
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      padding: "30px",
      width: "950px",
      margin: "20px auto",
    },
    headerCard: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    profileBox: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    profilePicWrapper: {
      position: "relative",
      width: "100px",
      height: "100px",
    },
    profilePic: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #ddd",
    },
    uploadIcon: {
      position: "absolute",
      bottom: "5px",
      right: "5px",
      background: "#4a6cf7",
      color: "#fff",
      borderRadius: "50%",
      padding: "6px",
      cursor: "pointer",
      fontSize: "14px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginTop: "20px",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "6px",
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      transition: "all 0.2s ease",
    },
    button: {
      background: "#4a6cf7",
      color: "#fff",
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    emailSection: {
      marginTop: "25px",
    },
    emailItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginTop: "8px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>Welcome, {profile.full_name || "User"} 👋</h1>
        <p>{dateTime.toLocaleString()}</p>
      </div>

      {/* Profile Card */}
      <div style={styles.card}>
        <div style={styles.headerCard}>
          <div style={styles.profileBox}>
            <div style={styles.profilePicWrapper}>
              <img src={profileImageSrc} alt="Profile" style={styles.profilePic} />

              <label style={styles.uploadIcon}>
                <FaCamera />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  disabled={!editing}
                />
              </label>
            </div>

            <div>
              <h3>{profile.full_name}</h3>
              <p style={{ color: "#777" }}>{profile.email}</p>
            </div>
          </div>

          <button style={styles.button} onClick={handleSubmitChanges}>
            {editing ? <FaSave /> : <FaEdit />}
            {editing ? "Save" : "Edit"}
          </button>
        </div>

        {/* Profile Info */}
        <div style={styles.grid}>
          {[
            { label: "Full Name", field: "full_name" },
            { label: "Nick Name", field: "nickname" },
            { label: "Gender", field: "gender" },
            { label: "Country", field: "country" },
            { label: "Language", field: "language" },
            { label: "Time Zone", field: "timezone" },
          ].map((item) => (
            <div key={item.field}>
              <div style={styles.label}>{item.label}</div>
              <input
                style={{
                  ...styles.input,
                  outline:
                    editing && activeField === item.field
                      ? "2px solid #4a6cf7"
                      : "none",
                  cursor: editing ? "text" : "not-allowed",
                  background: editing ? "#fff" : "#f9f9f9",
                }}
                name={item.field}
                value={profile[item.field] || ""}
                onChange={handleChange}
                onFocus={() => setActiveField(item.field)}
                onBlur={() => setActiveField(null)}
                readOnly={!editing}
              />
            </div>
          ))}
        </div>

        {/* Email Section */}
        <div style={styles.emailSection}>
          <h4>My email Addresses</h4>
          <div style={styles.emailItem}>
            <FaEnvelope style={{ color: "#4a6cf7" }} />
            <div>
              <div>{profile.email}</div>
              <small style={{ color: "#999" }}>Primary</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
