import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";

/**
 * Staff add/edit form. Fields: Name, Mobile.
 *
 * @param {Object|null} staff - Existing staff data for editing (null for add)
 * @param {Function} onSubmit - Called with { name, mobile }
 * @param {boolean} loading - Submit loading state
 */
export default function StaffForm({ staff = null, onSubmit, loading = false }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});

  // Pre-fill for edit mode
  useEffect(() => {
    if (staff) {
      setName(staff.name || "");
      setMobile(staff.mobile || "");
    }
  }, [staff]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!mobile.trim()) newErrors.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(mobile))
      newErrors.mobile = "Enter a valid 10-digit number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ name: name.trim(), mobile: mobile.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="staff-name"
        label="Name"
        placeholder="Enter full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <Input
        id="staff-mobile"
        label="Mobile Number"
        placeholder="Enter 10-digit number"
        type="tel"
        inputMode="numeric"
        maxLength={10}
        value={mobile}
        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
        error={errors.mobile}
      />
      <Button type="submit" fullWidth loading={loading}>
        {staff ? "Update Staff" : "Add Staff"}
      </Button>
    </form>
  );
}
