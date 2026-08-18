//To simulate a login via fake token
const NAME_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export function createTestToken(
  name = "Cypress User",
  role = "user"
) {
  const header = btoa(
    JSON.stringify({
      alg: "none",
      typ: "JWT"
    })
  );

  const payload = btoa(
    JSON.stringify({
      [NAME_CLAIM]: name,
      [ROLE_CLAIM]: role
    })
  );

  return `${header}.${payload}.`;
}