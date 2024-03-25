FROM openjdk:17-slim

WORKDIR /app

COPY target/flags-0.0.1-SNAPSHOT.jar /app/app.jar

COPY data/flags.json /app/data/flags.json
COPY data/users /app/data/users

CMD ["java", "-jar", "app.jar"]

EXPOSE 8080
