//frontend-admin frontend/src/pages/EditUser.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../api/userService";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const changeCardNumberUI = (number) => {
    console.log("Original card number:", number);
    number = number.toString();
    for (let i = 0; i < number.length; i++) {
      if(i % 4 === 0) {
        number = number.substring(0, i) + " " + number.substring(i);
        i++; // account for the added space
      }
    }
    return number;
  }
  useEffect(() => {
    async function load() {
      try {
        const data = await getUserById(id);
        setUser(data.user || data);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, [id]);

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (channel) => {
    setUser((prev) => ({
      ...prev,
      promoChannels: {
        ...prev.promoChannels,
        [channel]: {
          ...prev.promoChannels[channel],
          enabled: !prev.promoChannels[channel].enabled,
        },
      },
    }));
  };

  const saveChanges = async () => {
    setSaving(true);
    setError("");

    try {
      const req = await updateUser(id, user);
      if (req.success) {
        navigate(`/users/${id}`);
      }
      console.log("User updated:", req);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <p className="text-gray-600">Loading...</p>;

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="px-3 py-1 bg-gray-200 rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold">Edit User</h2>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded shadow p-6">
        {/* LEFT SIDE FIELDS */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              className="border rounded px-3 py-2 w-full"
              placeholder="First Name"
              value={user.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              className="border rounded px-3 py-2 w-full"
              placeholder="Last Name"
              value={user.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>
          <div className="flex  flex-row gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="mobile-prefix">Mobile Number Prefix</label>
              <input
                id="mobile-prefix"
                className="border rounded px-3 py-2 w-full"
                placeholder="Phone Prefix"
                value={user.phoneCode}
                onChange={(e) => handleChange("phoneCode", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="mobile-number">Mobile Number</label>
              <input
                id="mobile-number"
                className="border rounded px-3 py-2 w-full"
                placeholder="Phone Number"
                value={user.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="border rounded px-3 py-2 w-full"
              placeholder="Email"
              value={user.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="dateOfBirth">DateOfBirth</label>
            <input
              type="date"
              id="dateOfBirth"
              className="border rounded px-3 py-2 w-full"
              placeholder="DateOfBirth"
              value={user.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              className="border rounded px-3 py-2 w-full"
              placeholder="Country"
              value={user.country}
              onChange={(e) => handleChange("country", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="city">City</label>
            <input
              id="city"
              className="border rounded px-3 py-2 w-full"
              placeholder="City"
              value={user.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              className="border rounded px-3 py-2 w-full"
              placeholder="Address"
              value={user.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p >Card Number</p>
            <p className="font-semibold text-gray-600 border  rounded px-3 py-2 w-full ">{changeCardNumberUI(user.cardNumber)}</p>
          </div>
          <div className="flex flex-row gap-4 pt-10">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={user.promoChannels.sms.enabled}
                onChange={() => handleCheckboxChange("sms")}
              />
              <label>SMS Promotions</label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={user.promoChannels.email.enabled}
                onChange={() => handleCheckboxChange("email")}
              />
              <label>Email Promotions</label>
            </div>
            
          </div>
        </div>
      </div>

      <button
        disabled={saving}
        onClick={saveChanges}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
