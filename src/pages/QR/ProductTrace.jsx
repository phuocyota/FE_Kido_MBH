import React from "react";
import { useLocation } from "react-router-dom";
import TraceSnapshot from "../../components/QR/TraceSnapshot";

export default function ProductTrace() {
  const { hash } = useLocation();
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <TraceSnapshot params={new URLSearchParams(hash.slice(1))} />
    </main>
  );
}
