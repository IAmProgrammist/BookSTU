from rest_framework.permissions import BasePermission

class JournalPermission(BasePermission):
    def has_permission(self, request, view):
        # Пропускаем GET, потому что будем проверять в has_object_permission
        return (
            request.user.is_superuser or
            request.method == "GET" or
            request.method == "POST" and request.user.has_perm("django_backend.add_journal") or
            request.method in ["PUT", "PATCH"] and request.user.has_perm("django_backend.change_journal") or
            request.method == "DELETE" and request.user.has_perm("django_backend.delete_journal")
        )

    def has_object_permission(self, request, view, obj):
        # Выполняем проверку в has_permission, пропусаем
        if request.user.is_superuser or request.method in [
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
        ]:
            return True

        # Разрешить владельцу объекта, нужно для просмотра своего аккаунта
        return request.method == "GET" and (
            request.user == obj.user
            or request.user.has_perm("django_backend.view_journal")
        )
