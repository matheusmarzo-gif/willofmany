FROM gradle:9.3.0-jdk17 AS build
WORKDIR /workspace
COPY . .
RUN gradle --no-daemon -p server-app clean bootJar

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/server-app/build/libs/will-of-many-server-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
