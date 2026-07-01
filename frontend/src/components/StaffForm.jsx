import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Input from "./Input";
import Button from "./Button";

/**
 * Staff add/edit form. Fields: Name, Mobile.
 */
export default function StaffForm({ staff = null, onSubmit, loading = false }) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (staff) {
      setName(staff.name || "");
      setMobile(staff.mobile || "");
    }
  }, [staff]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = t("nameRequired");
    if (!mobile.trim()) newErrors.mobile = t("mobileRequired");
    else if (!/^\d{10}$/.test(mobile))
      newErrors.mobile = t("validMobileError");
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
        label={t("name")}
        placeholder={t("namePlaceholder")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <Input
        id="staff-mobile"
        label={t("mobileNumber")}
        placeholder={t("mobilePlaceholder")}
        type="tel"
        inputMode="numeric"
        maxLength={10}
        value={mobile}
        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
        error={errors.mobile}
      />
      <Button type="submit" fullWidth loading={loading}>
        {staff ? t("update") : t("addStaff")}
      </Button>
    </form>
  );
}
