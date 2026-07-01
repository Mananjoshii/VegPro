import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppLayout from "../layouts/AppLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import StaffForm from "../components/StaffForm";
import staffService from "../services/staffService";

export default function StaffManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [error, setError] = useState("");

  const fetchStaff = async () => {
    try {
      const data = await staffService.getAll();
      setStaff(data);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAdd = () => {
    setEditingStaff(null);
    setError("");
    setShowModal(true);
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    setError("");
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    const confirmMessage = t("deleteConfirm").replace("{{name}}", name);
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await staffService.delete(id);
      setStaff(staff.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.error?.message || "Failed to delete.");
    }
  };

  const handleSubmit = async (data) => {
    setSubmitLoading(true);
    setError("");

    try {
      if (editingStaff) {
        const updated = await staffService.update(editingStaff.id, data);
        setStaff(staff.map((s) => (s.id === editingStaff.id ? updated : s)));
      } else {
        const created = await staffService.create(data);
        setStaff([created, ...staff]);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || t("invalidCredentials"));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {t("staff")} ({staff.length})
            </h2>
          </div>
          <Button size="md" onClick={handleAdd}>
            + {t("add")}
          </Button>
        </div>

        {staff.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-gray-400 text-lg mb-4">{t("noStaff")}</p>
            <Button onClick={handleAdd}>{t("addFirstStaff")}</Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {staff.map((member) => (
              <Card
                key={member.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.mobile}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                    title={t("edit")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                    title={t("delete")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingStaff ? t("editStaff") : t("addStaff")}
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-danger text-sm font-medium px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          <StaffForm
            staff={editingStaff}
            onSubmit={handleSubmit}
            loading={submitLoading}
          />
        </Modal>
      </div>
    </AppLayout>
  );
}
