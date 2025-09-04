FROM openjdk:21-jdk-slim

RUN apt update && apt install net-tools

WORKDIR /build
COPY . .

RUN mkdir /root/.Ambrosia-POS && echo 'http-bind-ip=0.0.0.0' >> /root/.Ambrosia-POS/ambrosia.conf
# RUN ./gradlew jar
EXPOSE 9154

ENTRYPOINT ["java", "-jar", "app/build/libs/ambrosia-0.1.2-alpha.jar"]
