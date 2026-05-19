import type { NextConfig } from "next";
import os from "os";

// Mendapatkan semua IP tempatan peranti secara automatik & dinamik
const getLocalIPs = (): string[] => {
  const interfaces = os.networkInterfaces();
  const ips: string[] = ["localhost", "127.0.0.1"];

  for (const name of Object.keys(interfaces)) {
    const netInterface = interfaces[name];
    if (netInterface) {
      for (const net of netInterface) {
        if (net.family === "IPv4" && !net.internal) {
          ips.push(net.address);
        }
      }
    }
  }
  return ips;
};

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: getLocalIPs(),
};

export default nextConfig;
