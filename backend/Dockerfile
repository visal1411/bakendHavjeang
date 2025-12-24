# Use Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 5000

# Generate Prisma client and start app
# Use shell form instead of JSON array
# Generate Prisma client, push schema to DB, and start app
CMD sh -c "npx prisma generate && npx prisma db push && npm run dev"
