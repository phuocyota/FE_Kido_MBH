import React from "react";

import { Worker, Viewer } from "@react-pdf-viewer/core";

import { defaultLayoutPlugin }
from "@react-pdf-viewer/default-layout";

export default function PdfViewer() {

  const defaultLayoutPluginInstance =
    defaultLayoutPlugin();

  return (
    <div className="h-[80vh]">

      <Worker
        workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js"
      >

        <Viewer
          fileUrl="/Bao_cao_ban_hang.pdf"
          plugins={[defaultLayoutPluginInstance]}
        />

      </Worker>

    </div>
  );
}