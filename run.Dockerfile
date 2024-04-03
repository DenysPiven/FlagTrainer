# docker build -f Dockerfile.run -t flagtrainer-app .
# docker run -p 8080:8080 flagtrainer-app

FROM openjdk:17-jdk-slim
WORKDIR /app

COPY target/flagTrainer-0.0.1-SNAPSHOT.jar /app/app.jar

CMD ["java", "-jar", "app.jar"]

EXPOSE 8080