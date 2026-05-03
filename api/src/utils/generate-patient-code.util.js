export function generatePatientCode() {
  const prefix = "CH";

  const now = new Date();
  const datePart =
    now.getFullYear().toString().slice(-2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000); // 4 digit

  return `#${prefix}-${datePart}-${random}`;
}
