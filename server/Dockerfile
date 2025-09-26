FROM eclipse-temurin:21-jre-alpine

WORKDIR /build
COPY ./app/build/libs/ambrosia-0.2.0-beta.jar ./app/build/libs/ambrosia-0.2.0-beta.jar

# comment this line for faster builds, requires the user to manually invoke `./gradlew jar` outside docker build
# conversely, uncomment if you just want to do `docker build` without using `make run` or `make run-rebuild`
# RUN ./gradlew jar
EXPOSE 9154

ENTRYPOINT ["java", "-jar", "app/build/libs/ambrosia-0.2.0-beta.jar", "--phoenixd-url=http://phoenixd:9740", "--http-bind-ip=0.0.0.0"]
