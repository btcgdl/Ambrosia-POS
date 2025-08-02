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

    // Test dependencies
    testImplementation("org.jetbrains.kotlin:kotlin-test:$2.1.20")
    // ktor dependencies
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.serialization.kotlinx.json)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.server.netty)
    testImplementation(libs.ktor.server.test.host)

    // logging
    implementation(libs.logback.classic)

    // Ktor services
    implementation("io.ktor:ktor-server-cors:$ktor-version")
    implementation("io.ktor:ktor-server-status-pages:$ktor-version")
    implementation("io.ktor:ktor-server-auth:$ktor-version")
    implementation("io.ktor:ktor-server-auth-jwt:$ktor-version")
    implementation("io.ktor:ktor-server-swagger:$ktor-version")
    implementation("io.ktor:ktor-server-openapi:$ktor-version")
    implementation("org.openapitools:openapi-generator:6.6.0")
    implementation("io.ktor:ktor-client-core:$ktor-version")
    implementation("io.ktor:ktor-client-cio:$ktor-version")
    implementation("io.ktor:ktor-client-auth:$ktor-version")
    implementation("io.ktor:ktor-client-content-negotiation:$ktor-version")

    // Database dependencies
    implementation("org.xerial:sqlite-jdbc:3.49.1.0")

    // Console helper
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

    // Cambiar el nombre del archivo resultante
    archiveFileName.set("ambrosia.jar")
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
