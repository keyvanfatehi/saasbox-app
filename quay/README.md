# Quay.io

All Docker images are stored on Quay.io as public images

## Login

In order to push images to Quay.io, you must login using Docker

`docker login --email keyvanfatehi@gmail.com --username keyvanfatehi --password rs2MiPoT7jNA`

## Build & Push

To build, tag, and push a new image, use the `push` script. e.g.:

`quay/push --src /home/keyvan/strider --tag strider:1.5.0`

In this case `/home/keyvan/strider` must be a directory containing a Dockerfile and `strider` must be a valid product in `products/`
