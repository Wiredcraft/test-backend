
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from users.views import UserdataViewSet

router = DefaultRouter()
router.register('users', UserdataViewSet, basename='user')

urlpatterns = [
	path('', include(router.urls)),
]
