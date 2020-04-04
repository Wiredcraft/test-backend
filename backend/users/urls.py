
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
from rest_framework.routers import DefaultRouter

from users.views import UserdataViewSet

router = DefaultRouter()
router.register('users', UserdataViewSet, basename='user')

urlpatterns = [
	path('', include(router.urls)),
	path('schema/', get_schema_view(
		title='Wiredcraft Backend Test',
		description='API for managing of user data',
		version='1.0.0',
	), name='openapi-schema'),
	path('docs/', TemplateView.as_view(
		template_name='swagger.html',
		extra_context={'schema_url': 'openapi-schema'}
	), name='swagger-doc'),
]
