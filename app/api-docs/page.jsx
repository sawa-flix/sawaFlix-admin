// app/api-docs/page.tsx
"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocs() {
  // We point the URL to the JSON route we created in Step 1
  return (
    <div className="bg-white min-h-screen">
      <SwaggerUI url="/api/swagger" />
    </div>
  );
}
