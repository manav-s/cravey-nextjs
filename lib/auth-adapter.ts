import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import { sql } from "@/lib/db";

type DbUser = {
  id: string;
  email: string;
  emailVerified: Date | null;
  name: string | null;
  image: string | null;
};

export function NeonAdapter(): Adapter {
  return {
    async createUser(user: AdapterUser) {
      const id = user.id ?? crypto.randomUUID();
      const [created] = await sql<DbUser>`
        INSERT INTO users (id, email, display_name)
        VALUES (${id}, ${user.email}, ${user.name ?? null})
        RETURNING id, email, NULL::timestamptz AS "emailVerified", display_name AS name, NULL::text AS image;
      `;
      return created;
    },
    async getUser(id: string) {
      const [user] = await sql<DbUser>`
        SELECT id, email, NULL::timestamptz AS "emailVerified", display_name AS name, NULL::text AS image
        FROM users
        WHERE id = ${id}
        LIMIT 1;
      `;
      return user ?? null;
    },
    async getUserByEmail(email: string) {
      const [user] = await sql<DbUser>`
        SELECT id, email, NULL::timestamptz AS "emailVerified", display_name AS name, NULL::text AS image
        FROM users
        WHERE email = ${email}
        LIMIT 1;
      `;
      return user ?? null;
    },
    async getUserByAccount({
      provider,
      providerAccountId,
    }: {
      provider: string;
      providerAccountId: string;
    }) {
      const [user] = await sql<DbUser>`
        SELECT u.id, u.email, NULL::timestamptz AS "emailVerified", u.display_name AS name, NULL::text AS image
        FROM accounts a
        JOIN users u ON u.id = a.userId
        WHERE a.provider = ${provider} AND a.providerAccountId = ${providerAccountId}
        LIMIT 1;
      `;
      return user ?? null;
    },
    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const [updated] = await sql<DbUser>`
        UPDATE users
        SET
          email = COALESCE(${user.email ?? null}, email),
          display_name = COALESCE(${user.name ?? null}, display_name)
        WHERE id = ${user.id}
        RETURNING id, email, NULL::timestamptz AS "emailVerified", display_name AS name, NULL::text AS image;
      `;
      return updated;
    },
    async deleteUser(userId: string) {
      await sql`DELETE FROM users WHERE id = ${userId};`;
    },
    async linkAccount(account: AdapterAccount) {
      await sql`
        INSERT INTO accounts (
          userId, type, provider, providerAccountId, refresh_token, access_token,
          expires_at, token_type, scope, id_token, session_state
        ) VALUES (
          ${account.userId}, ${account.type}, ${account.provider}, ${account.providerAccountId},
          ${account.refresh_token ?? null}, ${account.access_token ?? null}, ${account.expires_at ?? null},
          ${account.token_type ?? null}, ${account.scope ?? null}, ${account.id_token ?? null},
          ${account.session_state ?? null}
        )
        ON CONFLICT (provider, providerAccountId)
        DO UPDATE SET
          refresh_token = EXCLUDED.refresh_token,
          access_token = EXCLUDED.access_token,
          expires_at = EXCLUDED.expires_at,
          token_type = EXCLUDED.token_type,
          scope = EXCLUDED.scope,
          id_token = EXCLUDED.id_token,
          session_state = EXCLUDED.session_state;
      `;
      return account;
    },
    async unlinkAccount({
      provider,
      providerAccountId,
    }: {
      provider: string;
      providerAccountId: string;
    }) {
      await sql`
        DELETE FROM accounts
        WHERE provider = ${provider} AND providerAccountId = ${providerAccountId};
      `;
    },
    async createSession(session: AdapterSession) {
      const [created] = await sql<{
        sessionToken: string;
        userId: string;
        expires: Date;
      }>`
        INSERT INTO sessions (sessionToken, userId, expires)
        VALUES (${session.sessionToken}, ${session.userId}, ${session.expires})
        RETURNING sessionToken, userId, expires;
      `;
      return created;
    },
    async getSessionAndUser(sessionToken: string) {
      const [row] = await sql<{
        sessionToken: string;
        userId: string;
        expires: Date;
        id: string;
        email: string;
        emailVerified: Date | null;
        name: string | null;
        image: string | null;
      }>`
        SELECT
          s.sessionToken,
          s.userId,
          s.expires,
          u.id,
          u.email,
          NULL::timestamptz AS "emailVerified",
          u.display_name AS name,
          NULL::text AS image
        FROM sessions s
        JOIN users u ON u.id = s.userId
        WHERE s.sessionToken = ${sessionToken}
        LIMIT 1;
      `;

      if (!row) {
        return null;
      }

      return {
        session: {
          sessionToken: row.sessionToken,
          userId: row.userId,
          expires: row.expires,
        },
        user: {
          id: row.id,
          email: row.email,
          emailVerified: row.emailVerified,
          name: row.name,
          image: row.image,
        },
      };
    },
    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">,
    ) {
      const [updated] = await sql<{
        sessionToken: string;
        userId: string;
        expires: Date;
      }>`
        UPDATE sessions
        SET
          expires = COALESCE(${session.expires ?? null}, expires),
          userId = COALESCE(${session.userId ?? null}, userId)
        WHERE sessionToken = ${session.sessionToken}
        RETURNING sessionToken, userId, expires;
      `;
      return updated ?? null;
    },
    async deleteSession(sessionToken: string) {
      await sql`DELETE FROM sessions WHERE sessionToken = ${sessionToken};`;
    },
    async createVerificationToken(verificationToken: VerificationToken) {
      const [token] = await sql<{
        identifier: string;
        token: string;
        expires: Date;
      }>`
        INSERT INTO verification_tokens (identifier, token, expires)
        VALUES (
          ${verificationToken.identifier},
          ${verificationToken.token},
          ${verificationToken.expires}
        )
        RETURNING identifier, token, expires;
      `;
      return token;
    },
    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string;
      token: string;
    }) {
      const [deleted] = await sql<{
        identifier: string;
        token: string;
        expires: Date;
      }>`
        DELETE FROM verification_tokens
        WHERE identifier = ${identifier} AND token = ${token}
        RETURNING identifier, token, expires;
      `;

      return deleted ?? null;
    },
  };
}
