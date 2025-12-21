docker network inspect catalog_graphql_api_example_network >/dev/null 2>&1 || \
  docker network create -d bridge catalog_graphql_api_example_network

docker compose up
