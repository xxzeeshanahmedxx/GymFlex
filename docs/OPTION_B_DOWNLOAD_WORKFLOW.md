# Option B — Private Template ZIP Workflow

Use this workflow when the template is private and the agent should create a new client/store repo without keeping template git history.

## Required inputs

The agent needs:

```txt
TEMPLATE_OWNER=<github owner of ZERO_TEMPLATE>
TEMPLATE_REPO=ZERO_TEMPLATE
TEMPLATE_GITHUB_TOKEN=<token that can read the private template repo>
NEW_REPO_OWNER=<github owner for the new store repo>
NEW_REPO_NAME=<new store repo name>
NEW_REPO_GITHUB_TOKEN=<token that can create/push the new repo>
CLOUDFLARE_ACCOUNT_ID=<cloudflare account id>
CLOUDFLARE_API_TOKEN=<cloudflare token>
```

The template token and new repo token can be the same if the same GitHub account owns both.

## Download template as ZIP

```bash
curl -L \
  -H "Authorization: Bearer $TEMPLATE_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$TEMPLATE_OWNER/$TEMPLATE_REPO/zipball/main" \
  -o template.zip
```

## Extract cleanly

```bash
mkdir new-store
unzip -q template.zip -d template-unzip
shopt -s dotglob
mv template-unzip/*/* new-store/
rm -rf template.zip template-unzip
cd new-store
```

## Remove any inherited git state

Usually GitHub zipball has no `.git`, but do this anyway:

```bash
rm -rf .git
```

## Initialize new repo

```bash
git init
git branch -M main
git add .
git commit -m "Initial store from template"
```

## Create new GitHub repo

```bash
curl -X POST \
  -H "Authorization: Bearer $NEW_REPO_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$NEW_REPO_NAME\",\"private\":true}"
```

If creating under an organization, use:

```bash
https://api.github.com/orgs/$NEW_REPO_OWNER/repos
```

## Push new store repo

```bash
git remote add origin "https://$NEW_REPO_GITHUB_TOKEN@github.com/$NEW_REPO_OWNER/$NEW_REPO_NAME.git"
git push -u origin main
```

## After push

The agent should then:

1. Ask/store brand details.
2. Run the rename helper.
3. Update both `wrangler.toml` files.
4. Create new Cloudflare resources.
5. Run D1 migrations.
6. Seed products/categories.
7. Upload images to R2.
8. Set admin secret.
9. Deploy storefront and admin.
10. Verify live.
