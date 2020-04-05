# Wiredcraft Back-end Developer Test

## Motivation

Hi there! My name is Michael Sayapin.

This is my take on the test, written in Python / Django with DRF, with Postgres as DB. While I realize that original requirements say Node.js, I've noticed Python positions at Wiredcraft before, and decided to give it a shot. Even if nothing comes out of it, it was a nice exercise, thank you!

## Installation

Clone the repo and run `docker-compose up -d`, then navigate to http://localhost:8080/api/docs/ to view the documentation.

## Notes & Thinking process

I understand that you want to see coding skills, but I wanted to emphasize "not reinventing the wheel" as well, and used several well-documented and stable Python packages: Django + REST Framework, Swagger for the docs. I've been working with Django since 0.96, have a few commits in the core, and used DRF extensively in the past too.

For the DB I picked Postgres. It's not NoSQL, but there are many Postgres deployments at scale, it has (indexed) JSON(B) support out of the box for some NoSQL-ish goodness, and it's GIS capabilities are top notch. I've worked with Citus and TimescaleDB at scale, performance is not a bottleneck.

I tried to follow the spec step by step, without "knowing" the "advanced requirements" beforehand. So the code evolved organically and you can check the commit history to see the major changes involved.

> The API should follow typical RESTful API design pattern

Please see http://localhost:8080/api/docs/ for the auto-generated API docs. I used verb-based REST API, without any versioning, pagination or auth for now.

> Provide proper unit test

Tests are in backend/users/tests.py, I cover every API endpoint in an integration-style test. There is no point testing Django ORM as it's pretty well covered, and I kept all the logic in the views.

> Provide proper API document

The document uses annotations with an auto-generated OpenAPI schema rendered by Swagger.

> Provide a complete user auth (authentication/authorization/etc.) strategy, such as OAuth

I skipped this one because I didn't want to involve Django user auth, and `Userdata` model is separate from it. In a nutshell, we'd need to add a proper username column, password, set of APIs to register, authenticate, issue OAuth token, refresh token etc. There are good packages that can take care of it, otherwise it's mostly straightforward.

> Provide a complete logging (when/how/etc.) strategy

I've added a mixin called `AuditTrailMixin` that hooks in the APIView descendants and logs (using Python `logging` lib) traces in text format. Going forward, I would probably change the logging format to JSON, and rework the logic around create-s and destroy-s.

> Imagine we have a new requirement right now that the user instances need to link to each other, i.e., a list of "followers/following" or "friends". Can you find out how you would design the model structure and what API you would build for querying or modifying it?

I used a symmetric M2M field on the user model for this, and also created an intermediary table. It's not strictly necessary with these requirements, but going forward I thought it might be important to have ability to add friend requests, statuses and so on. The API follows REST practice here with a 2nd-level endpoint `/api/users/{id}/friends/`. So "unfriending" is a simple `DELETE` request from either side.

> Related to the requirement above, suppose the address of user now includes a geographic coordinate(i.e., latitude and longitude), can you build an API that, given a user name, return the nearby friends

This was the biggest "change" as it required me to switch to PostGIS. It's never a good idea to reinvent the wheel with geographic coordinates, so I used GeoJSON for respresentation, and WGS84 projection that gives me distances in meters out of the box. Perhaps I "prematurely overoptimized" this one (`spatial_index=True` creates a SP-GiST index), but in my experience this kind of queries ("nearby" things over m2m relations) tend to become bottlenecks real quick. The API for this one breaks REST a bit in favor of RPC-ish call: `/api/users/{id}/friends/nearby/`.

Going forward, I would probably split user data and addresses in separate models, which is usually the case for e-commerce and many other scenarios (users can have more than one address).

## PS

Thanks for reading! I'm in Shanghai and happy to chat anytime: michael@smartmeal.cn or Wechat 13122231231.
