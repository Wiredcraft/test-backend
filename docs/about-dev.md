# About the development of this project

## Note

If you try to run this project on a Windows, make sure WSL and Docker are appropriately installed.

## What happens when I run `./dev backend`?

1. Creating the directory of `./tmp` . And several sub-directory are included. (Only if they were not existing)
1. A database container will be created. If you have previous data, they will be reused. The Basis of this container is the official PostGIS image on docker hub.
1. Creating a backend-development container, and enter it with bash.

## When I run `./dev down`

1. All containers will be removed.
1. All of the data are persistent.

## What happens when I Delete project-dir ?

All of the code and data will be removed.
