# Owner website — GitHub → Cloudflare Pages

Static site: **no build step, no npm, no server, no framework**.

```
owner-dashboard/
├── index.html    ← owner console (sales / orders / customers / machines)
└── licenses.html ← license dashboard (issue + revoke activation keys)
```

Each page is one self-contained file: the stylesheet (Tailwind), the error strip,
the demo data and `shop-config` defaults are inlined, so there are no other files
to copy and no CDN. Double-click either file to use it locally.

---

## 1. Upload to GitHub

Create a new repository, then upload the **contents of this folder** so that
`index.html` sits at the repository root (not inside a subfolder).

Git, if you prefer the terminal:

```bash
cd "publish/owner-dashboard"
git init
git add .
git commit -m "owner dashboard"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

Do **not** add the `keygen` folder to this repository.

---

## 2. Cloudflare Pages

1. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the repository.
3. Settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
4. **Save and Deploy** → you get `https://<project>.pages.dev`.

Every push to the repository redeploys automatically.

Optional — custom domain: Pages project → **Custom domains** → add it, then add the
same domain in Firebase (step 3).

---

## 3. Firebase side (one-time)

| What | Where |
|---|---|
| Firestore rules published | Firebase Console → Firestore Database → Rules (the rules file is at the repo root: `firestore.rules`) |
| Email/Password sign-in enabled | Authentication → Sign-in method → Email/Password |
| Google sign-in enabled | Authentication → Sign-in method → Google |
| Site domain allowed | Authentication → Settings → **Authorized domains** → add `<project>.pages.dev` (and your custom domain) |

Without the authorized domain, the **Sign in with Google** button fails. Email/password
sign-in works from any origin, so it is the safer option for `licenses.html`.

---

## 4. Opening the console

**index.html** — enter the API key + Project ID of the shop's Firebase project (the same
values used in the app under *Owner Settings → Cloud Sync*), choose a dashboard password,
and it connects. Settings and the password hash stay in that browser only, so each new
device asks once. To skip that step for your own shop, fill in the `MLLP_SHOP_CONFIG`
block near the top of `index.html` before uploading:

```js
window.MLLP_SHOP_CONFIG = {
  apiKey: 'AIza...',        // shop project web API key
  projectId: 'my-pos-laundry'
};
```

That key is public — it only selects the project. **Never put the license project's key
there.**

**Demo** — open `index.html?demo=1` (or `https://<project>.pages.dev/?demo=1`) to see the
whole console filled with sample orders, customers, machines and staff. It never asks for
a key or password, never contacts a database and never saves anything to the browser, so
it is safe to show to a customer or record for a walkthrough. The strip at the top says
"Preview · sample data". Opening `index.html` without the `?demo=1` part is the real,
empty console.

**licenses.html** — sign in with the account that owns the license project
(`pos-offline-laundry`): Google, or Email/Password created in Firebase Console →
Authentication → Users. Issue a key by pasting the customer's device code, and revoke
keys from the table.

---

## 5. Notes and limits

- Read-only: the console never writes shop data, so it cannot conflict with the phone.
- Not realtime: the page polls; a sale appears within about a minute of the phone
  uploading it.
- OR numbers are per device (the counter lives in the phone's database).
- If a page shows **Permission denied (403)**, the Firestore rules are not published for
  that project.
- If it shows **quota exceeded (429)**, the Firebase free daily limit for that project is
  used up; the phone keeps working offline and uploads when it resets.
