# Toodle

A modern, responsive todo list application built with React, TypeScript, Vite, and Tailwind CSS. All todo items are stored in the browser's local storage. The app is containerized with Docker and served using Bun for production-ready deployment.

![Toodle Demo](./assets/demo.png)

## Features

- ✅ Add, edit, and delete todos
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🚀 Fast development with Vite
- 🐳 Docker containerization
- ⚡ Built with Bun for speed
- 🧪 Entirely vibe-coded with [Opencode](https://opencode.ai/)

## Installation

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- [Docker](https://www.docker.com/) (for containerized builds)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/nicbet/toodle.git
   cd toodle
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

### Local Build

To build the project locally:

```bash
bun run build
```

This creates a `dist/` directory with the production build.

To serve locally:

```bash
bun run serve
```

### Docker Build

To build and run with Docker:

```bash
make build
```

This will:
1. Run `bun run build` to create the production build
2. Build the Docker image `ghcr.io/nicbet/toodle:latest`

### Available Make Targets

- `make all` or `make build`: Build the Docker image
- `make clean`: Remove build artifacts and Docker image

## Deployment

The Docker image serves the app using Bun's built-in static file server. The app listens on the port specified by the `PORT` environment variable (default: 3000).

### Docker Run Example

```bash
docker run -p 3000:3000 ghcr.io/nicbet/toodle:latest
```

You can customize the port:

```bash
docker run -p 8080:8080 -e PORT=8080 ghcr.io/nicbet/toodle:latest
```

### Docker Compose Example

```yaml
version: '3.8'
services:
  toodle:
    image: ghcr.io/nicbet/toodle:latest
    environment:
      - PORT=3000
    ports:
      - "3000:3000"
```

## Optional: TLS Termination with Caddy

If you want to add TLS termination, HTTPS certificates, and additional security features, you can deploy behind Caddy. Example configurations are provided in the `examples/` directory.

### Quick Start with Caddy

1. Copy the example files:
   ```bash
   cp examples/Caddyfile .
   cp examples/docker-compose.yml .
   ```

2. Edit `Caddyfile` to replace `yourdomain.com` with your actual domain.

3. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

This setup provides:
- Automatic HTTPS certificates from Let's Encrypt
- HTTP to HTTPS redirection
- Security headers
- Request logging
- Reverse proxy to the Bun-served app

## Environment Variables

The application supports the following environment variables:

- `PORT`: Port to bind the server to (default: `3000`)

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `bun run test` (when tests are added)
5. Lint your code: `bun run lint`
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin feature/your-feature`
8. Submit a pull request

### Code Style

- Use TypeScript for type safety
- Follow the existing code style (Prettier formatting)
- Use camelCase for variables and PascalCase for components
- Add JSDoc comments for functions and components
- Ensure responsive design with Tailwind CSS

## Scripts

- `bun run dev`: Start development server
- `bun run build`: Build for production
- `bun run serve`: Serve production build locally
- `bun run preview`: Preview production build
- `bun run lint`: Run TypeScript type checking

## License

This project is licensed under the MIT License.