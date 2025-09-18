FROM openjdk:21-jdk-slim

WORKDIR /build
COPY . .

# comment this line for faster builds, requires the user to manually invoke `./gradlew jar` outside docker build
RUN ./gradlew jar
EXPOSE 9154

ENTRYPOINT ["java", "-jar", "app/build/libs/ambrosia-0.1.2-alpha.jar", "--phoenixd-url=http://phoenixd:9740", "--http-bind-ip=0.0.0.0"]
