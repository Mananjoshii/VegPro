import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import AppLayout from "../layouts/AppLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import AdminForm from "../components/AdminForm";
import adminService from "../services/adminService";

export default function AdminManagement() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [error, setError] = useState("");

  const fetchAdmins = async () => {
    try {
      const data = await adminService.getAll();
      setAdmins(data);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdd = () => {
    setEditingAdmin(null);
    setError("");
    setShowModal(true);
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setError("");
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (id === user.id) {
      alert("You cannot delete yourself.");
      return;
    }
    const confirmMessage = t("deleteAdminConfirm").replace("{{name}}", name);
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await adminService.delete(id);
      setAdmins(admins.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.error?.message || "Failed to delete.");
    }
  };

  const handleSubmit = async (data) => {
    setSubmitLoading(true);
    setError("");

    try {
      if (editingAdmin) {
        const updated = await adminService.update(editingAdmin.id, data);
        setAdmins(
          admins.map((a) => (a.id === editingAdmin.id ? updated : a))
        );
      } else {
        const created = await adminService.create(data);
        setAdmins([created, ...admins]);
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
              {t("admins")} ({admins.length})
            </h2>
          </div>
          <Button size="md" onClick={handleAdd}>
            + {t("add")}
          </Button>
        </div>

        {admins.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-gray-400 text-lg">{t("noAdmins")}</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {admins.map((admin) => (
              <Card
                key={admin.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {admin.name}{" "}
                    {admin.id === user.id && (
                      <span className="text-xs text-primary bg-primary-50 px-2 py-0.5 rounded-full ml-1">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{admin.mobile}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(admin)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                    title={t("edit")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  {admin.id !== user.id && (
                    <button
                      onClick={() => handleDelete(admin.id, admin.name)}
                      className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                      title={t("delete")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingAdmin ? t("editAdmin") : t("addAdmin")}
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-danger text-sm font-medium px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          <AdminForm
            admin={editingAdmin}
            onSubmit={handleSubmit}
            loading={submitLoading}
          />
        </Modal>
      </div>
    </AppLayout>
  );
}
