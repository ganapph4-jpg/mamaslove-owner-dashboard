# Owner website — GitHub → Cloudflare Pages

Static site: **no build step, no npm, no server, no framework**.

```
owner-dashboard/
├── index.html                      ← owner console (sales / orders / customers / machines)
└── MamasLoveLaundryPOS-6.8.apk     ← the app, served by the same site
```

The page itself is one self-contained file: the stylesheet (Tailwind), the error strip,
the demo data and `shop-config` defaults are inlined, so there is no other file to copy
and no CDN. Double-click it to use it locally. The APK beside it is only there so the
site can hand out the app.

**This site is read-only — it has no key generator.** Activation keys are issued from
the separate private repository `mamaslove-keygen-private`, so this repository stays
public-safe.

---

## App download (APK)

The current APK sits **beside `index.html`**, so uploading this folder publishes it too:

    https://<project>.pages.dev/MamasLoveLaundryPOS-6.8.apk

`index.html` links it from the setup screen and the sidebar (**Download the app (APK)**).
For a new version, copy `publish/apk/MamasLoveLaundryPOS-<version>.apk` into this folder,
update the two `href="MamasLoveLaundryPOS-..."` links in `index.html`, and delete the old
APK so only the current build is offered. Keep the version in the file name.

---

## 1. Upload to GitHub

Already pushed to **`github.com/ganapph4-jpg/mamaslove-owner-dashboard`** with
`index.html` at the repository root. After any change here:

```bash
cd "publish/owner-dashboard"
git add -A && git commit -m "update dashboard" && git push
```

Never add `publish/keygen` (or any key generator) to this repository.

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

The console itself needs no Firebase sign-in — it only reads with the API key. These
auth settings matter for the private license page (`licenses.html` in
`mamaslove-keygen-private`), which signs in before it can issue or revoke keys.

---

## 4. Opening the console

**index.html** is already set up for this shop: `MLLP_SHOP_CONFIG` holds the
`my-pos-laundry` API key, the Project ID and `skipPassword: true`. Every phone opens
straight into the console — no connection screen and no password screen.

⚠️ With no password, anyone who has the site link can read the dashboard. Keep the URL
private. Remove `skipPassword` (or set it to `false`) to bring the per-browser password
back.

The key is public — it only selects the project. **Never replace it with the licence
project's (`pos-offline-laundry`) key.**

**Demo** — open `index.html?demo=1` (or `https://<project>.pages.dev/?demo=1`) to see the
whole console filled with sample orders, customers, machines and staff. It never asks for
a key or password, never contacts a database and never saves anything to the browser, so
it is safe to show to a customer or record for a walkthrough. The strip at the top says
"Preview · sample data". Opening `index.html` without the `?demo=1` part is the real,
empty console.

**Keys are not issued here.** They come from the private repository
`mamaslove-keygen-private` (`licenses.html`, owner login required), which issues, revokes
and shows the same key the customer types into the offline app.

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
