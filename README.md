# Personal website

The SvelteKit site for `stevengerner.com`.

## Local development

```sh
npm ci
npm run dev
```

## Deployment

The site uses `@sveltejs/adapter-node` and runs in the CapRover app `personal` on port 3000. CapRover builds the Docker image from `Dockerfile`, referenced by `captain-definition`.

GitHub Actions deploys pushes to `main`, except commits that only change `.stitch.json`. It sends an explicit CI `User-Agent` to CapRover because the stock deploy action sends none, and Cloudflare Bot Fight Mode challenged that empty-agent request. The repository needs the app-scoped `CAPROVER_APP_TOKEN` Actions secret. The app's `ADMIN_PASSWORD` and `IMAGE_SERVER_AUTH_TOKEN` values are configured in CapRover.
