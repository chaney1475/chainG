FROM openjdk:21-slim AS builder

RUN apt-get update && apt-get install -y \
    unzip \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY gradlew settings.gradle build.gradle ./
COPY gradle/ gradle/

RUN chmod +x gradlew

COPY . .

RUN ./gradlew --no-daemon clean build -x test

FROM openjdk:21-slim AS runner

WORKDIR /app

COPY --from=builder /app/build/libs/*.war app.war

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "/app/app.war", "--spring.config.location=/app/application-deploy.yml"]