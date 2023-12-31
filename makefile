mongodbinit:
	@echo "Starting mongodb container..."
	docker run --rm --name mongodb -d -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root -p 1234:27017 mongo

mongodbstop:
	@echo "Stopping mongodb container"
	docker container stop mongodb

mongoconfig:
	docker exec -it mongodb mongosh -u root -p root