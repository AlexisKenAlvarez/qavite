export function validateEmailDomain(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@cvsu\.edu\.ph$/;
  return regex.test(email);
}