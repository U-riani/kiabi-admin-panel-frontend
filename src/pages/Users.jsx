import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPaginatedUsers } from "../api/userService";
import Table from "../components/Table";
import Pagination from "../components/Pagination";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getPaginatedUsers(page, 20);
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page]);

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (u) => `${u.firstName || ""} ${u.lastName || ""}`.trim(),
    },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    {
      key: "sms",
      label: "SMS",
      render: (u) => (u.promoChannels?.sms?.enabled ? "YES" : "NO"),
    },
    {
      key: "emailPromo",
      label: "Email",
      render: (u) => (u.promoChannels?.email?.enabled ? "YES" : "NO"),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Users</h2>

      {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <>
          <Table
            columns={columns}
            data={users}
            onRowClick={(row) => navigate(`/users/${row._id}`)}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}
