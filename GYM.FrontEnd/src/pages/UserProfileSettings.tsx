import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getUserDetails, updateUserDetails } from "../services/userDetails";
import type { UserDetailData } from "../types/user";
import "../css/ProfileSettings.css";

interface AccountForm {
  firstName: string;
  lastName: string;
  age: string;
}

export default function ProfileSettings() {
  const [details, setDetails] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [accountForm, setAccountForm] = useState<AccountForm>({
    firstName: "",
    lastName: "",
    age: ""
  });

  useEffect(() => {
    loadUserDetails();
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
      lastName: data.surname || "",
      age: data.age !== undefined && data.age !== null ? String(data.age) : "",
    });
    setLoading(false);
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAccountForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateAccount = async () => {
  const ageNumber = Number(accountForm.age);

  if (
    !accountForm.firstName.trim() ||
    !accountForm.lastName.trim() ||
    accountForm.age.trim() === "" ||
    Number.isNaN(ageNumber) ||
    ageNumber <= 0
  ) {
    toast.error("Enter valid values for all fields.");
    return;
  }

  setSaving(true);

  const body: UserDetailData = {
    ...details,
    name: accountForm.firstName,
    surname: accountForm.lastName,
    age: ageNumber,
  } as UserDetailData;

  const result = await updateUserDetails(body);

  if (result) {
    toast.success("Profile updated successfully!");
    setDetails(result);
    setAccountForm((prev) => ({ ...prev, age: String(result.age ?? "") }));
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
          <h1 className="content-title">Account settings</h1>

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

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  placeholder="Enter age"
                  value={accountForm.age}
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