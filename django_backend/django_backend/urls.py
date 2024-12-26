"""django_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import re_path as url, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.conf.urls.static import static
from django_backend.views.user import urlpatterns as user_urlpatterns
from django_backend.views.file import urlpatterns as file_urlpatterns
from rest_framework.routers import DefaultRouter, SimpleRouter
from django_backend.swagger.swagger import schema_view

router = DefaultRouter()

from django_backend.views.genre import (
    GenreModelViewSet,
    GenreShortModelViewSet,
)

from django_backend.views.author import (
    AuthorModelViewSet,
    AuthorShortModelViewSet,
)

from django_backend.views.publishing_house import (
    PublishingHouseModelViewSet,
    PublishingHouseShortModelViewSet,
)

from django_backend.views.book_description import (
    BookDescriptionModelViewSet,
    BookDescriptionShortModelViewSet
)

from django_backend.views.book import BookModelViewSet
from django_backend.views.journal import JournalModelViewSet
from django_backend.views.user import ProfileModelViewSet

router.register(r"genres", GenreModelViewSet, 'genres')
router.register(r"short-genres", GenreShortModelViewSet, 'short-genres')
router.register(r"authors", AuthorModelViewSet, 'authors')
router.register(r"short-authors", AuthorShortModelViewSet, 'short-authors')
router.register(r"publishing-houses", PublishingHouseModelViewSet, 'publishing-houses')
router.register(r"short-publishing-houses", PublishingHouseShortModelViewSet, 'short-publishing-houses')
router.register(r"book-descriptions", BookDescriptionModelViewSet, 'book-descriptions')
router.register(r"short-book-descriptions", BookDescriptionShortModelViewSet, 'short-book-descriptions')
router.register(r"books", BookModelViewSet, 'books')
router.register(r"journals", JournalModelViewSet, 'journals')
router.register(r"users", ProfileModelViewSet, 'users')

urlpatterns = [
    path('admin/', admin.site.urls),
    *user_urlpatterns,
    *file_urlpatterns,
    path('api/', include(router.urls)),
    path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui')
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
