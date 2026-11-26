Deploy on Vercel
1. Put this folder in a project (index.html + api/ folder) and deploy.
2. In Vercel > Settings > Environment Variables add WORD_SECRET = any long random string (e.g. 40+ characters), then redeploy.
Local test: npx vercel dev  (set WORD_SECRET in a .env file)
