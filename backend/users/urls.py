
from django.urls import path, include
from django.views.generic import TemplateView

from rest_framework.schemas import get_schema_view
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from users.views import UserdataViewSet, FriendshipViewSet

router = DefaultRouter()
router.register('users', UserdataViewSet, basename='users')

friends_router = routers.NestedSimpleRouter(router, r'users', lookup='user')
friends_router.register(r'friends', FriendshipViewSet, basename='friends')

urlpatterns = [
	path('', include(router.urls)),
	path('', include(friends_router.urls)),
	# auto-generated OpenAPI schema url
	path('schema/', get_schema_view(
		title='Wiredcraft Backend Test',
		description='API for managing user data',
		version='1.0.0',
	), name='openapi-schema'),
	# Swagger-based auto-generated doc
	path('docs/', TemplateView.as_view(
		template_name='swagger.html',
		extra_context={'schema_url': 'openapi-schema'}
	), name='swagger-doc'),
]
