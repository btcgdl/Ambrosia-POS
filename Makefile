.PHONY: install-jdk install-docker install-docker-compose build-jar up run

install-jdk:
	@if ! command -v java > /dev/null 2>&1 || ! java -version 2>&1 | grep -q "21"; then \
		echo "Installing OpenJDK 21..."; \
		sudo apt update; \
		sudo apt install -y openjdk-21-jdk; \
		echo "OpenJDK 21 installed."; \
	else \
		echo "OpenJDK 21 already available."; \
	fi

install-docker:
	@if ! command -v docker > /dev/null 2>&1; then \
		echo "Installing Docker..."; \
		sudo apt update; \
		sudo apt install -y docker.io; \
		sudo systemctl start docker; \
		sudo systemctl enable docker; \
		echo "Docker installed and started."; \
	else \
		echo "Docker already available."; \
	fi

install-docker-compose:
	@if ! command -v docker-compose > /dev/null 2>&1; then \
		echo "Installing docker-compose..."; \
		sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$$(uname -s)-$$(uname -m)" -o /usr/local/bin/docker-compose; \
		sudo chmod +x /usr/local/bin/docker-compose; \
		echo "docker-compose installed."; \
	else \
		echo "docker-compose already installed."; \
	fi

build-jar:
	cd server && ./gradlew jar

up:
	docker-compose up

run: install-jdk install-docker install-docker-compose build-jar up
