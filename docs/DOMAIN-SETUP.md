# Fix: Domain Still Shows GoDaddy’s Page

Your app is on Netlify, but the domain is still pointing to GoDaddy. Update DNS so the domain points to Netlify.

---

## 1. Add the domain in Netlify

1. Log in to [Netlify](https://app.netlify.com).
2. Open your site → **Site configuration** (or **Domain management**).
3. Click **Add domain** / **Add custom domain**.
4. Enter your domain (e.g. `isthisrecyclable.com`) and add `www.isthisrecyclable.com` if you use it.
5. Follow the prompts. Netlify will show you what DNS records to use.

---

## 2. Point the domain away from GoDaddy

Pick one:

### Option A: Use Netlify DNS (simplest)

1. In Netlify, go to **Domain management** for your site and add the domain if you haven’t.
2. Choose **Set up Netlify DNS** and note the **nameservers** Netlify gives you (e.g. `dns1.p01.nsone.net`).
3. In **GoDaddy**: go to [My Products](https://dcc.godaddy.com/) → your domain → **DNS** or **Manage**.
4. Find **Nameservers** and switch from “Default” to **Custom**.
5. Replace GoDaddy’s nameservers with the Netlify nameservers from step 2.
6. Save. DNS can take from a few minutes up to 24–48 hours to update.

### Option B: Keep DNS at GoDaddy

In GoDaddy’s DNS for your domain, set:

| Type  | Name | Value                    |
|-------|------|--------------------------|
| **A** | `@`  | `75.2.60.5`              |
| **CNAME** | `www` | `[your-site].netlify.app` |

Use your real Netlify site name for `[your-site]` (e.g. from your Netlify URL).

Save and wait for DNS to propagate (up to 24–48 hours).

---

## 3. Check

- Open your domain in a browser (and try incognito or another device if it’s cached).
- In Netlify, **Domain management** should show the domain as connected and HTTPS as active once DNS has propagated.

Once the domain points to Netlify, GoDaddy’s page will stop showing. No code changes are required for this.
