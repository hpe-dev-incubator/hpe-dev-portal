import React from "react";
import { RedocStandalone } from "redoc";

const ApiDocs = () => (
  <RedocStandalone specUrl="/ws-open-api.json" />
);

export default ApiDocs;