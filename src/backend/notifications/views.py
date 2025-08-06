from rest_framework.decorators import api_view
from rest_framework.response import Response
from notifications.models import Notification
from notifications.serializers import NotificationSerializer


@api_view(['GET', 'PUT'])
def get_notifications(request):
    if request.method == 'GET':
        try:
            notifications = Notification.objects.all().filter(user=request.user).order_by("-created_at")
            serializer = NotificationSerializer(notifications, many=True)
            return Response({"notifications": serializer.data}, status=200)
        except Exception:
            return Response({"notifications": []}, status=200)
    if request.method == 'PUT':
        try:
            notifications = Notification.objects.all().filter(user=request.user).update(seen=True)
            serializer = NotificationSerializer(notifications, many=True)
            return Response({"status": "success", "message": "notifications marked seen"}, status=200)
        except Exception:
            return Response({"error": "Something went wrong"}, status=400)