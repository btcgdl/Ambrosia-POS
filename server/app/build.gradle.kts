plugins {
    // Apply the org.jetbrains.kotlin.jvm Plugin to add support for Kotlin.
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
    alias(libs.plugins.kotlin.plugin.serialization)
    // Apply the application plugin to add support for building a CLI application in Java.
    application
}

repositories {
    // Use Maven Central for resolving dependencies.
    mavenCentral()
}

dependencies {
    // Use JUnit Jupiter for testing.
    testImplementation(libs.junit.jupiter)
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    // ktor dependencies
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.serialization.kotlinx.json)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.server.netty)
    testImplementation(libs.ktor.server.test.host)

    // logging
    implementation(libs.logback.classic)
    implementation("io.ktor:ktor-server-cors:3.1.2")
    implementation("io.ktor:ktor-server-status-pages:3.1.2")
    implementation("io.ktor:ktor-server-auth:3.1.2")
    implementation("io.ktor:ktor-server-auth-jwt:3.1.2")
    implementation("org.xerial:sqlite-jdbc:3.49.1.0")
    implementation("io.ktor:ktor-server-swagger:3.1.2")
    implementation("io.ktor:ktor-server-openapi:3.1.2")
    implementation("org.openapitools:openapi-generator:6.6.0")
    implementation("io.ktor:ktor-client-core:3.1.2")
    implementation("io.ktor:ktor-client-cio:3.1.2")
    implementation("io.ktor:ktor-client-auth:3.1.2")
    implementation("io.ktor:ktor-client-content-negotiation:3.1.2")
    // This dependency is used by the application.
    implementation(libs.guava)

    implementation("com.github.ajalt.clikt:clikt:5.0.3")
}

tasks.named<JavaExec>("run") {
    jvmArgs("-Dlogback.configurationFile=Ambrosia-Logs.xml")
}

// Configure the JAR task to create a fat JAR with all dependencies included.
tasks.named<Jar>("jar") {
    manifest {
        attributes["Main-Class"] = "pos.ambrosia.AmbrosiaKt"
    }
    
    // Incluir todas las dependencias (fat jar)
    from(configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) })
    
    // Asegurar que los archivos de recursos estén incluidos
    from("src/main/resources") {
        include("**/*")
    }
    
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
}

// Apply a specific Java toolchain to ease working on different environments.
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

application {
    // Define the main class for the application.
    mainClass = "pos.ambrosia.AmbrosiaKt"
}

tasks.named<Test>("test") {
    // Use JUnit Platform for unit tests.
    useJUnitPlatform()
}
