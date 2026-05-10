================================================================
ERI WEBSITE — GODADDY DEPLOYMENT INSTRUCTIONS
================================================================

WHAT'S IN THIS FOLDER
---------------------
Everything you need to upload to GoDaddy. Nothing else.

   index.html              ← homepage (economicreasoning.org/)
   signup-camp.html        ← Summer Camp registration
   signup-seminar.html     ← Seminars registration
   signup-workshop.html    ← Workshops registration
   admineri.html           ← Admin login gate
   signups.html            ← Admin dashboard (auth-protected)
   .htaccess               ← Apache config: HTTPS redirect, pretty URLs, caching
   assets/
     css/style.css         ← all styling
     js/main.js            ← all interactivity + Supabase client
     img/                  ← logos and photos


HOW TO UPLOAD (GODADDY cPANEL FILE MANAGER)
-------------------------------------------
1. Log in to GoDaddy → My Products → Web Hosting → "Manage" → cPanel Admin.
2. Open "File Manager".
3. Navigate to:    public_html/
4. IMPORTANT: delete any default GoDaddy files in public_html/
   (usually a placeholder index.html or "coming soon" page).
5. Click "Upload". Select EVERY file and folder inside this /final/ folder.
   When the upload finishes, public_html/ should look exactly like /final/.
6. Make sure ".htaccess" actually uploaded (it's a hidden file — in cPanel
   File Manager, click Settings → "Show Hidden Files" first).
7. Visit https://economicreasoning.org/ — site should load.


URLS AFTER DEPLOYMENT
---------------------
   https://economicreasoning.org/                       — homepage
   https://economicreasoning.org/signup-camp.html       — camp signup
   https://economicreasoning.org/signup-seminar.html    — seminar signup
   https://economicreasoning.org/signup-workshop.html   — workshop signup
   https://economicreasoning.org/admineri.html          — admin login
   https://economicreasoning.org/signups.html           — admin dashboard
                                                          (auth-protected)

   The extensionless URLs (/signup-camp, /admineri, etc.) also work thanks
   to the .htaccess rewrite — share whichever feels cleaner.


ADMIN ACCESS
------------
URL:        https://economicreasoning.org/admineri
Code:       reasonwithecon

⚠️ SECURITY WARNING: this admin code is hardcoded in admineri.html (line ~49)
   in plain JavaScript. ANYONE who views page source on the public site can
   read the code and access the dashboard. This is fine for casual gating
   but is NOT real security. Treat the dashboard as semi-public.

   To change the code: edit admineri.html, find the line:
       if(input.value==='reasonwithecon'){
   and replace 'reasonwithecon' with your new code. Re-upload.


DATA STORAGE
------------
All form submissions go to Supabase (project: oliaowomacdkwgmbdnhb).
Tables: camp_signups, seminar_signups, workshop_signups, tutoring_signups.

Verified working: end-to-end POST + admin SELECT/DELETE both succeed
from production CORS headers.

⚠️ The publishable key (sb_publishable_OlLcofeNEZpeyv57dJWkAg_zMsRcHte) is
   visible in the website source. That's fine — it's designed to be public
   and is rate-limited / RLS-protected.

⚠️ ROTATE YOUR SECRET KEY: you shared the secret key (sb_secret_...) in
   chat with the AI. Go to Supabase Dashboard → Project Settings → API Keys
   → Revoke and regenerate it. The secret key must NEVER appear in any
   client code or screenshot.


SSL CERTIFICATE
---------------
GoDaddy gives you a free DV SSL on most plans. After you upload:
   1. cPanel → Security → SSL/TLS Status → run AutoSSL.
   2. Wait ~15 min for the cert to provision.
   3. The .htaccess HTTPS redirect will then kick in.

If you don't have SSL yet, you can comment out lines 6–9 of .htaccess
(the "Force HTTPS" block) until SSL is active.


TESTING THE LIVE SITE
---------------------
Once uploaded, run through this checklist:
   □ Homepage loads at https://economicreasoning.org/
   □ Logo + favicon both visible
   □ Click "Sign Up for Camp" — form opens at /signup-camp
   □ Submit a test signup with your own email
   □ Visit /admineri, enter the admin code
   □ Verify the test signup appears in /signups dashboard
   □ Click the × next to the test row to delete it
   □ Try Export CSV — confirm a file downloads
   □ Test the seminar and workshop signup flows the same way


DNS POINTING (if domain isn't already pointed)
---------------------------------------------
GoDaddy DNS → A record:
   Host: @          Type: A    Points to: [your hosting IP — see cPanel]
   Host: www        Type: A    Points to: [same hosting IP]
Allow up to 24 hours for DNS propagation.


CONTACT
-------
If anything breaks:
   • Form says "Something went wrong" → check Supabase project is alive
     at https://supabase.com/dashboard/project/oliaowomacdkwgmbdnhb
   • Dashboard shows nothing after submitting → hard-refresh (Ctrl+Shift+R)
     and confirm session cookie wasn't blocked
   • Logos broken → confirm assets/img/ folder uploaded with all 4 files
================================================================
