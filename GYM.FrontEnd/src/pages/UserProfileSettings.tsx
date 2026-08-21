import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getUserDetails, updateUserDetails } from "../services/userDetails";
import { getUserStatistics } from "../api/stadistics";
import type { UserDetailData } from "../types/user";
import type { StatsDTO } from "../types/StatsDTO";
import "../css/ProfileSettings.css";

interface AccountForm {
  firstName: string;
  lastName: string;
}

export default function ProfileSettings() {
  const [details, setDetails] = useState<UserDetailData | null>(null);
  const [latestStats, setLatestStats] = useState<StatsDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [accountForm, setAccountForm] = useState<AccountForm>({
    firstName: "",
    lastName: ""
  });

  useEffect(() => {
    loadUserDetails();
    loadLatestStats();
  }, []);

  const loadUserDetails = async () => {
    setLoading(true);
    setError(null);

    const data = await getUserDetails();

    if (!data) {
      setError("Could not load your profile details.");
      setLoading(false);
      return;
    }

    setDetails(data);
    setAccountForm({
      firstName: data.name || "",
      lastName: data.surname || ""
    });
    setLoading(false);
  };

  const loadLatestStats = async () => {
    try {
      const stats = await getUserStatistics();
      if (Array.isArray(stats) && stats.length > 0) {
        const sorted = [...stats].sort(
          (a, b) => new Date(b.measureAt).getTime() - new Date(a.measureAt).getTime()
        );
        setLatestStats(sorted[0]);
      } else {
        setLatestStats(null);
      }
    } catch (err) {
      setLatestStats(null);
    }
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAccountForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateAccount = async () => {
    if (!accountForm.firstName.trim() || !accountForm.lastName.trim()) {
      toast.error("Enter valid values for all fields.");
      return;
    }

    setSaving(true);

    const body: UserDetailData = {
      ...details,
      name: accountForm.firstName,
      surname: accountForm.lastName,
    } as UserDetailData;

    const result = await updateUserDetails(body);

    if (result) {
      toast.success("Profile updated successfully!");
      setDetails(result);
    } else {
      toast.error("Could not update your profile. Try again.");
    }

    setSaving(false);
  };

  return (
    <div className="profilesettings-page">
      <div className="settings-container">
        <aside className="sidebar">
          <div className="avatar-wrapper">
            <div className="avatar-placeholder">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            {details && (
              <p className="avatar-name">
                {details.name} {details.surname}
              </p>
            )}
          </div>
        </aside>

        <main className="content">
          <h1 className="content-title">Your account</h1>

          {latestStats && (
            <div className="profile-stats-summary">
              <h2 className="profile-stats-title">Latest stats</h2>
              <div className="profile-stats-grid">
                <div>
                  <p className="stats-label">Weight</p>
                  <p className="stats-value">{latestStats.weight} kg</p>
                </div>
                <div>
                  <p className="stats-label">Height</p>
                  <p className="stats-value">{latestStats.height} cm</p>
                </div>
                <div>
                  <p className="stats-label">Strength</p>
                  <p className="stats-value">{latestStats.strength} kg</p>
                </div>
                <div>
                  <p className="stats-label">Age</p>
                  <p className="stats-value">{details?.age}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <p className="content-status">Loading your profile...</p>
          ) : error ? (
            <p className="content-status content-status-error">{error}</p>
          ) : (
            <form
              className="settings-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateAccount();
              }}
            >
              <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Enter first name"
                  value={accountForm.firstName}
                  onChange={handleAccountChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Enter last name"
                  value={accountForm.lastName}
                  onChange={handleAccountChange}
                />
              </div>

              <button type="submit" className="update-btn" disabled={saving}>
                {saving ? "Saving..." : "Update"}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}