# Build stage
FROM node:20-slim AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source files
COPY . .

# Run linting, type checking and tests
RUN npm run lint
RUN npm run typecheck
RUN npm test

# Build the package
RUN npm run build

# Runtime stage
FROM node:20-slim AS runtime

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy package files and built assets
COPY package.json package-lock.json* ./
COPY --from=build /app/dist ./dist

# Only install production dependencies
RUN npm ci --omit=dev

# Use non-root user for security
USER node

CMD ["node", "-e", "console.log('Pathwave.io SDK is ready to use. Import it in your application.')"]