# Build docker

```
git clone --recursive https://github.com/h0rm/react-graph-tests.git
cd react-graph-tests
docker build page-container .
```

# Run
```
docker run -it --rm -p <local port>:5000 --name page -v <local data folder>:/app/build/data page-container
```

```<local data folder>``` has to include a json file called
```processed-torch.csv.json``` with an array as top level element. Page is published at ```http://localhost:8001```.


# Graph structure

... missing
