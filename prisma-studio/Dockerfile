# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Install Prisma CLI globally
RUN npm install -g prisma@2

# Expose the Prisma Studio port
EXPOSE 5555

# Command to start Prisma Studio
CMD ["npx", "prisma", "studio"]
