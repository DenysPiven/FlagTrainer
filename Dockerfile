FROM maven:3.8.7-amazoncorretto-17 AS build
WORKDIR /build
COPY src /build/src
COPY pom.xml /build/
RUN mvn clean package

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /build/target/flagTrainer-0.0.1-SNAPSHOT.jar /app/app.jar

CMD ["java", "-jar", "app.jar"]

EXPOSE 8080