import assert from "node:assert";
import { dirname } from "node:path";
import type { NextConfig } from "next";

assert(process.env.BLOB_BASE_URL, "You need a BLOB_BASE_URL");

const nextConfig: NextConfig = {
  turbopack: {
    root: dirname(__filename),
  },
  images: {
    remotePatterns: [new URL(`${process.env.BLOB_BASE_URL}/**`)],
  },
};

export default nextConfig;
