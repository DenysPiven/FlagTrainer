FROM maven:3.8.4-openjdk-21 AS build
WORKDIR /build
COPY src /build/src
COPY pom.xml /build/
RUN mvn clean package

FROM openjdk:21-slim
WORKDIR /app
COPY --from=build /build/target/FlagTrainer-0.0.1-SNAPSHOT.jar /app/app.jar
COPY data/flags.json /app/data/flags.json
COPY data/users /app/data/users

CMD ["java", "-jar", "app.jar"]

EXPOSE 8080
