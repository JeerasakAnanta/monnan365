"use client";

import { useEffect, useState } from "react";

export function useVisitorCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;

    fetch(`/api/visitor?path=${encodeURIComponent(path)}`)
      .then((res) => res.json())
      .then((data) => {
        setCount(data.total ?? 0);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return { count, loading };
}
