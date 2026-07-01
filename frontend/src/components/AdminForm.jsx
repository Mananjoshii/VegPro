import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";

/**
 * Admin add/edit form. Fields: Name, Mobile, Password.
 *
 * @param {Object|null} admin - Existing admin data for editing (null for add)
 * @param {Function} onSubmit - Called with { name, mobile, password }
 * @param {boolean} loading - Submit loading state
 */
export default function AdminForm({ admin = null, onSubmit, loading = false }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const isEdit = !!admin;

  // Pre-fill for edit mode
  useEffect(() => {
    if (admin) {
      setName(admin.name || "");
      setMobile(admin.mobile || "");
      setPassword(""); // Don't pre-fill password
    }
  }, [admin]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!mobile.trim()) newErrors.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(mobile))
      newErrors.mobile = "Enter a valid 10-digit number.";

    if (!isEdit && !password) {
      newErrors.password = "Password is required.";
    } else if (password && password.length < 4) {
      newErrors.password = "Minimum 4 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const data = { name: name.trim(), mobile: mobile.trim() };
      if (password) data.password = password;
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="admin-name"
        label="Name"
        placeholder="Enter full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <Input
        id="admin-mobile"
        label="Mobile Number"
        placeholder="Enter 10-digit number"
        type="tel"
        inputMode="numeric"
        maxLength={10}
        value={mobile}
        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
        error={errors.mobile}
      />
      <Input
        id="admin-password"
        label={isEdit ? "New Password (leave blank to keep)" : "Password"}
        placeholder={isEdit ? "Leave blank to keep current" : "Enter password"}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Button type="submit" fullWidth loading={loading}>
        {isEdit ? "Update Admin" : "Add Admin"}
      </Button>
    </form>
  );
}
