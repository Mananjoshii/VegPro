import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Input from "./Input";
import Button from "./Button";

/**
 * Admin add/edit form. Fields: Name, Mobile, Password.
 */
export default function AdminForm({ admin = null, onSubmit, loading = false }) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const isEdit = !!admin;

  useEffect(() => {
    if (admin) {
      setName(admin.name || "");
      setMobile(admin.mobile || "");
      setPassword(""); 
    }
  }, [admin]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = t("nameRequired");
    if (!mobile.trim()) newErrors.mobile = t("mobileRequired");
    else if (!/^\d{10}$/.test(mobile))
      newErrors.mobile = t("validMobileError");

    if (!isEdit && !password) {
      newErrors.password = t("passwordRequired");
    } else if (password && password.length < 4) {
      newErrors.password = t("passwordMinLength");
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
        label={t("name")}
        placeholder={t("namePlaceholder")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <Input
        id="admin-mobile"
        label={t("mobileNumber")}
        placeholder={t("mobilePlaceholder")}
        type="tel"
        inputMode="numeric"
        maxLength={10}
        value={mobile}
        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
        error={errors.mobile}
      />
      <Input
        id="admin-password"
        label={isEdit ? t("newPasswordHint") : t("password")}
        placeholder={isEdit ? t("leaveBlankHint") : t("passwordPlaceholder")}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Button type="submit" fullWidth loading={loading}>
        {isEdit ? t("update") : t("addAdmin")}
      </Button>
    </form>
  );
}
