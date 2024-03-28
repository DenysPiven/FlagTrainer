# docker build -f Dockerfile.build -t flagtrainer-builder .

FROM maven:3.8.7-amazoncorretto-17 AS build
WORKDIR /build
COPY src /build/src
COPY pom.xml /build/
RUN mvn clean package