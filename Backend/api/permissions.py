from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    Only admin users can create, update, or delete.
    Authenticated users can read (GET).
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff
