# Quay.io

All Docker images are stored on Quay.io as public images

To build, tag, and push a new image, use `push`. e.g.:

`./push --src /home/keyvan/strider --tag strider:1.5.0`


## Login

In order to push or pull from Quay, you first need to login once to authenticate the Docker daemon.

Login with `./login`
