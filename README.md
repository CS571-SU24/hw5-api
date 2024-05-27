build
```bash
docker build . -t ctnelson1997/cs571-su24-hw5-api
docker push ctnelson1997/cs571-su24-hw5-api
```

run
```bash
docker pull ctnelson1997/cs571-su24-hw5-api
docker run --name=cs571_su24_hw5_api -d --restart=always -p 38105:38105 -v /cs571/su24/hw5:/cs571 ctnelson1997/cs571-su24-hw5-api
```
