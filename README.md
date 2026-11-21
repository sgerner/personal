# Personal website

The SvelteKit site for `stevengerner.com`.

## Local development

```sh
npm ci
npm run dev
```

## Deployment

The site uses `@sveltejs/adapter-node` and runs in the CapRover app `personal` on port 3000. CapRover builds the Docker image from `Dockerfile`, referenced by `captain-definition`.

GitHub Actions deploys every push to `main`. The repository needs the app-scoped `CAPROVER_APP_TOKEN` Actions secret. The app's `ADMIN_PASSWORD` and `IMAGE_SERVER_AUTH_TOKEN` values are configured in CapRover.
