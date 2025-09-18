// Minimal QR code generation for Node.js
// This is a placeholder for a real QR code library like 'qrcode'
import QRCode from 'qrcode';

export async function generateAwardQRCode(data) {
  // Returns a data URL (base64 PNG)
  return await QRCode.toDataURL(data);
}
