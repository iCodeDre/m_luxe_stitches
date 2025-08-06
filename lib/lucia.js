// creating a lucia connection

import { Lucia } from "lucia";
import { PostgresJsAdapter } from "@lucia-auth/adapter-postgresql";
import sql from "./db";

import { cookies } from "next/headers";

const adapter = new PostgresJsAdapter(sql, {
  user: "users",
  session: "sessions",
});

// creating a new lucia instance and initializing with database

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  getUserAttributes: (data) => {
    return {
      displayName: data.display_name,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phoneNumber: data.phone_number,
      role: data.role,
    };
  },
});

export async function createAuthSession(userId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

export async function VerifyAuth() {
  const sessionCookie = (await cookies()).get(lucia.sessionCookieName);

  if (!sessionCookie) {
    return {
      user: null,
      session: null,
    };
  }

  const sessionId = sessionCookie.value;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);

      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();

      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}

  return {
    session: result.session,
    user: result.user
      ? {
          userId: result.session.userId,
          displayName: result.user.displayName,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          phoneNumber: result.user.phoneNumber,
          role: result.user.role,
        }
      : null,
  };
}

export async function destroySession() {
  const { session } = await VerifyAuth();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
// // creating a lucia connection

// import { Lucia } from "lucia";
// import { PostgresJsAdapter } from "@lucia-auth/adapter-postgresql";
// import sql from "./db";

// import { cookies } from "next/headers";

// // plugging database to lucia adapter

// const adapter = new PostgresJsAdapter(sql, {
//   user: "users",
//   session: "sessions",
// });

// // creating a new lucia instance and initializing with database

// export const lucia = new Lucia(adapter, {
//   sessionCookie: {
//     expires: false,
//     attributes: {
//       path: "/",
//       httpOnly: true,
//       // secure: false,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 60 * 60 * 24 * 7,
//     },
//   },
//   getUserAttributes: (data) => {

//     return {
//       displayName: data.display_name,
//       firstName: data.first_name,
//       lastName: data.last_name,
//       email: data.email,
//       phoneNumber: data.phone_number,
//       role: data.role,
//     };
//   },
// });

// export async function createAuthSession(userId) {
//   const session = await lucia.createSession(userId, {});
//   const sessionCookie = lucia.createSessionCookie(session.id);

//   (await cookies()).set(
//     sessionCookie.name,
//     sessionCookie.value,
//     sessionCookie.attributes
//   );
// }

// export async function VerifyAuth() {
//   const sessionCookie = (await cookies()).get(lucia.sessionCookieName);

//   if (!sessionCookie) {
//     return {
//       user: null,
//       session: null,
//     };
//   }

//   const sessionId = sessionCookie.value;

//   if (!sessionId) {
//     return {
//       user: null,
//       session: null,
//     };
//   }

//   const result = await lucia.validateSession(sessionId);

//   try {
//     if (result.session && result.session.fresh) {
//       const sessionCookie = lucia.createSessionCookie(result.session.id);

//       (await cookies()).set(
//         sessionCookie.name,
//         sessionCookie.value,
//         sessionCookie.attributes
//       );
//     }

//     if (!result.session) {
//       const sessionCookie = lucia.createBlankSessionCookie();

//       (await cookies()).set(
//         sessionCookie.name,
//         sessionCookie.value,
//         sessionCookie.attributes
//       );
//     }
//   } catch {}

//   return {
//     session: result.session,
//     user: result.user
//       ? {
//           userId: result.session.userId,
//           displayName: result.user.displayName,
//           firstName: result.user.firstName,
//           lastName: result.user.lastName,
//           email: result.user.email,
//           phoneNumber: result.user.phoneNumber,
//           role: result.user.role,
//         }
//       : null,
//   };
// }

// export async function destroySession() {
//   const { session } = await VerifyAuth();

//   if (!session) {
//     return {
//       error: "Unauthorized",
//     };
//   }

//   await lucia.invalidateSession(session.id);

//   const sessionCookie = lucia.createBlankSessionCookie();

//   (await cookies()).set(
//     sessionCookie.name,
//     sessionCookie.value,
//     sessionCookie.attributes
//   );
// }
