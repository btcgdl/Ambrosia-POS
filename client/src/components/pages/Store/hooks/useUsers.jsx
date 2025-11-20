"use client";
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services/apiClient';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(null);
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient("/users");
      if (res === null) {
        setUsers([]);
      } else {
        setUsers(res);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}
