from rest_framework.permissions import BasePermission

class ProfilePermission(BasePermission):
    def has_permission(self, request, view):
        # Даём разрешение на просмотр всех пользователей суперпользователям
        # и тем кто имеет на это разрешение
        if view.action == "list":
            return request.user.is_superuser or request.user.has_perm("django_backend.view_profile")

        # Пропускаем GET, потому что будем проверять в has_object_permission
        return (
            request.user.is_superuser or
            request.method in ["PUT", "PATCH", "GET"] or
            request.method == "POST" and request.user.has_perm("django_backend.add_profile") or
            request.method == "DELETE" and request.user.has_perm("django_backend.delete_profile")
        )

    def has_object_permission(self, request, view, obj):
        # Выполняем проверку в has_permission, пропусаем
        if request.user.is_superuser or request.method in [
            "POST",
            "DELETE"
        ]:
            return True

        # Разрешить владельцу объекта просматривать и изменять свой профиль
        return request.method in ["GET"] and (
            request.user == obj.user
            or request.user.has_perm("django_backend.view_profile")
        ) or request.method in ["PUT", "PATCH"] and (
            request.user == obj.user
            or request.user.has_perm("django_backend.change_profile")
        )
