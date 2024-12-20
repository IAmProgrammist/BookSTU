from rest_framework.permissions import BasePermission

class BookDescriptionPermission(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_superuser or
            request.method == "GET" or
            request.method == "POST" and request.user.has_perm("django_backend.add_bookdescription") or
            request.method in ["PUT", "PATCH"] and request.user.has_perm("django_backend.change_bookdescription") or
            request.method == "DELETE" and request.user.has_perm("django_backend.delete_bookdescription")
        )
